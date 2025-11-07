import { useState, useEffect } from 'react';
import { favoritosAPI, IFavorito } from '../services/api';
import { toast } from 'sonner';

export type Favorito = IFavorito;

export const useFavoritosByUser = (userId: string) => {
  const [favoritos, setFavoritos] = useState<IFavorito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavoritos = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await favoritosAPI.getByUser(userId);
      setFavoritos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar favoritos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritos();
  }, [userId]);

  return { data: favoritos, isLoading: loading, error, refetch: fetchFavoritos };
};

export const useCheckFavorito = (userId: string, coletaId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !coletaId) return;
    
    const checkFavorito = async () => {
      setLoading(true);
      try {
        const result = await favoritosAPI.check(userId, coletaId);
        setIsFavorite(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkFavorito();
  }, [userId, coletaId]);

  return { data: isFavorite, isLoading: loading };
};

export const useToggleFavorito = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async ({ coletaId, userId, isFavorite }: { coletaId: string; userId: string; isFavorite: boolean }) => {
      setIsPending(true);
      try {
        if (isFavorite) {
          await favoritosAPI.delete(userId, coletaId);
          toast.success('Removido dos favoritos');
        } else {
          await favoritosAPI.create(userId, coletaId);
          toast.success('Adicionado aos favoritos');
        }
      } catch (error) {
        toast.error('Erro ao atualizar favoritos');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useCreateFavorito = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async ({ userId, coletaId }: { userId: string; coletaId: string }) => {
      setIsPending(true);
      try {
        await favoritosAPI.create(userId, coletaId);
        toast.success('Adicionado aos favoritos!');
      } catch (error) {
        toast.error('Erro ao adicionar favorito');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useDeleteFavorito = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async ({ userId, coletaId }: { userId: string; coletaId: string }) => {
      setIsPending(true);
      try {
        await favoritosAPI.delete(userId, coletaId);
        toast.success('Removido dos favoritos!');
      } catch (error) {
        toast.error('Erro ao remover favorito');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};
