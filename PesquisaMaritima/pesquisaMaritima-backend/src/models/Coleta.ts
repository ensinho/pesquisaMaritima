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
    // Get all coletas
    const { data: coletas, error } = await supabase
      .from('coletas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!coletas || coletas.length === 0) return [];

    // Get unique user IDs and embarcacao IDs
    const userIds = [...new Set(coletas.map(c => c.user_id).filter(Boolean))];
    const embarcacaoIds = [...new Set(coletas.map(c => c.embarcacao_id).filter(Boolean))];

    // Fetch profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nome, email, laboratorio_id')
      .in('id', userIds);

    // Fetch laboratorios
    const labIds = [...new Set(profiles?.map(p => p.laboratorio_id).filter(Boolean) || [])];
    const { data: labs } = labIds.length > 0 
      ? await supabase.from('laboratorios').select('id, nome').in('id', labIds)
      : { data: [] };

    // Fetch embarcacoes
    const { data: embarcacoes } = embarcacaoIds.length > 0
      ? await supabase.from('embarcacoes').select('id, tipo').in('id', embarcacaoIds)
      : { data: [] };

    // Create maps for quick lookup
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    const labMap = new Map(labs?.map(l => [l.id, l]) || []);
    const embarcacaoMap = new Map(embarcacoes?.map(e => [e.id, e]) || []);

    // Combine data
    return coletas.map(coleta => {
      const profile = coleta.user_id ? profileMap.get(coleta.user_id) : null;
      const embarcacao = coleta.embarcacao_id ? embarcacaoMap.get(coleta.embarcacao_id) : null;
      const laboratorio = profile?.laboratorio_id ? labMap.get(profile.laboratorio_id) : null;

      return {
        ...coleta,
        profiles: profile ? {
          ...profile,
          laboratorios: laboratorio
        } : null,
        embarcacoes: embarcacao
      };
    });
  }

  /**
   * Get collections filtered by researcher ID (for admin)
   */
  async findByResearcher(researcherId: string): Promise<IColeta[]> {
    // Get coletas for this researcher
    const { data: coletas, error } = await supabase
      .from('coletas')
      .select('*')
      .eq('user_id', researcherId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!coletas || coletas.length === 0) return [];

    // Get embarcacao IDs
    const embarcacaoIds = [...new Set(coletas.map(c => c.embarcacao_id).filter(Boolean))];

    // Fetch researcher profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, nome, email, laboratorio_id')
      .eq('id', researcherId)
      .single();

    // Fetch laboratorio if exists
    let laboratorio = null;
    if (profile?.laboratorio_id) {
      const { data: lab } = await supabase
        .from('laboratorios')
        .select('id, nome')
        .eq('id', profile.laboratorio_id)
        .single();
      laboratorio = lab;
    }

    // Fetch embarcacoes
    const { data: embarcacoes } = embarcacaoIds.length > 0
      ? await supabase.from('embarcacoes').select('id, tipo').in('id', embarcacaoIds)
      : { data: [] };

    // Create embarcacao map
    const embarcacaoMap = new Map(embarcacoes?.map(e => [e.id, e]) || []);

    // Combine data
    return coletas.map(coleta => {
      const embarcacao = coleta.embarcacao_id ? embarcacaoMap.get(coleta.embarcacao_id) : null;

      return {
        ...coleta,
        profiles: profile ? {
          ...profile,
          laboratorios: laboratorio
        } : null,
        embarcacoes: embarcacao
      };
    });
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