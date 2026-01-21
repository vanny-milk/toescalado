import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/auth";

export type Page = "index" | "login" | "signup" | "forgotpass";

interface RouterContextType {
  currentPage: Page;
  navigate: (page: Page) => void;
  isLoading: boolean;
  currentUser: any | null;
}

const RouterContext = React.createContext<RouterContextType | undefined>(
  undefined
);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("index");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        if (!user) {
          setCurrentPage("login");
        }
      } catch (error) {
        console.error("Failed to check user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <RouterContext.Provider value={{ currentPage, navigate, isLoading, currentUser }}>
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
