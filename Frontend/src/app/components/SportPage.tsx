import { Clock, Dumbbell, Flame, Plus, Trophy, X } from "lucide-react";
import { useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useSport } from "../hooks/useSport";
import { useUserProfile } from "../hooks/useUserProfile";
import { sportService } from "../services/sportService";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#f1f5f9",
};

const SESSION_TYPE_CONFIG: Record<string, { emoji: string; bg: string }> = {
  Yoga:     { emoji: "🧘", bg: "bg-purple-500/10" },
  HIIT:     { emoji: "🔥", bg: "bg-red-500/10" },
  Cardio:   { emoji: "🏃", bg: "bg-blue-500/10" },
  Strength: { emoji: "💪", bg: "bg-emerald-500/10" },
};

function getSessionConfig(type: string) {
  return SESSION_TYPE_CONFIG[type] ?? { emoji: "🏋️", bg: "bg-slate-700" };
}

const WORKOUT_TYPES = ["Cardio", "Strength", "Yoga", "HIIT", "Cycling", "Swimming"];

interface AddSessionForm {
  workout_type: string;
  duration_min: string;
  calories_burned: string;
  session_date: string;
}

const EMPTY_FORM: AddSessionForm = {
  workout_type: "Cardio",
  duration_min: "",
  calories_burned: "",
  session_date: new Date().toISOString().split("T")[0],
};

// ─── Vue personnelle (utilisateur classique) ───────────────────────────────

