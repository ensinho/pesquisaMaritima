import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserStats {
  total_coletas: number;
  total_favoritos: number;
  especies_unicas: number;
  ultima_coleta: string | null;
}

// Este hook continua usando Supabase para funções RPC e estatísticas
export const useUserStatistics = (userId: string) => {
  return useQuery({
    queryKey: ['user-statistics', userId],
    queryFn: async () => {
      try {
        // Tentar usar a função RPC primeiro
        const { data, error } = await supabase
          .rpc('get_user_collection_stats', { p_user_id: userId });
        
        if (error) throw error;
        return data[0] as UserStats;
      } catch (rpcError) {
        console.log('RPC function not available, using fallback queries');
        
        // Fallback: buscar dados manualmente
        const [coletasResult, favoritosResult] = await Promise.all([
          supabase.from('coletas').select('*').eq('user_id', userId),
          supabase.from('favoritos').select('*').eq('user_id', userId)
        ]);

        const coletas = coletasResult.data || [];
        const favoritos = favoritosResult.data || [];
        
        const especiesUnicas = new Set(
          coletas
            .map(c => c.nome_cientifico)
            .filter(nome => nome && nome.trim() !== '')
        ).size;

        const ultimaColeta = coletas.length > 0 
          ? Math.max(...coletas.map(c => new Date(c.created_at || '').getTime()))
          : null;

        return {
          total_coletas: coletas.length,
          total_favoritos: favoritos.length,
          especies_unicas: especiesUnicas,
          ultima_coleta: ultimaColeta ? new Date(ultimaColeta).toISOString() : null
        } as UserStats;
      }
    },
    enabled: !!userId,
  });
};

export const useColetasWithDetails = () => {
  return useQuery({
    queryKey: ['coletas-with-details'],
    queryFn: async () => {
      try {
        // Tentar usar a função RPC primeiro
        const { data, error } = await supabase
          .rpc('get_coletas_with_details');
        
        if (error) throw error;
        return data;
      } catch (rpcError) {
        console.log('RPC function not available, using fallback query');
        
        // Fallback: buscar coletas simples
        const { data, error } = await supabase
          .from('coletas')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
      }
    },
  });
};
