import { useState, useEffect } from 'react';
import { coletasAPI, IColeta } from '../services/api';
import { toast } from 'sonner';

export type Coleta = IColeta;

export const useColetas = () => {
  const [coletas, setColetas] = useState<IColeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColetas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await coletasAPI.getAll();
      setColetas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar coletas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColetas();
  }, []);

  return {
    data: coletas,
    isLoading: loading,
    error,
    refetch: fetchColetas,
  };
};

export const useColetasByUser = (userId: string) => {
  const [coletas, setColetas] = useState<IColeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColetas = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await coletasAPI.getByUser(userId);
      setColetas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar coletas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColetas();
  }, [userId]);

  return { data: coletas, isLoading: loading, error, refetch: fetchColetas };
};

export const useColetaById = (id: string) => {
  const [coleta, setColeta] = useState<IColeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchColeta = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await coletasAPI.getById(id);
        setColeta(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar coleta');
      } finally {
        setLoading(false);
      }
    };

    fetchColeta();
  }, [id]);

  return { data: coleta, isLoading: loading, error };
};

export const useCreateColeta = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (coleta: IColeta) => {
      setIsPending(true);
      try {
        await coletasAPI.create(coleta);
        toast.success('Coleta criada com sucesso!');
      } catch (error) {
        toast.error('Erro ao criar coleta');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useUpdateColeta = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async ({ id, data }: { id: string; data: Partial<IColeta> }) => {
      setIsPending(true);
      try {
        await coletasAPI.update(id, data);
        toast.success('Coleta atualizada com sucesso!');
      } catch (error) {
        toast.error('Erro ao atualizar coleta');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useDeleteColeta = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (id: string, options?: { onSuccess?: () => void }) => {
      setIsPending(true);
      try {
        await coletasAPI.delete(id);
        toast.success('Coleta deletada com sucesso!');
        if (options?.onSuccess) options.onSuccess();
      } catch (error) {
        toast.error('Erro ao deletar coleta');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};
