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
}

export default new Coleta();