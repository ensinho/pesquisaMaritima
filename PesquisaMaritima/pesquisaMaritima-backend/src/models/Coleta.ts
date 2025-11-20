import { supabase } from '../config/supabase';

export interface IColeta {
  id?: string;
  data: string;
  localizacao?: string;
  local?: string;
  nome_cientifico?: string;
  nome_comum?: string;
  comprimento?: number;
  peso?: number;
  temperatura?: number;
  salinidade?: number;
  ph?: number;
  oxigenio_dissolvido?: number;
  turbidez?: number;
  profundidade?: number;
  observacoes?: string;
  foto_1?: string;
  foto_2?: string;
  foto_3?: string;
  embarcacao_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  profiles?: {
    nome: string;
    email: string;
    laboratorio_id?: string;
    laboratorios?: {
      nome: string;
    };
  };
  embarcacoes?: {
    tipo: string;
  };
}

class Coleta {
  async findAll(): Promise<IColeta[]> {
    const { data, error } = await supabase
      .from('coletas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get all collections with researcher and vessel info (for admin)
   */
  async findAllWithDetails(): Promise<IColeta[]> {
    const { data, error } = await supabase
      .from('coletas')
      .select(`
        *,
        profiles!coletas_user_id_fkey (
          nome,
          email,
          laboratorio_id,
          laboratorios (nome)
        ),
        embarcacoes (tipo)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Get collections filtered by researcher ID (for admin)
   */
  async findByResearcher(researcherId: string): Promise<IColeta[]> {
    const { data, error } = await supabase
      .from('coletas')
      .select(`
        *,
        profiles!coletas_user_id_fkey (
          nome,
          email,
          laboratorio_id,
          laboratorios (nome)
        ),
        embarcacoes (tipo)
      `)
      .eq('user_id', researcherId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async findByUser(userId: string): Promise<IColeta[]> {
    const { data, error } = await supabase
      .from('coletas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<IColeta | null> {
    const { data, error } = await supabase
      .from('coletas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(coleta: IColeta): Promise<IColeta> {
    const { data, error } = await supabase
      .from('coletas')
      .insert([coleta])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, coleta: Partial<IColeta>): Promise<IColeta | null> {
    const { data, error } = await supabase
      .from('coletas')
      .update({ ...coleta, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('coletas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Admin-specific: Force delete any collection
   */
  async adminDelete(id: string): Promise<boolean> {
    // Uses service role or admin privileges
    const { error } = await supabase
      .from('coletas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  /**
   * Admin-specific: Force update any collection
   */
  async adminUpdate(id: string, coleta: Partial<IColeta>): Promise<IColeta | null> {
    const { data, error } = await supabase
      .from('coletas')
      .update({ ...coleta, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export default new Coleta();