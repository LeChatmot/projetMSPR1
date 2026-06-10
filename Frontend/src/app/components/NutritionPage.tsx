import { Apple, ChefHat, Pizza, Salad } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useNutrition } from "../hooks/useNutrition";

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#f1f5f9",
};

const STAT_CARDS = [
  { icon: Apple, bg: "bg-emerald-500/10", color: "text-emerald-400", key: "totalDietTypes" as const, label: "Types de Régimes" },
  { icon: Salad, bg: "bg-blue-500/10", color: "text-blue-400", key: "activePlans" as const, label: "Plans Actifs" },
  { icon: Pizza, bg: "bg-purple-500/10", color: "text-purple-400", key: "averageCaloriesPerDay" as const, label: "Calories Moy/Jour" },
  { icon: ChefHat, bg: "bg-orange-500/10", color: "text-orange-400", key: "availableRecipes" as const, label: "Recettes Disponibles" },
];

export function NutritionPage() {
  const { dietDistribution, stats, dietPlans, loading, error } = useNutrition();

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Gestion de la Nutrition</h1>
        <p className="text-slate-400 text-sm">Recommandations alimentaires et régimes des patients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6 hover:border-slate-600 hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`${card.bg} w-11 h-11 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-100 mb-1">{stats[card.key]}</p>
              <p className="text-sm text-slate-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-slate-100 font-semibold mb-4">Distribution des Régimes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dietDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {dietDistribution.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Plans alimentaires */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col">
          <h3 className="text-slate-100 font-semibold mb-4">Plans Alimentaires Disponibles</h3>
          <div className="space-y-3 flex-1">
            {dietPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${plan.color ?? "bg-emerald-500/10"}`}>
                  <span className="text-lg">{plan.icon ?? "🥗"}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200">{plan.name}</p>
                  <p className="text-xs text-slate-500 truncate">{plan.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Examples */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-slate-100 font-semibold mb-4">Exemples de Plans Alimentaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dietPlans.map((plan) => (
            <div
              key={plan.id}
              className="border border-slate-700 rounded-xl p-4 hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${plan.color ?? "bg-emerald-500/10"}`}>
                <span className="text-2xl">{plan.icon ?? "🥗"}</span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">{plan.name}</h4>
              <p className="text-xs text-slate-500 mb-3">{plan.description}</p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li className="flex gap-2">
                  <span className="text-slate-600">☀️</span>
                  <span>{plan.meals?.breakfast ?? "Non défini"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-600">🌤️</span>
                  <span>{plan.meals?.lunch ?? "Non défini"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-600">🌙</span>
                  <span>{plan.meals?.dinner ?? "Non défini"}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
