import { Users, Flame, Clock, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateKPIs, mockWeightEvolution, getSportDistribution } from '../data/mockData';

export function Dashboard() {
  const kpis = calculateKPIs();
  const sportDistribution = getSportDistribution();

  const kpiCards = [
    {
      title: 'Total Patients',
      value: kpis.totalPatients,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Calories Brûlées (Moy.)',
      value: `${kpis.avgCaloriesBurned} kcal`,
      icon: Flame,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Durée Moy. Séance',
      value: `${kpis.avgSessionDuration} min`,
      icon: Clock,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Alertes Santé',
      value: kpis.healthAlerts,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard de Santé & Fitness</h1>
        <p className="text-gray-600">Vue d'ensemble des données patients, sport et nutrition</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-3xl text-gray-900 mb-1">{kpi.value}</p>
                </div>
                <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Evolution Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Évolution du Poids Moyen (6 derniers mois)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockWeightEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
                domain={[68, 76]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="averageWeight" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Poids Moyen (kg)"
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sport Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Répartition des Types de Sport</h3>
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
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="sessions" 
                fill="#10b981" 
                name="Nombre de Sessions"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white mb-2">Statistiques Globales</h3>
            <p className="text-blue-100">
              Le système agrège actuellement des données de {kpis.totalPatients} patients avec une moyenne de {Math.round(mockWeightEvolution[mockWeightEvolution.length - 1].averageWeight)} kg. 
              Les patients ont brûlé en moyenne {kpis.avgCaloriesBurned} calories par séance de sport.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-5xl">✓</p>
          </div>
        </div>
      </div>
    </div>
  );
}
