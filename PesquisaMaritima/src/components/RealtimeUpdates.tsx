import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const RealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Criar canal para atualizações em tempo real
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coletas'
        },
        (payload) => {
          console.log('Nova coleta adicionada:', payload);
          queryClient.invalidateQueries({ queryKey: ['coletas'] });
          queryClient.invalidateQueries({ queryKey: ['coletas-with-details'] });
          toast.success('Nova coleta adicionada ao catálogo!');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'favoritos'
        },
        (payload) => {
          console.log('Novo favorito adicionado:', payload);
          queryClient.invalidateQueries({ queryKey: ['favoritos'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'favoritos'
        },
        (payload) => {
          console.log('Favorito removido:', payload);
          queryClient.invalidateQueries({ queryKey: ['favoritos'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'laboratorios'
        },
        (payload) => {
          console.log('Laboratório atualizado:', payload);
          queryClient.invalidateQueries({ queryKey: ['laboratorios'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'embarcacoes'
        },
        (payload) => {
          console.log('Embarcação atualizada:', payload);
          queryClient.invalidateQueries({ queryKey: ['embarcacoes'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return null;
};

export default RealtimeUpdates;
