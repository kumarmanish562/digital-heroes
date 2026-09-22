import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Role, User } from "../types";
import { authApi } from "../services/auth.api";
import { tokenStore, userStore } from "../lib/storage";

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => userStore.get<User>());
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const profile = await authApi.profile();
    setUser(profile);
    userStore.set(profile);
  };

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!tokenStore.get()) {
        if (active) setLoading(false);
        return;
      }
      try {
        const profile = await authApi.profile();
        if (active) {
          setUser(profile);
          userStore.set(profile);
        }
      } catch {
        tokenStore.clear();
        userStore.clear();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    role: user?.role ?? null,
    loading,
    isAuthenticated: Boolean(user && tokenStore.get()),
    async login(email, password) {
      const result = await authApi.login({ email, password });
      tokenStore.set(result.token);
      const profile = await authApi.profile();
      setUser(profile);
      userStore.set(profile);
    },
    async register(name, email, password) {
      const result = await authApi.register({ name, email, password });
      tokenStore.set(result.token);
      const profile = await authApi.profile();
      setUser(profile);
      userStore.set(profile);
    },
    async logout() {
      try {
        await authApi.logout();
      } finally {
        tokenStore.clear();
        userStore.clear();
        setUser(null);
      }
    },
    refreshUser
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
