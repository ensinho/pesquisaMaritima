export interface Coleta {
  id: string;
  nome_comum: string;
  nome_cientifico: string;
  data: Date;
  local: string;
  comprimento: number;
  peso: number;
  embarcacao_id: string;
  foto_1?: string;
  foto_2?: string;
  foto_3?: string;
}

export interface Embarcacao {
  id: string;
  tipo: string;
  capacidade: number;
  // Add other relevant fields as necessary
}