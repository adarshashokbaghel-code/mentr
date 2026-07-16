"use client";

import {
  authApi,
  clearToken,
  saveToken,
  type AuthUser,
  type FacultyProfile,
} from "@/lib/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  /** "Who are you?" gate for unauthenticated users hitting a protected action */
  roleChooserOpen: boolean;
  /** `next` is the path to return to after login */
  openRoleChooser: (next?: string) => void;
  closeRoleChooser: () => void;
  roleChooserNext: string | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [roleChooserOpen, setRoleChooserOpen] = useState(false);
  const [roleChooserNext, setRoleChooserNext] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      const { user: sessionUser } = await authApi.me();
      setUser(sessionUser);
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const openRoleChooser = useCallback((next?: string) => {
    setRoleChooserNext(next ?? null);
    setRoleChooserOpen(true);
  }, []);
  const closeRoleChooser = useCallback(() => setRoleChooserOpen(false), []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearToken();
      setUser(null);
    }
  }, []);

  const handleSetUser = useCallback((next: AuthUser | null) => {
    setUser(next);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginOpen,
      openLogin,
      closeLogin,
      roleChooserOpen,
      openRoleChooser,
      closeRoleChooser,
      roleChooserNext,
      setUser: handleSetUser,
      logout,
      refreshSession,
    }),
    [
      user,
      loading,
      loginOpen,
      openLogin,
      closeLogin,
      roleChooserOpen,
      openRoleChooser,
      closeRoleChooser,
      roleChooserNext,
      handleSetUser,
      logout,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export type { AuthUser, FacultyProfile };
