import { supabase } from '../config/supabase';

export interface IEmbarcacao {
  id?: string;
  tipo: string;
  laboratorio_id?: string;
  laboratorios?: { nome: string };
  created_at?: string;
  updated_at?: string;
}

class Embarcacao {
  async findAll(): Promise<IEmbarcacao[]> {
    const { data, error } = await supabase
      .from('embarcacoes')
      .select(`
        *,
        laboratorios (
          nome
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<IEmbarcacao | null> {
    const { data, error } = await supabase
      .from('embarcacoes')
      .select(`
        *,
        laboratorios (
          nome
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(embarcacao: { tipo: string; laboratorio_id?: string }): Promise<IEmbarcacao> {
    const { data, error } = await supabase
      .from('embarcacoes')
      .insert([embarcacao])
      .select(`
        *,
        laboratorios (
          nome
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, embarcacao: { tipo?: string; laboratorio_id?: string }): Promise<IEmbarcacao | null> {
    const { data, error } = await supabase
      .from('embarcacoes')
      .update({ ...embarcacao, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        laboratorios (
          nome
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('embarcacoes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

export default new Embarcacao();