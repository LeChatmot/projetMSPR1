import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DataManagement } from './components/DataManagement';
import { PatientsPage } from './components/PatientsPage';
import { NutritionPage } from './components/NutritionPage';
import { SportPage } from './components/SportPage';
import { SettingsPage } from './components/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientsPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'sport':
        return <SportPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="pt-16">
          <div className="p-8">
            {renderPage()}
          </div>
        </main>

        {/* Footer - Affichage du statut pour la gestion des données */}
        {currentPage === 'dashboard' && (
          <div className="fixed bottom-4 right-4">
            <button
              onClick={() => setCurrentPage('patients')}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <span className="text-sm">🔧</span>
              <span className="text-sm">Gérer les données ETL</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
