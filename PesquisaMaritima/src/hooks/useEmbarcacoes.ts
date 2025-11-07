import { useState, useEffect } from 'react';
import { embarcacoesAPI, IEmbarcacao } from '../services/api';
import { toast } from 'sonner';

export type Embarcacao = IEmbarcacao;

export const useEmbarcacoes = () => {
  const [embarcacoes, setEmbarcacoes] = useState<IEmbarcacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmbarcacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await embarcacoesAPI.getAll();
      setEmbarcacoes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar embarcações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmbarcacoes();
  }, []);

  return { data: embarcacoes, isLoading: loading, error, refetch: fetchEmbarcacoes };
};

export const useEmbarcacaoById = (id: string) => {
  const [embarcacao, setEmbarcacao] = useState<IEmbarcacao | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchEmbarcacao = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await embarcacoesAPI.getById(id);
        setEmbarcacao(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar embarcação');
      } finally {
        setLoading(false);
      }
    };

    fetchEmbarcacao();
  }, [id]);

  return { data: embarcacao, isLoading: loading, error };
};

export const useCreateEmbarcacao = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (embarcacao: IEmbarcacao) => {
      setIsPending(true);
      try {
        await embarcacoesAPI.create(embarcacao);
        toast.success('Embarcação criada com sucesso!');
        window.location.reload(); // Recarrega para atualizar a lista
      } catch (error) {
        toast.error('Erro ao criar embarcação');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useUpdateEmbarcacao = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async ({ id, data }: { id: string; data: Partial<IEmbarcacao> }) => {
      setIsPending(true);
      try {
        await embarcacoesAPI.update(id, data);
        toast.success('Embarcação atualizada com sucesso!');
        window.location.reload();
      } catch (error) {
        toast.error('Erro ao atualizar embarcação');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useDeleteEmbarcacao = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (id: string, options?: { onSuccess?: () => void }) => {
      setIsPending(true);
      try {
        await embarcacoesAPI.delete(id);
        toast.success('Embarcação deletada com sucesso!');
        if (options?.onSuccess) options.onSuccess();
        window.location.reload();
      } catch (error) {
        toast.error('Erro ao deletar embarcação');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};
