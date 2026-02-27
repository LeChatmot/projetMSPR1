import { Dumbbell, Flame, Clock, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockSportSessions, getSportDistribution } from '../data/mockData';

export function SportPage() {
  const totalSessions = mockSportSessions.length;
  const totalCalories = mockSportSessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const totalDuration = mockSportSessions.reduce((sum, s) => sum + s.duration, 0);
  const avgDuration = Math.round(totalDuration / totalSessions);

  const sportDistribution = getSportDistribution();

  // Calculer les calories moyennes par type de sport
  const caloriesByType = mockSportSessions.reduce((acc, session) => {
    if (!acc[session.type]) {
      acc[session.type] = { total: 0, count: 0 };
    }
    acc[session.type].total += session.caloriesBurned;
    acc[session.type].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const avgCaloriesData = Object.entries(caloriesByType).map(([type, data]) => ({
    type,
    avgCalories: Math.round(data.total / data.count)
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Gestion du Sport</h1>
        <p className="text-gray-600">Suivi des activités physiques et performances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Dumbbell className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{totalSessions}</p>
          <p className="text-sm text-gray-600">Sessions Totales</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{totalCalories.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Calories Brûlées</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{avgDuration} min</p>
          <p className="text-sm text-gray-600">Durée Moyenne</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">4</p>
          <p className="text-sm text-gray-600">Types de Sport</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Nombre de Sessions par Sport</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sportDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="type" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
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
          <h3 className="text-gray-900 mb-4">Calories Moyennes par Type de Sport</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgCaloriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="type" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
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
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🧘</span>
            </div>
            <h4 className="text-white mb-2">Yoga</h4>
            <p className="text-purple-100 text-sm mb-3">Souplesse et relaxation</p>
            <div className="flex items-center justify-between text-sm">
              <span>Intensité:</span>
              <span className="bg-white/20 px-2 py-1 rounded">Faible</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🔥</span>
            </div>
            <h4 className="text-white mb-2">HIIT</h4>
            <p className="text-red-100 text-sm mb-3">Haute intensité</p>
            <div className="flex items-center justify-between text-sm">
              <span>Intensité:</span>
              <span className="bg-white/20 px-2 py-1 rounded">Très Haute</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🏃</span>
            </div>
            <h4 className="text-white mb-2">Cardio</h4>
            <p className="text-blue-100 text-sm mb-3">Endurance cardiovasculaire</p>
            <div className="flex items-center justify-between text-sm">
              <span>Intensité:</span>
              <span className="bg-white/20 px-2 py-1 rounded">Modérée</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">💪</span>
            </div>
            <h4 className="text-white mb-2">Strength</h4>
            <p className="text-green-100 text-sm mb-3">Renforcement musculaire</p>
            <div className="flex items-center justify-between text-sm">
              <span>Intensité:</span>
              <span className="bg-white/20 px-2 py-1 rounded">Haute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Dernières Sessions d'Entraînement</h3>
        <div className="space-y-3">
          {mockSportSessions.slice(0, 8).map((session, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  session.type === 'Yoga' ? 'bg-purple-100' :
                  session.type === 'HIIT' ? 'bg-red-100' :
                  session.type === 'Cardio' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  <span className="text-lg">
                    {session.type === 'Yoga' ? '🧘' :
                     session.type === 'HIIT' ? '🔥' :
                     session.type === 'Cardio' ? '🏃' : '💪'}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900">{session.type}</p>
                  <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString('fr-FR')}</p>
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
