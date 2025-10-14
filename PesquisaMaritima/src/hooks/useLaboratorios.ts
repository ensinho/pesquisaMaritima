import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Laboratorio {
  id: string;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

export const useLaboratorios = () => {
  return useQuery({
    queryKey: ['laboratorios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laboratorios')
        .select('*');
      
      if (error) throw error;
      return data as Laboratorio[];
    },
  });
};

export const useLaboratorioById = (id: string) => {
  return useQuery({
    queryKey: ['laboratorios', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laboratorios')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Laboratorio;
    },
    enabled: !!id,
  });
};

export const useCreateLaboratorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (laboratorio: { nome: string }) => {
      const { data, error } = await supabase
        .from('laboratorios')
        .insert(laboratorio)
        .select()
        .single();
      
      if (error) throw error;
      return data as Laboratorio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratorios'] });
      toast.success('Laboratório criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar laboratório');
      console.error(error);
    },
  });
};

export const useUpdateLaboratorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { nome: string } }) => {
      const { data: updatedData, error } = await supabase
        .from('laboratorios')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData as Laboratorio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratorios'] });
      toast.success('Laboratório atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar laboratório');
      console.error(error);
    },
  });
};

export const useDeleteLaboratorio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('laboratorios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratorios'] });
      toast.success('Laboratório deletado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao deletar laboratório');
      console.error(error);
    },
  });
};
