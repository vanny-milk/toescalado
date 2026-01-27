import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService, supabase } from "../services/auth";
import type { Database } from "../types/supabase";

export type Page =
  | "index"
  | "login"
  | "signup"
  | "forgotpass"
  | "editprofile"
  | "onboarding"
  | "agenda"
  | "graphics";

interface RouterContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
  isLoading: boolean;
  currentUser: any | null;
  refreshCurrentUser: () => Promise<void>;
}

const RouterContext = React.createContext<RouterContextType | undefined>(
  undefined
);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          setCurrentUser(null);
          setCurrentPage("login");
          return;
        }

        // try to fetch profile from `profiles` table
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
        }


        // If profile missing or missing required fields, send to onboarding
        const profileRow = profile as Database["public"]["Tables"]["profiles"]["Row"] | null;
        const needsOnboarding = !profileRow || !profileRow.city || !profileRow.role;

        setCurrentUser({ auth: user, profile: profileRow ?? null });

        if (needsOnboarding) {
          setCurrentPage("onboarding");
        } else {
          setCurrentPage("index");
        }
      } catch (error) {
        console.error("Failed to check user:", error);
        setCurrentPage("login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const refreshCurrentUser = async () => {
    setIsLoading(true);
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <RouterContext.Provider value={{ currentPage, navigate, isLoading, currentUser, refreshCurrentUser }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }
  return context;
}
