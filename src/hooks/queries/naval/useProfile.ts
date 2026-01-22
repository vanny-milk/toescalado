import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { navalKeys } from '@/lib/query-keys';

export function useProfile(userId: string | undefined) {
    return useQuery({
        queryKey: navalKeys.profile(userId),
        queryFn: async (): Promise<any> => {
            if (!userId) return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });
}
