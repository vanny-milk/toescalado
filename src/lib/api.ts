import { supabase } from './supabase';

export async function updateProfile(userId: string, updates: { name?: string; city?: string }) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            // @ts-ignore: Types might be out of sync
            .update({
                full_name: updates.name,
                city: updates.city,
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}
