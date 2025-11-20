import supabase from '../config/supabase';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  descricao?: string;
  cargo?: string;
  status: boolean;
  foto_perfil?: string;
  laboratorio_id?: string;
  created_at?: string;
  updated_at?: string;
  user_roles?: {
    role: string;
  }[];
  laboratorios?: {
    nome: string;
  };
}

interface UserWithRole extends UserProfile {
  role?: string;
}

class User {
  /**
   * Get all users with their roles and lab info
   * Admins are excluded from the list (can't manage other admins)
   */
  static async findAll(): Promise<UserWithRole[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles (role),
        laboratorios (nome)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter out admins and format the data
    const usersWithRoles = (data || []).map((user: any) => ({
      ...user,
      role: user.user_roles?.[0]?.role || 'researcher',
    }));

    // Exclude admins from the list
    return usersWithRoles.filter((user: UserWithRole) => user.role !== 'admin');
  }

  /**
   * Get a single user by ID
   */
  static async findById(id: string): Promise<UserWithRole | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles (role),
        laboratorios (nome)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      ...data,
      role: data.user_roles?.[0]?.role || 'researcher',
    };
  }

  /**
   * Update user profile (admin can update any non-admin user)
   */
  static async updateProfile(id: string, updates: Partial<UserProfile>) {
    // Check if target user is admin (we don't allow updating admins)
    const targetUser = await this.findById(id);
    if (targetUser?.role === 'admin') {
      throw new Error('Cannot modify admin users');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user_roles (role),
        laboratorios (nome)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      role: data.user_roles?.[0]?.role || 'researcher',
    };
  }

  /**
   * Update user role (admin only)
   */
  static async updateRole(userId: string, newRole: 'admin' | 'researcher') {
    // Check if target user is already admin (can't change admin role)
    const targetUser = await this.findById(userId);
    if (targetUser?.role === 'admin') {
      throw new Error('Cannot modify admin users');
    }

    // Delete existing role
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Insert new role
    const { data, error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: newRole })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Deactivate/activate user (admin only)
   */
  static async updateStatus(userId: string, status: boolean) {
    // Check if target user is admin (can't deactivate admins)
    const targetUser = await this.findById(userId);
    if (targetUser?.role === 'admin') {
      throw new Error('Cannot modify admin users');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId)
      .select(`
        *,
        user_roles (role),
        laboratorios (nome)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      role: data.user_roles?.[0]?.role || 'researcher',
    };
  }
}

export default User;
