import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export interface User {
  id: string;
  full_name: string | null;
  email?: string | null;
  avatar_url: string | null;
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .order('full_name');

      if (error) throw error;

      // Buscar emails do auth.users
      const userIds = data?.map((u) => u.id) || [];
      const usersWithEmails = await Promise.all(
        data?.map(async (profile) => {
          // Para obter email, precisamos usar o Supabase Admin API ou user metadata
          // Por enquanto, retornamos sem email
          return {
            ...profile,
            email: null,
          };
        }) || []
      );

      return usersWithEmails;
    },
  });
}
