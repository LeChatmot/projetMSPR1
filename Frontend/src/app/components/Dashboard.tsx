import { Activity, AlertTriangle, Clock, Flame, Scale, TrendingUp, Users } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import { useUserProfile } from "../hooks/useUserProfile";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#f1f5f9",
};

// ─── Vue personnelle (utilisateur classique) ───────────────────────────────

function PersonalDashboard() {
  const { user } = useAuth();
  const { profile, recentSessions, sportStats } = useUserProfile(user);

  const bmiStatus =
    profile.bmi < 18.5 ? { label: "Insuffisance pondérale", color: "text-blue-400" }
    : profile.bmi < 25   ? { label: "Poids normal", color: "text-emerald-400" }
    : profile.bmi < 30   ? { label: "Surpoids", color: "text-orange-400" }
                         : { label: "Obésité", color: "text-red-400" };

  const personalCards = [
    { title: "Mon poids", value: `${profile.weightKg} kg`, icon: Scale, bg: "bg-blue-500/10", color: "text-blue-400" },
    { title: "IMC", value: profile.bmi, icon: Activity, bg: "bg-emerald-500/10", color: "text-emerald-400" },
    { title: "Séances ce mois", value: sportStats.totalSessionsThisMonth, icon: TrendingUp, bg: "bg-indigo-500/10", color: "text-indigo-400" },
    { title: "Calories brûlées", value: `${sportStats.totalCaloriesThisMonth} kcal`, icon: Flame, bg: "bg-orange-500/10", color: "text-orange-400" },
  ];

  const SESSION_EMOJI: Record<string, string> = {
    Cardio: "🏃", Strength: "💪", Yoga: "🧘", HIIT: "🔥",
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Bonjour, {user?.name} 👋</h1>
            <p className="text-emerald-100 text-sm">
              Voici votre tableau de bord santé personnel. Continuez comme ça !
            </p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-3xl shrink-0">💪</div>
        </div>
      </div>

      {/* KPIs personnels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {personalCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6 hover:border-slate-600 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-100">{card.value}</p>
                </div>
                <div className={`${card.bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profil santé + Activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profil */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
          <h3 className="text-slate-100 font-semibold">Mon profil santé</h3>
          {[
            { label: "Taille", value: `${profile.heightCm} cm` },
            { label: "Âge", value: `${profile.age} ans` },
            { label: "Niveau d'activité", value: profile.activityLevel },
            { label: "Plan nutritionnel", value: profile.dietPlan },
            { label: "Risque détecté", value: profile.riskDisease === "None" ? "Aucun" : profile.riskDisease },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
              <span className="text-sm text-slate-400">{row.label}</span>
              <span className="text-sm font-medium text-slate-200">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-slate-400">Statut IMC</span>
            <span className={`text-sm font-semibold ${bmiStatus.color}`}>{bmiStatus.label}</span>
          </div>
        </div>

        {/* Dernières séances */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-slate-100 font-semibold mb-4">Mes dernières séances</h3>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{SESSION_EMOJI[session.type] ?? "🏋️"}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{session.type}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(session.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-xs text-slate-500">Durée</p>
                    <p className="text-sm font-medium text-slate-200">{session.durationMin} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Calories</p>
                    <p className="text-sm font-medium text-emerald-400">{session.caloriesBurned} kcal</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Vue globale (admin) ───────────────────────────────────────────────────

function AdminDashboard() {
  const { kpis, sportDistribution, weightEvolution, loading } = useDashboard();

  const kpiCards = [
    { title: "Total Patients", value: kpis.totalPatients, icon: Users, bgColor: "bg-blue-500/10", iconColor: "text-blue-400" },
    { title: "Calories Brûlées (Moy.)", value: `${kpis.avgCaloriesBurned} kcal`, icon: Flame, bgColor: "bg-orange-500/10", iconColor: "text-orange-400" },
    { title: "Durée Moy. Séance", value: `${kpis.avgSessionDuration} min`, icon: Clock, bgColor: "bg-emerald-500/10", iconColor: "text-emerald-400" },
    { title: "Alertes Santé", value: kpis.healthAlerts, icon: AlertTriangle, bgColor: "bg-red-500/10", iconColor: "text-red-400" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Dashboard Santé & Fitness</h1>
        <p className="text-slate-400 text-sm">Vue d'ensemble globale — données de tous les patients</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6 hover:border-slate-600 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-slate-100 mb-1">{kpi.value}</p>
                </div>
                <div className={`${kpi.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-slate-100 font-semibold mb-4">Évolution du Poids Moyen</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
              <Line type="monotone" dataKey="averageWeight" stroke="#6366f1" strokeWidth={3} name="Poids Moyen (kg)" dot={{ fill: "#6366f1", r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-slate-100 font-semibold mb-4">Répartition des Types de Sport</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sportDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="type" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#475569" />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
              <Bar dataKey="sessions" fill="#10b981" name="Nombre de Sessions" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-2">Statistiques Globales</h3>
            <p className="text-emerald-100 text-sm">
              Le système agrège actuellement des données de{" "}
              <span className="font-semibold">{kpis.totalPatients}</span> patients avec une moyenne
              de{" "}
              <span className="font-semibold">
                {Math.round(weightEvolution[weightEvolution.length - 1]?.averageWeight || 0)} kg
              </span>
              . Les patients ont brûlé en moyenne{" "}
              <span className="font-semibold">{kpis.avgCaloriesBurned} kcal</span> par séance.
            </p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 ml-6 shrink-0">
            <p className="text-4xl">✓</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Point d'entrée : aiguillage selon le rôle ────────────────────────────

export function Dashboard() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminDashboard /> : <PersonalDashboard />;
}
