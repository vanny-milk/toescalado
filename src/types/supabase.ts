export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
          phone: string | null;
          city: string | null;
          last_active_at: string | null;
          email: string | null;
          monitoring_frequency: string | null;
          monitoring_day_of_week: string | null;
          monitoring_time: string | null;
          weekly_submissions_limit: number;
          study_goals: string | null;
          study_days: string | null;
          study_schedule: Json;
          monthly_group_studies_limit: number;
          monthly_tasks_limit: number;
          monthly_monitorings_limit: number;
          total_usage_minutes: number;
          alias: string | null;
          username: string | null;
          invite_code: string | null;
          invites_remaining: number;
          invited_by: string | null;
          instagram_url: string | null;
          youtube_url: string | null;
          spotify_url: string | null;
          website_url: string | null;
          lfs_view_settings: Json;
          vocal_range_low: string | null;
          vocal_range_high: string | null;
          vocal_category: string | null;
          habit_score: number;
          last_seen_at: string | null;
          is_online: boolean;
          lfs_preferences: Json;
          role: string | null;
          full_name: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
          phone?: string | null;
          city?: string | null;
          last_active_at?: string | null;
          email?: string | null;
          monitoring_frequency?: string | null;
          monitoring_day_of_week?: string | null;
          monitoring_time?: string | null;
          weekly_submissions_limit?: number;
          study_goals?: string | null;
          study_days?: string | null;
          study_schedule?: Json;
          monthly_group_studies_limit?: number;
          monthly_tasks_limit?: number;
          monthly_monitorings_limit?: number;
          total_usage_minutes?: number;
          alias?: string | null;
          username?: string | null;
          invite_code?: string | null;
          invites_remaining?: number;
          invited_by?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          spotify_url?: string | null;
          website_url?: string | null;
          lfs_view_settings?: Json;
          vocal_range_low?: string | null;
          vocal_range_high?: string | null;
          vocal_category?: string | null;
          habit_score?: number;
          last_seen_at?: string | null;
          is_online?: boolean;
          lfs_preferences?: Json;
          role?: string | null;
          full_name?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
          phone?: string | null;
          city?: string | null;
          last_active_at?: string | null;
          email?: string | null;
          monitoring_frequency?: string | null;
          monitoring_day_of_week?: string | null;
          monitoring_time?: string | null;
          weekly_submissions_limit?: number;
          study_goals?: string | null;
          study_days?: string | null;
          study_schedule?: Json;
          monthly_group_studies_limit?: number;
          monthly_tasks_limit?: number;
          monthly_monitorings_limit?: number;
          total_usage_minutes?: number;
          alias?: string | null;
          username?: string | null;
          invite_code?: string | null;
          invites_remaining?: number;
          invited_by?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          spotify_url?: string | null;
          website_url?: string | null;
          lfs_view_settings?: Json;
          vocal_range_low?: string | null;
          vocal_range_high?: string | null;
          vocal_category?: string | null;
          habit_score?: number;
          last_seen_at?: string | null;
          is_online?: boolean;
          lfs_preferences?: Json;
          role?: string | null;
          full_name?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: string | null;
          start_time: string;
          event_date: string;
          location: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type?: string | null;
          start_time: string;
          event_date: string;
          location?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: string | null;
          start_time?: string;
          event_date?: string;
          location?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
      };
      event_guests: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: string | null;
          role: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: string | null;
          role?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: string | null;
          role?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}

// Tipo para referência de usuário autenticado (auth.users)
// Baseado na estrutura do Supabase Auth
export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  confirmed_at: string | null;
  user_metadata: Record<string, Json>;
  app_metadata: Record<string, Json>;
}
