import { useState, useEffect } from 'react';
import { laboratoriosAPI, ILaboratorio } from '../services/api';
import { toast } from 'sonner';

export type Laboratorio = ILaboratorio;

export const useLaboratorios = () => {
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLaboratorios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await laboratoriosAPI.getAll();
      setLaboratorios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar laboratórios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaboratorios();
  }, []);

  return { data: laboratorios, isLoading: loading, error, refetch: fetchLaboratorios };
};

export const useLaboratorioById = (id: string) => {
  const [laboratorio, setLaboratorio] = useState<ILaboratorio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchLaboratorio = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await laboratoriosAPI.getById(id);
        setLaboratorio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar laboratório');
      } finally {
        setLoading(false);
      }
    };

    fetchLaboratorio();
  }, [id]);

  return { data: laboratorio, isLoading: loading, error };
};

export const useCreateLaboratorio = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (laboratorio: { nome: string }) => {
      setIsPending(true);
      try {
        await laboratoriosAPI.create(laboratorio);
        toast.success('Laboratório criado com sucesso!');
        window.location.reload();
      } catch (error) {
        toast.error('Erro ao criar laboratório');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useUpdateLaboratorio = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async ({ id, data }: { id: string; data: { nome: string } }) => {
      setIsPending(true);
      try {
        await laboratoriosAPI.update(id, data);
        toast.success('Laboratório atualizado com sucesso!');
        window.location.reload();
      } catch (error) {
        toast.error('Erro ao atualizar laboratório');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useDeleteLaboratorio = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (id: string) => {
      setIsPending(true);
      try {
        await laboratoriosAPI.delete(id);
        toast.success('Laboratório deletado com sucesso!');
        window.location.reload();
      } catch (error) {
        toast.error('Erro ao deletar laboratório');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};
