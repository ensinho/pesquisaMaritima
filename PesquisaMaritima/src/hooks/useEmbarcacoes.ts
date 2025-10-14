import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Embarcacao = Tables<'embarcacoes'> & {
  laboratorios?: {
    nome: string;
  };
};

export const useEmbarcacoes = () => {
  return useQuery({
    queryKey: ['embarcacoes'],
    queryFn: async () => {
      // Query simples sem joins
      const { data, error } = await supabase
        .from('embarcacoes')
        .select('*');
      
      if (error) throw error;
      return data as any;
    },
  });
};

export const useEmbarcacaoById = (id: string) => {
  return useQuery({
    queryKey: ['embarcacoes', id],
    queryFn: async () => {
      // Query simples sem joins
      const { data, error } = await supabase
        .from('embarcacoes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!id,
  });
};

export const useCreateEmbarcacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (embarcacao: TablesInsert<'embarcacoes'>) => {
      const { data, error } = await supabase
        .from('embarcacoes')
        .insert(embarcacao)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['embarcacoes'] });
      toast.success('Embarcação criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar embarcação');
      console.error(error);
    },
  });
};

export const useUpdateEmbarcacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TablesUpdate<'embarcacoes'> }) => {
      const { data: updatedData, error } = await supabase
        .from('embarcacoes')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['embarcacoes'] });
      toast.success('Embarcação atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar embarcação');
      console.error(error);
    },
  });
};

export const useDeleteEmbarcacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('embarcacoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['embarcacoes'] });
      toast.success('Embarcação deletada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao deletar embarcação');
      console.error(error);
    },
  });
};
