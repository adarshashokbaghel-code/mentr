"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi, clearToken, type AuthUser } from "@/lib/api";
import { syncShortlistAfterAuth } from "@/lib/shortlist";

/** Premium mentor target for guest "send without login" */
export type GuestPremiumConnect = {
  teacherId: string;
  teacherName: string;
  subjectLine?: string;
};

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  /** "Who are you?" gate for unauthenticated users hitting a protected action */
  roleChooserOpen: boolean;
  /** `next` is the path to return to after login. Pass guestPremium for Premium connect. */
  openRoleChooser: (next?: string, guestPremium?: GuestPremiumConnect | null) => void;
  closeRoleChooser: () => void;
  roleChooserNext: string | null;
  /** Set when guest taps Connect on a Premium mentor */
  roleChooserGuestPremium: GuestPremiumConnect | null;
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
  const [roleChooserGuestPremium, setRoleChooserGuestPremium] =
    useState<GuestPremiumConnect | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      const { user: sessionUser } = await authApi.me();
      setUser(sessionUser);
      if (sessionUser.role === "parent" && sessionUser.profileCompleted) {
        await syncShortlistAfterAuth(sessionUser, setUser);
      }
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

  const openRoleChooser = useCallback(
    (next?: string, guestPremium?: GuestPremiumConnect | null) => {
      setRoleChooserNext(next ?? null);
      setRoleChooserGuestPremium(guestPremium ?? null);
      setRoleChooserOpen(true);
    },
    [],
  );
  const closeRoleChooser = useCallback(() => {
    setRoleChooserOpen(false);
    setRoleChooserGuestPremium(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear local session even if the API is unreachable (CORS, offline, etc.)
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
      roleChooserGuestPremium,
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
      roleChooserGuestPremium,
      handleSetUser,
      logout,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
