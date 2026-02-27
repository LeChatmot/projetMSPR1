import { Settings, User, Bell, Shield, Database, Mail } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Configuration du système et préférences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-gray-900">Profil Administrateur</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nom complet</label>
              <input 
                type="text" 
                defaultValue="Dr. Martin Dupont"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input 
                type="email" 
                defaultValue="martin.dupont@healthfit.fr"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Rôle</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Administrateur</option>
                <option>Médecin</option>
                <option>Nutritionniste</option>
              </select>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Enregistrer les modifications
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Alertes Santé</p>
                <p className="text-sm text-gray-600">Recevoir des alertes pour les patients à risque</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Nouveaux Patients</p>
                <p className="text-sm text-gray-600">Notification lors de l'ajout d'un patient</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Rapports Hebdomadaires</p>
                <p className="text-sm text-gray-600">Recevoir un résumé chaque semaine</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-gray-900">Sécurité</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Mot de passe actuel</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nouveau mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Confirmer le mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Modifier le mot de passe
            </button>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-50 p-2 rounded-lg">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-gray-900">Base de Données</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Dernière sauvegarde</span>
                <span className="text-sm text-gray-900">5 Fév 2026 - 09:45</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Taille de la base</span>
                <span className="text-sm text-gray-900">2.4 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nombre de tables</span>
                <span className="text-sm text-gray-900">12</span>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Créer une sauvegarde
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Exporter les données
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 rounded-lg p-3">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-blue-900 mb-2">Informations Système</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Version</p>
                <p className="text-blue-900">v1.0.0 (MSPR 2026)</p>
              </div>
              <div>
                <p className="text-blue-700">Environnement</p>
                <p className="text-blue-900">Production</p>
              </div>
              <div>
                <p className="text-blue-700">Dernière mise à jour</p>
                <p className="text-blue-900">1er Février 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-50 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-gray-900">Support & Aide</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Besoin d'aide ou vous rencontrez un problème ? Notre équipe de support est disponible pour vous assister.
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Contacter le support
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
