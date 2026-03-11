import {
  Database,
  Dumbbell,
  Home,
  Settings,
  Users,
  Utensils,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "patients", label: "Patients", icon: Users },
  { id: "nutrition", label: "Nutrition", icon: Utensils },
  { id: "sport", label: "Sport", icon: Dumbbell },
  { id: "admin-nutrition", label: "Admin Nutrition", icon: Utensils },
  { id: "settings", label: "Paramètres", icon: Settings },
  { id: "data", label: "Données ETL", icon: Database },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Santé & Fit</h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
