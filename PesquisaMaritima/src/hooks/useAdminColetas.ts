import { useState, useEffect } from 'react';
import { coletasAPI, IColeta } from '../services/api';
import { toast } from 'sonner';

export const useAdminColetas = () => {
  const [coletas, setColetas] = useState<IColeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColetas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await coletasAPI.getAllWithDetails();
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

export const useAdminColetasByResearcher = (researcherId: string | null) => {
  const [coletas, setColetas] = useState<IColeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColetas = async () => {
    if (!researcherId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await coletasAPI.getByResearcher(researcherId);
      setColetas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar coletas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColetas();
  }, [researcherId]);

  return { 
    data: coletas, 
    isLoading: loading, 
    error, 
    refetch: fetchColetas 
  };
};

export const useAdminUpdateColeta = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (
      { id, data }: { id: string; data: Partial<IColeta> },
      options?: { onSuccess?: () => void }
    ) => {
      setIsPending(true);
      try {
        await coletasAPI.adminUpdate(id, data);
        toast.success('Coleta atualizada com sucesso!');
        if (options?.onSuccess) options.onSuccess();
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

export const useAdminDeleteColeta = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (id: string, options?: { onSuccess?: () => void }) => {
      setIsPending(true);
      try {
        await coletasAPI.adminDelete(id);
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
