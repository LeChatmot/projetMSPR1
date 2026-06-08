import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AdminNutritionPage } from "./components/AdminNutritionPage";
import { CoachIAPage } from "./components/CoachIAPage";
import { CommunityPage } from "./components/CommunityPage";
import { Dashboard } from "./components/Dashboard";
import { DataManagement } from "./components/DataManagement";
import { Header } from "./components/Header";
import { LoginPage } from "./components/LoginPage";
import { ProfilePage } from "./components/ProfilePage";
import { RegisterPage } from "./components/RegisterPage";
import { NutritionPage } from "./components/NutritionPage";
import { PatientsPage } from "./components/PatientsPage";
import { SettingsPage } from "./components/SettingsPage";
import { Sidebar } from "./components/Sidebar";
import { SportPage } from "./components/SportPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user?.role === "admin" ? <>{children}</> : <Navigate to="/" replace />;
}

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Header onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="pt-16">
          <div className="p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/nutrition" element={<NutritionPage />} />
              <Route path="/sport" element={<SportPage />} />
              <Route path="/coach-ia" element={<CoachIAPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin-nutrition" element={<AdminRoute><AdminNutritionPage /></AdminRoute>} />
              <Route path="/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
              <Route path="/data" element={<AdminRoute><DataManagement /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
