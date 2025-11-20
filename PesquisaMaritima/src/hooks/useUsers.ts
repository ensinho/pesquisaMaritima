import { useState, useEffect } from 'react';
import { usersAPI, IUser } from '../services/api';
import { toast } from 'sonner';

export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    data: users,
    isLoading: loading,
    error,
    refetch: fetchUsers,
  };
};

export const useUpdateUserProfile = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (
      { userId, updates }: { userId: string; updates: Partial<IUser> },
      options?: { onSuccess?: () => void }
    ) => {
      setIsPending(true);
      try {
        await usersAPI.updateProfile(userId, updates);
        toast.success('Perfil atualizado com sucesso!');
        if (options?.onSuccess) options.onSuccess();
      } catch (error) {
        toast.error('Erro ao atualizar perfil');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useUpdateUserRole = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (
      { userId, role }: { userId: string; role: 'admin' | 'researcher' },
      options?: { onSuccess?: () => void }
    ) => {
      setIsPending(true);
      try {
        await usersAPI.updateRole(userId, role);
        toast.success('Permissão atualizada com sucesso!');
        if (options?.onSuccess) options.onSuccess();
      } catch (error) {
        toast.error('Erro ao atualizar permissão');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};

export const useUpdateUserStatus = () => {
  const [isPending, setIsPending] = useState(false);

  return {
    mutate: async (
      { userId, status }: { userId: string; status: boolean },
      options?: { onSuccess?: () => void }
    ) => {
      setIsPending(true);
      try {
        await usersAPI.updateStatus(userId, status);
        toast.success(`Usuário ${status ? 'ativado' : 'desativado'} com sucesso!`);
        if (options?.onSuccess) options.onSuccess();
      } catch (error) {
        toast.error('Erro ao atualizar status do usuário');
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
};
