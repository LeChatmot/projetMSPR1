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

export function SportPage() {
  const { sessions, stats, distribution, loading, error } = useSport();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Erreur: {error}
      </div>
    );
  }

  // Calculer les calories moyennes par type pour le graphique
  const caloriesByType = sessions.reduce(
    (acc, session) => {
      if (!acc[session.type]) {
        acc[session.type] = { total: 0, count: 0 };
      }
      acc[session.type].total += session.caloriesBurned;
      acc[session.type].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  const avgCaloriesData = Object.entries(caloriesByType).map(
    ([type, data]) => ({
      type,
      avgCalories: Math.round(data.total / data.count),
    }),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestion du Sport
        </h1>
        <p className="text-gray-600">
          Suivi des activités physiques et performances
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Dumbbell className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {stats.totalSessions}
          </p>
          <p className="text-sm text-gray-600">Sessions Totales</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {stats.totalCalories.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Calories Brûlées</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {stats.totalDuration}
          </p>
          <p className="text-sm text-gray-600">Minutes Totales</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {stats.averageDuration}
          </p>
          <p className="text-sm text-gray-600">Durée Moy. (min)</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 font-semibold mb-4">
            Répartition par Type de Sport
          </h3>
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

        {/* Calories by Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 font-semibold mb-4">
            Calories Moyennes par Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgCaloriesData}>
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
                fill="#10b981"
                name="Calories Moy."
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 font-semibold mb-4">
          Dernières Sessions d'Entraînement
        </h3>
        <div className="space-y-3">
          {sessions.slice(0, 8).map((session, index) => (
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
                  <p className="text-gray-900 font-medium">{session.type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="text-gray-900 font-medium">
                    {session.duration} min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-gray-900 font-medium">
                    {session.caloriesBurned} kcal
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
