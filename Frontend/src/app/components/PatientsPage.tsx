import { Activity, TrendingDown, Users } from "lucide-react";
import { usePatients } from "../hooks/usePatients";

export function PatientsPage() {
  const { patients, stats, loading, error } = usePatients();

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Gestion des Patients</h1>
        <p className="text-gray-600">
          Vue d'ensemble et détails de tous les patients
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Total Patients</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl text-gray-900">{stats.totalPatients}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Patients à Risque</h3>
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl text-gray-900">{stats.patientsWithRisk}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Âge Moyen</h3>
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl text-gray-900">{stats.averageAge} ans</p>
        </div>
      </div>

      {/* Patients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">{patient.id}</h3>
                <p className="text-sm text-gray-600">
                  {patient.age} ans •{" "}
                  {patient.gender === "M" ? "Homme" : "Femme"}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  patient.gender === "M" ? "bg-blue-100" : "bg-pink-100"
                }`}
              >
                <Users
                  className={`w-6 h-6 ${patient.gender === "M" ? "text-blue-600" : "text-pink-600"}`}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Poids</p>
                <p className="text-sm text-gray-900">{patient.weight} kg</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Risque Maladie</p>
                {patient.riskDisease === "None" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                    Aucun
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                    {patient.riskDisease}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Régime Recommandé</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                  {patient.dietRecommendation}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
