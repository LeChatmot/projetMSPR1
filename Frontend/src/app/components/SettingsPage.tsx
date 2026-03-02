import { Bell, Lock, Palette, User } from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [reports, setReports] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">
          Gérez vos préférences et paramètres du compte
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">Profil</h3>
              <p className="text-sm text-gray-600">Informations du compte</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                defaultValue="Administrateur"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white hover:bg-gray-100 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@sante-fit.fr"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white hover:bg-gray-100 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-50 w-10 h-10 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">Notifications</h3>
              <p className="text-sm text-gray-600">
                Préférences de notification
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Notifications email</span>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Alertes patients</span>
              <button
                type="button"
                onClick={() => setAlerts(!alerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  alerts ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    alerts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Rapports automatiques</span>
              <button
                type="button"
                onClick={() => setReports(!reports)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reports ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reports ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">Sécurité</h3>
              <p className="text-sm text-gray-600">Paramètres de sécurité</p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Changer le mot de passe
            </button>
            <button className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Authentification à deux facteurs
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">Apparence</h3>
              <p className="text-sm text-gray-600">
                Personnalisation de l'interface
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Mode sombre</span>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Animations</span>
              <button
                type="button"
                onClick={() => setAnimations(!animations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  animations ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    animations ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
