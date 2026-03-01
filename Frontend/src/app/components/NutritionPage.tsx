import { Apple, ChefHat, Pizza, Salad } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useNutrition } from "../hooks/useNutrition";

export function NutritionPage() {
  const { dietDistribution, stats, dietPlans, loading, error } = useNutrition();

  // Gestion des états de chargement et erreur
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des données nutrition...</div>
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
        <h1 className="text-gray-900 mb-2">Gestion de la Nutrition</h1>
        <p className="text-gray-600">
          Recommandations alimentaires et régimes des patients
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Apple className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{stats.totalDietTypes}</p>
          <p className="text-sm text-gray-600">Types de Régimes</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Salad className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{stats.activePlans}</p>
          <p className="text-sm text-gray-600">Plans Actifs</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <Pizza className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">
            {stats.averageCaloriesPerDay.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Calories Moy/Jour</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
            <ChefHat className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl text-gray-900 mb-1">
            {stats.availableRecipes}
          </p>
          <p className="text-sm text-gray-600">Recettes Dispo</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">
            Distribution des Régimes Alimentaires
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dietDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dietDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
            {dietDistribution.map((diet, index) => (
              <div
                key={diet.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: diet.color }}
                  ></div>
                  <span className="text-gray-900">{diet.name}</span>
                </div>
                <span className="text-gray-600">{diet.value} patients</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Meals */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Exemples de Plans Alimentaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dietPlans.slice(0, 3).map((plan) => (
            <div
              key={plan.name}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div
                className={`bg-${plan.color}-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
              >
                <span className="text-2xl">
                  {plan.icon === "Apple" && "🍎"}
                  {plan.icon === "Salad" && "🥗"}
                  {plan.icon === "ChefHat" && "👨‍🍳"}
                  {plan.icon === "Dumbbell" && "🏋️"}
                  {plan.icon === "Heart" && "❤️"}
                </span>
              </div>
              <h4 className="text-gray-900 mb-2">{plan.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Petit-déj: {plan.meals.breakfast}</li>
                <li>• Déjeuner: {plan.meals.lunch}</li>
                <li>• Dîner: {plan.meals.dinner}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
