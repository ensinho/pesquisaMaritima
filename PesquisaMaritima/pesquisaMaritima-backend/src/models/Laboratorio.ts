import { supabase } from '../config/supabase';

export interface ILaboratorio {
  id?: string;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

class Laboratorio {
  async findAll(): Promise<ILaboratorio[]> {
    const { data, error } = await supabase
      .from('laboratorios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<ILaboratorio | null> {
    const { data, error } = await supabase
      .from('laboratorios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(laboratorio: { nome: string }): Promise<ILaboratorio> {
    const { data, error } = await supabase
      .from('laboratorios')
      .insert([laboratorio])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, laboratorio: { nome: string }): Promise<ILaboratorio | null> {
    const { data, error } = await supabase
      .from('laboratorios')
      .update({ ...laboratorio, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('laboratorios')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

export default new Laboratorio();
