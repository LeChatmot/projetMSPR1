import { Bell, Lock, Palette, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-emerald-500" : "bg-slate-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [reports, setReports] = useState(false);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Paramètres</h1>
        <p className="text-slate-400 text-sm">Gérez vos préférences et paramètres du compte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profil */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-slate-100 font-semibold">Profil</h3>
              <p className="text-xs text-slate-400">Informations du compte</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Nom</label>
              <input
                type="text"
                defaultValue={user?.name ?? "Utilisateur"}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                defaultValue={user?.email ?? ""}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
              Sauvegarder les modifications
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-slate-100 font-semibold">Notifications</h3>
              <p className="text-xs text-slate-400">Préférences de notification</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Notifications email", checked: notifications, onChange: () => setNotifications((v) => !v) },
              { label: "Alertes patients", checked: alerts, onChange: () => setAlerts((v) => !v) },
              { label: "Rapports automatiques", checked: reports, onChange: () => setReports((v) => !v) },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">{item.label}</span>
                <Toggle checked={item.checked} onChange={item.onChange} />
              </label>
            ))}
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-slate-100 font-semibold">Sécurité</h3>
              <p className="text-xs text-slate-400">Paramètres de sécurité</p>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
              Changer le mot de passe
            </button>
            <button className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 text-sm font-medium rounded-xl transition-all">
              Authentification à deux facteurs
            </button>
          </div>
        </div>

        {/* Apparence */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-slate-100 font-semibold">Apparence</h3>
              <p className="text-xs text-slate-400">Personnalisation de l'interface</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Mode sombre</p>
                <p className="text-xs text-slate-500">Activé en permanence</p>
              </div>
              <Toggle checked={true} onChange={() => undefined} />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">Animations</span>
              <Toggle checked={animations} onChange={() => setAnimations((v) => !v)} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