function PersonalSportPage() {
  const { user } = useAuth();
  const { recentSessions, sportStats, refresh } = useUserProfile(user);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<AddSessionForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.backendId) return;
    setSaving(true);
    try {
      await sportService.addUserSession({
        user_id: user.backendId,
        workout_type: form.workout_type,
        duration_min: parseInt(form.duration_min),
        calories_burned: parseInt(form.calories_burned),
        session_date: form.session_date,
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      refresh();
    } catch {
      // silently handled
    } finally {
      setSaving(false);
    }
  };

  const chartData = recentSessions.reduce(
    (acc, s) => {
      const existing = acc.find((r) => r.type === s.type);
      if (existing) {
        existing.sessions += 1;
        existing.totalCalories += s.caloriesBurned;
      } else {
        acc.push({ type: s.type, sessions: 1, totalCalories: s.caloriesBurned });
      }
      return acc;
    },
    [] as Array<{ type: string; sessions: number; totalCalories: number }>,
  );

  const personalCards = [
    { icon: Dumbbell, bg: "bg-blue-500/10", color: "text-blue-400", value: sportStats.totalSessionsThisMonth, label: "Séances ce mois" },
    { icon: Flame, bg: "bg-orange-500/10", color: "text-orange-400", value: sportStats.totalCaloriesThisMonth, label: "Calories brûlées" },
    { icon: Clock, bg: "bg-emerald-500/10", color: "text-emerald-400", value: sportStats.totalMinutesThisMonth, label: "Minutes totales" },
    { icon: Trophy, bg: "bg-purple-500/10", color: "text-purple-400", value: sportStats.favoriteType, label: "Sport favori" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Mes Activités Sportives</h1>
          <p className="text-slate-400 text-sm">Suivi de vos séances personnelles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter une séance
        </button>
      </div>

      {/* Modal ajout séance */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-semibold text-lg">Nouvelle séance</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
              <div>
                <label htmlFor="workout_type" className="block text-sm text-slate-400 mb-1">Type d'activité</label>
                <select
                  id="workout_type"
                  value={form.workout_type}
                  onChange={(e) => setForm({ ...form, workout_type: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-slate-100"
                >
                  {WORKOUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="duration_min" className="block text-sm text-slate-400 mb-1">Durée (min)</label>
                  <input
                    id="duration_min"
                    type="number"
                    min="1"
                    required
                    value={form.duration_min}
                    onChange={(e) => setForm({ ...form, duration_min: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-slate-100"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label htmlFor="calories_burned" className="block text-sm text-slate-400 mb-1">Calories brûlées</label>
                  <input
                    id="calories_burned"
                    type="number"
                    min="1"
                    required
                    value={form.calories_burned}
                    onChange={(e) => setForm({ ...form, calories_burned: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-slate-100"
                    placeholder="350"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="session_date" className="block text-sm text-slate-400 mb-1">Date</label>
                <input
                  id="session_date"
                  type="date"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  value={form.session_date}
                  onChange={(e) => setForm({ ...form, session_date: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium transition-colors"
              >
                {saving ? "Enregistrement..." : "Enregistrer la séance"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* KPIs personnels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {personalCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6 hover:border-slate-600 hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`${card.bg} w-11 h-11 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-100 mb-1">{card.value}</p>
              <p className="text-sm text-slate-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique répartition */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-slate-100 font-semibold mb-4">Mes sports ce mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="type" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
              <Bar dataKey="sessions" fill="#6366f1" name="Séances" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mes dernières séances */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-slate-100 font-semibold mb-4">Mes dernières séances</h3>
          {recentSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Dumbbell className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">Aucune séance enregistrée</p>
              <p className="text-slate-500 text-sm mt-1">Vos activités apparaîtront ici après votre première séance.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((session) => {
                const { emoji, bg } = getSessionConfig(session.type);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
                        <span className="text-base">{emoji}</span>
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium text-sm">{session.type}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(session.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Durée</p>
                        <p className="text-sm font-medium text-slate-200">{session.durationMin} min</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Calories</p>
                        <p className="text-sm font-medium text-emerald-400">{session.caloriesBurned} kcal</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Vue globale (admin) ───────────────────────────────────────────────────

function AdminSportPage() {
  const { sessions, stats, distribution, loading, error } = useSport();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
        Erreur : {error}
      </div>
    );
  }

  const caloriesByType = sessions.reduce(
    (acc, session) => {
      if (!acc[session.type]) acc[session.type] = { total: 0, count: 0 };
      acc[session.type].total += session.caloriesBurned;
      acc[session.type].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  const avgCaloriesData = Object.entries(caloriesByType).map(([type, data]) => ({
    type,
    avgCalories: Math.round(data.total / data.count),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Sport & Activité — Global</h1>
        <p className="text-slate-400 text-sm">Vue d'ensemble de toutes les séances — accès administrateur</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {[
          { icon: Dumbbell, bg: "bg-blue-500/10", color: "text-blue-400", value: stats.totalSessions, label: "Sessions Totales" },
          { icon: Flame, bg: "bg-orange-500/10", color: "text-orange-400", value: stats.totalCalories.toLocaleString(), label: "Calories Brûlées" },
          { icon: Clock, bg: "bg-emerald-500/10", color: "text-emerald-400", value: stats.totalDuration, label: "Minutes Totales" },
          { icon: Trophy, bg: "bg-purple-500/10", color: "text-purple-400", value: stats.averageDuration, label: "Durée Moy. (min)" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6 hover:border-slate-600 hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`${card.bg} w-11 h-11 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-100 mb-1">{card.value}</p>
              <p className="text-sm text-slate-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-slate-100 font-semibold mb-4">Répartition par Type de Sport</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="type" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
              <Bar dataKey="sessions" fill="#6366f1" name="Sessions" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-slate-100 font-semibold mb-4">Calories Moyennes par Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgCaloriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="type" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
              <Bar dataKey="avgCalories" fill="#10b981" name="Calories Moy." radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-slate-100 font-semibold mb-4">Dernières Sessions d'Entraînement</h3>
        <div className="space-y-2">
          {sessions.slice(0, 8).map((session, index) => {
            const { emoji, bg } = getSessionConfig(session.type);
            return (
              <div
                key={session.id ?? `${session.type}-${index}`}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
                    <span className="text-base">{emoji}</span>
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium text-sm">{session.type}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(session.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Durée</p>
                    <p className="text-sm font-medium text-slate-200">{session.duration} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Calories</p>
                    <p className="text-sm font-medium text-emerald-400">{session.caloriesBurned} kcal</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Point d'entrée ────────────────────────────────────────────────────────

export function SportPage() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminSportPage /> : <PersonalSportPage />;
}
