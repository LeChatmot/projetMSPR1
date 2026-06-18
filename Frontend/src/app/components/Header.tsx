import { Bell, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onMenuToggle: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/patients": "Patients",
  "/nutrition": "Nutrition",
  "/sport": "Sport & Activité",
  "/coach-ia": "Coach IA",
  "/community": "Communauté",
  "/profile": "Mon profil",
  "/admin-nutrition": "Admin — Nutrition",
  "/settings": "Paramètres",
  "/data": "À propos & Démo",
};

export function Header({ onMenuToggle }: Readonly<HeaderProps>) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Santé & Fit";

  const initials =
    user?.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 z-40">
      <div className="h-full flex items-center justify-between px-4 lg:px-8 gap-3">

        {/* Hamburger — mobile uniquement */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors shrink-0"
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>

        {/* Titre de la page */}
        <h2 className="text-lg font-semibold text-slate-100 flex-1 truncate">{pageTitle}</h2>

        {/* Droite : notifications + avatar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-700 hover:opacity-80 transition-opacity"
            aria-label="Paramètres"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: user?.avatarColor ?? "#10b981" }}
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-100 leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.role === "admin" ? "Administrateur" : "Utilisateur"}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
