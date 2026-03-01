import { Clock, Dumbbell, Flame, Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSport } from "../hooks/useSport";

// Mapping des couleurs pour Tailwind (évite le purging des classes dynamiques)
const COLOR_MAP: Record<string, { from: string; to: string; text: string }> = {
  purple: {
    from: "from-purple-500",
    to: "to-purple-600",
    text: "text-purple-100",
  },
  red: { from: "from-red-500", to: "to-red-600", text: "text-red-100" },
  blue: { from: "from-blue-500", to: "to-blue-600", text: "text-blue-100" },
  green: { from: "from-green-500", to: "to-green-600", text: "text-green-100" },
};

export function SportPage() {
  const {
    stats,
    distribution,
    caloriesByType,
    recentSessions,
    sportTypes,
    loading,
    error,
  } = useSport();

  // Gestion des états de chargement et erreur
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des données sport...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Gestion du Sport</h1>
        <p className="text-gray-600">
          Suivi des activités physiques et performances
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Dumbbell className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{stats.totalSessions}</p>
          <p className="text-sm text-gray-600">Sessions Totales</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">
            {stats.totalCalories.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Calories Brûlées</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">
            {stats.averageDuration} min
          </p>
          <p className="text-sm text-gray-600">Durée Moyenne</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{sportTypes.length}</p>
          <p className="text-sm text-gray-600">Types de Sport</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Nombre de Sessions par Sport</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="type"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="sessions"
                fill="#3b82f6"
                name="Sessions"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg Calories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">
            Calories Moyennes par Type de Sport
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={caloriesByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="type"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="avgCalories"
                fill="#f59e0b"
                name="Calories Moy."
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sport Types Cards */}
      <div>
        <h3 className="text-gray-900 mb-4">Types d'Activités Sportives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sportTypes.map((sportType) => {
            const colors = COLOR_MAP[sportType.color] || COLOR_MAP.blue;
            return (
              <div
                key={sportType.type}
                className={`bg-gradient-to-br ${colors.from} ${colors.to} rounded-xl p-6 text-white`}
              >
                <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">{sportType.icon}</span>
                </div>
                <h4 className="text-white mb-2">{sportType.name}</h4>
                <p className={`${colors.text} text-sm mb-3`}>
                  {sportType.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Intensité:</span>
                  <span className="bg-white/20 px-2 py-1 rounded">
                    {sportType.intensity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">
          Dernières Sessions d'Entraînement
        </h3>
        <div className="space-y-3">
          {recentSessions.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    session.type === "Yoga"
                      ? "bg-purple-100"
                      : session.type === "HIIT"
                        ? "bg-red-100"
                        : session.type === "Cardio"
                          ? "bg-blue-100"
                          : "bg-green-100"
                  }`}
                >
                  <span className="text-lg">
                    {session.type === "Yoga"
                      ? "🧘"
                      : session.type === "HIIT"
                        ? "🔥"
                        : session.type === "Cardio"
                          ? "🏃"
                          : "💪"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900">{session.type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="text-gray-900">{session.duration} min</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-gray-900">{session.caloriesBurned} kcal</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
