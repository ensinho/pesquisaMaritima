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

export interface IUser {
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
  role?: string;
  laboratorios?: {
    nome: string;
  };
}

// Coletas API
export const coletasAPI = {
  async getAll(): Promise<IColeta[]> {
    const response = await fetch(`${API_URL}/coletas`);
    if (!response.ok) throw new Error('Failed to fetch coletas');
    return response.json();
  },

  async getAllWithDetails(): Promise<IColeta[]> {
    const response = await fetch(`${API_URL}/coletas/details`);
    if (!response.ok) throw new Error('Failed to fetch coletas with details');
    return response.json();
  },

  async getByResearcher(researcherId: string): Promise<IColeta[]> {
    const response = await fetch(`${API_URL}/coletas/researcher/${researcherId}`);
    if (!response.ok) throw new Error('Failed to fetch researcher coletas');
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

  async adminUpdate(id: string, coleta: Partial<IColeta>): Promise<IColeta> {
    const response = await fetch(`${API_URL}/coletas/admin/${id}`, {
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

  async adminDelete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/coletas/admin/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete coleta');
  },
};

// Users API
export const usersAPI = {
  async getAll(): Promise<IUser[]> {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getById(id: string): Promise<IUser> {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async updateProfile(id: string, updates: Partial<IUser>): Promise<IUser> {
    const response = await fetch(`${API_URL}/users/${id}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update user profile');
    return response.json();
  },

  async updateRole(id: string, role: 'admin' | 'researcher'): Promise<IUser> {
    const response = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update user role');
    return response.json();
  },

  async updateStatus(id: string, status: boolean): Promise<IUser> {
    const response = await fetch(`${API_URL}/users/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update user status');
    return response.json();
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