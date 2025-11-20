import { supabase } from "../config/supabase";

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
    // First, get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*, laboratorios (nome)')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;
    if (!profiles || profiles.length === 0) return [];

    // Get all user roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) throw rolesError;

    // Create a map of user_id to role
    const roleMap = new Map(
      (roles || []).map((r: any) => [r.user_id, r.role])
    );

    // Combine profiles with roles
    const usersWithRoles: UserWithRole[] = profiles.map((profile: any) => ({
      ...profile,
      role: roleMap.get(profile.id) || 'researcher',
    }));

    // Exclude admins from the list
    return usersWithRoles.filter((user: UserWithRole) => user.role !== 'admin');
  }

  /**
   * Get a single user by ID
   */
  static async findById(id: string): Promise<UserWithRole | null> {
    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, laboratorios (nome)')
      .eq('id', id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') return null;
      throw profileError;
    }

    // Get user role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', id)
      .single();

    // If no role found, default to researcher
    const role = roleData?.role || 'researcher';

    return {
      ...profile,
      role,
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
      .select('*, laboratorios (nome)')
      .single();

    if (error) throw error;

    // Get the updated user with role
    return await this.findById(id);
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
      .select('*, laboratorios (nome)')
      .single();

    if (error) throw error;

    // Get the updated user with role
    return await this.findById(userId);
  }
}

export default User;