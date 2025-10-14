import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'> & {
  laboratorios?: {
    nome: string;
  };
};

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      // Query simples sem joins
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!userId,
  });
};

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // Query simples sem joins
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data as any;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: TablesUpdate<'profiles'> }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar perfil');
      console.error(error);
    },
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: TablesInsert<'profiles'>) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Perfil criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar perfil');
      console.error(error);
    },
  });
};
