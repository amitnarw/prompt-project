"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  user: { id: string; email: string; name: string; image?: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const session = await authClient.getSession();
      if (session && session.data && "user" in session.data) {
        setUser(session.data.user as AuthContextType["user"]);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message);
    await refreshSession();
  };

  const register = async (email: string, password: string, name: string) => {
    const { error } = await authClient.signUp.email({ email, password, name });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}