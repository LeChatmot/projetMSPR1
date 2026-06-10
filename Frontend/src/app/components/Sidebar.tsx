import {
  Bot,
  Dumbbell,
  Home,
  Info,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/patients", label: "Patients", icon: Users },
  { path: "/nutrition", label: "Nutrition", icon: Utensils },
  { path: "/sport", label: "Sport", icon: Dumbbell },
  { path: "/coach-ia", label: "Coach IA", icon: Bot },
  { path: "/community", label: "Communauté", icon: MessageSquare },
  { path: "/data", label: "À propos", icon: Info },
];

const ADMIN_ITEMS = [
  { path: "/admin-nutrition", label: "Admin Nutrition", icon: Shield },
  { path: "/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: Readonly<SidebarProps>) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const initials = user?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <>
      {/* Backdrop mobile */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden w-full cursor-default"
          aria-label="Fermer le menu"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-800 border-r border-slate-700 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">Santé & Fit</h1>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                }`}
              >
                <Icon className="shrink-0" size={18} />
                <span className="font-medium text-sm">{item.label}</span>
                {item.path === "/coach-ia" && (
                  <span className="ml-auto text-[10px] bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5 rounded-full font-medium">
                    IA
                  </span>
                )}
              </button>
            );
          })}

          {user?.role === "admin" && (
            <>
              <div className="pt-4 pb-1">
                <p className="px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                  Administration
                </p>
              </div>
              {ADMIN_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer utilisateur */}
        <div className="p-4 border-t border-slate-700 shrink-0">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: user?.avatarColor ?? "#10b981" }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => handleNavigate("/profile")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              isActive("/profile")
                ? "bg-emerald-500 text-white"
                : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
            }`}
          >
            <User size={16} />
            <span className="font-medium text-sm">Mon profil</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={16} />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}
