import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";
import type {
  SignUpPayload,
  SignInPayload,
  ResetPasswordPayload,
  AuthResponse,
} from "../types/auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials not configured");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const authService = {
  async signUp(payload: SignUpPayload): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            full_name: payload.fullName,
          },
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Check your email to confirm the account",
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email || "",
              user_metadata: data.user.user_metadata,
            }
          : undefined,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message,
        error: message,
      };
    }
  },

  async signIn(payload: SignInPayload): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Logged in successfully",
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email || "",
              user_metadata: data.user.user_metadata,
            }
          : undefined,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message,
        error: message,
      };
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        payload.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        return {
          success: false,
          message: error.message,
          error: error.message,
        };
      }

      return {
        success: true,
        message:
          "Check your email for password reset instructions if account exists",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message,
        error: message,
      };
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          message: error.message,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message,
        error: message,
      };
    }
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  async updateProfile(payload: { fullName?: string }) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: payload.fullName,
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Profile updated",
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email || "",
              user_metadata: data.user.user_metadata,
            }
          : undefined,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message,
        error: message,
      };
    }
  },
};
