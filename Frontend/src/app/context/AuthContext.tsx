import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { AuthUser } from "../types";
import { authService, type RegisterPayload } from "../services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateProfile: (nom: string, prenom: string, email: string) => Promise<void>;
  updatePassword: (ancienMdp: string, nouveauMdp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "santefit_user";

const AVATAR_COLORS = [
  "#10b981", "#6366f1", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16",
];

function pickAvatarColor(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function buildAuthUser(backendUser: Awaited<ReturnType<typeof authService.login>>): AuthUser {
  return {
    id: `u_${backendUser.id}`,
    backendId: backendUser.id,
    nom: backendUser.nom,
    prenom: backendUser.prenom,
    email: backendUser.email,
    name: `${backendUser.prenom} ${backendUser.nom}`.trim(),
    pseudo: backendUser.pseudo,
    role: backendUser.role === "admin" ? "admin" : "user",
    avatarColor: pickAvatarColor(backendUser.email),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored) as AuthUser;
      // Invalide les anciennes sessions mock (sans backendId)
      if (!parsed.backendId) return null;
      return parsed;
    } catch {
      return null;
    }
  });

  const persistAndSetUser = (authUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const backendUser = await authService.login(email, password);
    persistAndSetUser(buildAuthUser(backendUser));
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    const backendUser = await authService.register(payload);
    persistAndSetUser(buildAuthUser(backendUser));
  };

  const updateProfile = async (nom: string, prenom: string, email: string): Promise<void> => {
    if (!user) throw new Error("Non connecté");
    const backendUser = await authService.updateInfo(user.backendId, { nom, prenom, email });
    persistAndSetUser(buildAuthUser(backendUser));
  };

  const updatePassword = async (ancienMdp: string, nouveauMdp: string): Promise<void> => {
    if (!user) throw new Error("Non connecté");
    await authService.updatePassword(user.backendId, ancienMdp, nouveauMdp);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, updateProfile, updatePassword, logout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
