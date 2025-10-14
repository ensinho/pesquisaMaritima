import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Coleta = Tables<'coletas'> & {
  profiles?: {
    nome: string;
    email: string;
  };
  embarcacoes?: {
    tipo: string;
    laboratorios?: {
      nome: string;
    };
  };
};

export const useColetas = () => {
  return useQuery({
    queryKey: ['coletas'],
    queryFn: async () => {
      // Query simples primeiro, sem joins complexos
      const { data, error } = await supabase
        .from('coletas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any;
    },
  });
};

export const useColetasByUser = (userId: string) => {
  return useQuery({
    queryKey: ['coletas', 'user', userId],
    queryFn: async () => {
      // Query simples sem joins complexos
      const { data, error } = await supabase
        .from('coletas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!userId,
  });
};

export const useCreateColeta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (coleta: TablesInsert<'coletas'>) => {
      const { data, error } = await supabase
        .from('coletas')
        .insert(coleta)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletas'] });
      toast.success('Coleta criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar coleta');
      console.error(error);
    },
  });
};

export const useUpdateColeta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TablesUpdate<'coletas'> }) => {
      const { data: updatedData, error } = await supabase
        .from('coletas')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletas'] });
      toast.success('Coleta atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar coleta');
      console.error(error);
    },
  });
};

export const useDeleteColeta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coletas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletas'] });
      toast.success('Coleta deletada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao deletar coleta');
      console.error(error);
    },
  });
};
