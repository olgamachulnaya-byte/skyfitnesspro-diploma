"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser as loginUserRequest,
  registerUser as registerUserRequest,
} from "@/lib/api/auth";
import { getCurrentUser } from "@/lib/api/users";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import type { User } from "@/types/user";

const TOKEN_STORAGE_KEY = "skyfitnesspro-token";

export type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const saveSession = useCallback(async (newToken: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);

    try {
      const currentUser = await getCurrentUser(newToken);
      setUser(currentUser);
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);

      throw error;
    }
  }, []);

  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(savedToken);

        setToken(savedToken);
        setUser(currentUser);
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const response = await loginUserRequest(credentials);

      await saveSession(response.token);
    },
    [saveSession],
  );

  const register = useCallback(
    async (credentials: RegisterRequest) => {
      await registerUserRequest(credentials);

      const response = await loginUserRequest(credentials);

      await saveSession(response.token);
    },
    [saveSession],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const refreshUser = useCallback(async () => {
    if (!token) {
      return;
    }

    const currentUser = await getCurrentUser(token);
    setUser(currentUser);
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [token, user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}