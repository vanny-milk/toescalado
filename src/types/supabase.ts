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
          full_name?: string | null;
          email?: string | null;
          city?: string | null;
          role?: string | null;
          departments?: string[] | null;
          other_emails?: string[] | null;
          updated_at?: string | null;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          city?: string | null;
          role?: string | null;
          departments?: string[] | null;
          other_emails?: string[] | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          city?: string | null;
          role?: string | null;
          departments?: string[] | null;
          other_emails?: string[] | null;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}
