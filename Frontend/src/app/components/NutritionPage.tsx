import { Apple, Salad, Pizza, ChefHat } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { mockPatients } from '../data/mockData';

export function NutritionPage() {
  // Calculer la distribution des régimes
  const dietDistribution = mockPatients.reduce((acc, patient) => {
    acc[patient.dietRecommendation] = (acc[patient.dietRecommendation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(dietDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Gestion de la Nutrition</h1>
        <p className="text-gray-600">Recommandations alimentaires et régimes des patients</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Apple className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{Object.keys(dietDistribution).length}</p>
          <p className="text-sm text-gray-600">Types de Régimes</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Salad className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{mockPatients.length}</p>
          <p className="text-sm text-gray-600">Plans Actifs</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Pizza className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">2,200</p>
          <p className="text-sm text-gray-600">Calories Moy/Jour</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <ChefHat className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">156</p>
          <p className="text-sm text-gray-600">Recettes Dispo</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Distribution des Régimes Alimentaires</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Regime Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Détails des Régimes</h3>
          <div className="space-y-3">
            {Object.entries(dietDistribution).map(([diet, count], index) => (
              <div key={diet} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-900">{diet}</span>
                </div>
                <span className="text-gray-600">{count} patients</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Meals */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Exemples de Plans Alimentaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Apple className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-gray-900 mb-2">Low Carb</h4>
            <p className="text-sm text-gray-600 mb-3">
              Riche en protéines et matières grasses saines, faible en glucides.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Petit-déj: Œufs & Avocat</li>
              <li>• Déjeuner: Poulet grillé & Salade</li>
              <li>• Dîner: Saumon & Brocoli</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Salad className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-gray-900 mb-2">Balanced</h4>
            <p className="text-sm text-gray-600 mb-3">
              Équilibre entre protéines, glucides et lipides.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Petit-déj: Flocons d'avoine & Fruits</li>
              <li>• Déjeuner: Riz, Poulet & Légumes</li>
              <li>• Dîner: Pâtes complètes & Poisson</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <ChefHat className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-gray-900 mb-2">Mediterranean</h4>
            <p className="text-sm text-gray-600 mb-3">
              Inspiré du régime méditerranéen, riche en huile d'olive et poisson.
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Petit-déj: Yaourt grec & Miel</li>
              <li>• Déjeuner: Salade grecque & Feta</li>
              <li>• Dîner: Poisson grillé & Légumes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
