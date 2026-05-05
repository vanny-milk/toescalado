import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export interface User {
  id: string;
  name: string | null;
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
        .select('id, name, full_name, email, avatar_url')
        .order('name');

      if (error) throw error;
      return (data as unknown as User[]) || [];
    },
  });
}
