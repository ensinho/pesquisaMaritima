const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

export interface ILaboratorio {
  id?: string;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

export interface IEmbarcacao {
  id?: string;
  tipo: string;
  laboratorio_id?: string;
  laboratorios?: { nome: string };
  created_at?: string;
  updated_at?: string;
}

export interface IFavorito {
  id?: string;
  user_id: string;
  coleta_id: string;
  created_at?: string;
}

// Coletas API
export const coletasAPI = {
  async getAll(): Promise<IColeta[]> {
    const response = await fetch(`${API_URL}/coletas`);
    if (!response.ok) throw new Error('Failed to fetch coletas');
    return response.json();
  },

  async getByUser(userId: string): Promise<IColeta[]> {
    const response = await fetch(`${API_URL}/coletas/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user coletas');
    return response.json();
  },

  async getById(id: string): Promise<IColeta> {
    const response = await fetch(`${API_URL}/coletas/${id}`);
    if (!response.ok) throw new Error('Failed to fetch coleta');
    return response.json();
  },

  async create(coleta: IColeta): Promise<IColeta> {
    const response = await fetch(`${API_URL}/coletas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coleta),
    });
    if (!response.ok) throw new Error('Failed to create coleta');
    return response.json();
  },

  async update(id: string, coleta: Partial<IColeta>): Promise<IColeta> {
    const response = await fetch(`${API_URL}/coletas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coleta),
    });
    if (!response.ok) throw new Error('Failed to update coleta');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/coletas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete coleta');
  },
};

// Laboratórios API
export const laboratoriosAPI = {
  async getAll(): Promise<ILaboratorio[]> {
    const response = await fetch(`${API_URL}/laboratorios`);
    if (!response.ok) throw new Error('Failed to fetch laboratorios');
    return response.json();
  },

  async getById(id: string): Promise<ILaboratorio> {
    const response = await fetch(`${API_URL}/laboratorios/${id}`);
    if (!response.ok) throw new Error('Failed to fetch laboratorio');
    return response.json();
  },

  async create(laboratorio: { nome: string }): Promise<ILaboratorio> {
    const response = await fetch(`${API_URL}/laboratorios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laboratorio),
    });
    if (!response.ok) throw new Error('Failed to create laboratorio');
    return response.json();
  },

  async update(id: string, laboratorio: { nome: string }): Promise<ILaboratorio> {
    const response = await fetch(`${API_URL}/laboratorios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laboratorio),
    });
    if (!response.ok) throw new Error('Failed to update laboratorio');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/laboratorios/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete laboratorio');
  },
};

// Embarcações API
export const embarcacoesAPI = {
  async getAll(): Promise<IEmbarcacao[]> {
    const response = await fetch(`${API_URL}/embarcacoes`);
    if (!response.ok) throw new Error('Failed to fetch embarcacoes');
    return response.json();
  },

  async getById(id: string): Promise<IEmbarcacao> {
    const response = await fetch(`${API_URL}/embarcacoes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch embarcacao');
    return response.json();
  },

  async create(embarcacao: IEmbarcacao): Promise<IEmbarcacao> {
    const response = await fetch(`${API_URL}/embarcacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embarcacao),
    });
    if (!response.ok) throw new Error('Failed to create embarcacao');
    return response.json();
  },

  async update(id: string, embarcacao: Partial<IEmbarcacao>): Promise<IEmbarcacao> {
    const response = await fetch(`${API_URL}/embarcacoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embarcacao),
    });
    if (!response.ok) throw new Error('Failed to update embarcacao');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/embarcacoes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete embarcacao');
  },
};

// Favoritos API
export const favoritosAPI = {
  async getByUser(userId: string): Promise<IFavorito[]> {
    const response = await fetch(`${API_URL}/favoritos/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch favoritos');
    return response.json();
  },

  async check(userId: string, coletaId: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/favoritos/check/${userId}/${coletaId}`);
    if (!response.ok) throw new Error('Failed to check favorito');
    const data = await response.json();
    return data.isFavorite;
  },

  async create(userId: string, coletaId: string): Promise<IFavorito> {
    const response = await fetch(`${API_URL}/favoritos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, coleta_id: coletaId }),
    });
    if (!response.ok) throw new Error('Failed to create favorito');
    return response.json();
  },

  async delete(userId: string, coletaId: string): Promise<void> {
    const response = await fetch(`${API_URL}/favoritos/${userId}/${coletaId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete favorito');
  },
};
