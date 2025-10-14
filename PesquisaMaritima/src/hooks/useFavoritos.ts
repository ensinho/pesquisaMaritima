import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { Coleta } from './useColetas';
import { Profile } from './useProfile';

export type Favorito = Tables<'favoritos'> & {
  profiles?: Profile;
  coletas?: Coleta;
};

export const useFavoritos = () => {
  return useQuery({
    queryKey: ['favoritos'],
    queryFn: async () => {
      // Query simples sem joins complexos
      const { data, error } = await supabase
        .from('favoritos')
        .select('*');
      
      if (error) throw error;
      return data as any;
    },
  });
};

export const useFavoritosByUser = (userId: string) => {
  return useQuery({
    queryKey: ['favoritos', 'user', userId],
    queryFn: async () => {
      // Query simples sem joins complexos
      const { data, error } = await supabase
        .from('favoritos')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!userId,
  });
};

export const useCheckFavorito = (userId: string, coletaId: string) => {
  return useQuery({
    queryKey: ['favoritos', 'check', userId, coletaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favoritos')
        .select('*')
        .eq('user_id', userId)
        .eq('coleta_id', coletaId)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!userId && !!coletaId,
  });
};

export const useToggleFavorito = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ coletaId, userId, isFavorite }: { coletaId: string; userId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('user_id', userId)
          .eq('coleta_id', coletaId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({ user_id: userId, coleta_id: coletaId });
        
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favoritos'] });
      queryClient.invalidateQueries({ queryKey: ['favoritos', 'user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['favoritos', 'check', variables.userId, variables.coletaId] });
      toast.success(variables.isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar favoritos');
      console.error(error);
    },
  });
};

export const useCreateFavorito = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, coletaId }: { userId: string; coletaId: string }) => {
      const { data, error } = await supabase
        .from('favoritos')
        .insert({ user_id: userId, coleta_id: coletaId })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favoritos'] });
      queryClient.invalidateQueries({ queryKey: ['favoritos', 'user', variables.userId] });
      toast.success('Adicionado aos favoritos!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar favorito');
      console.error(error);
    },
  });
};

export const useDeleteFavorito = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, coletaId }: { userId: string; coletaId: string }) => {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', userId)
        .eq('coleta_id', coletaId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favoritos'] });
      queryClient.invalidateQueries({ queryKey: ['favoritos', 'user', variables.userId] });
      toast.success('Removido dos favoritos!');
    },
    onError: (error) => {
      toast.error('Erro ao remover favorito');
      console.error(error);
    },
  });
};
