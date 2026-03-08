import { useAdminNutrition } from "../hooks/useAdminNutrition";

export function AdminNutritionPage() {
  const { recommendations, loading, error, deleteRecommendation } =
    useAdminNutrition();

  if (loading) {
    return <div className="p-4">Chargement des recommandations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Admin : Recommandations Nutritionnelles
      </h1>
      <p className="mb-4">
        Cette page permet de visualiser et nettoyer les données issues de la
        source "Diet Recommendations".
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Âge</th>
              <th className="py-2 px-4 border">Genre</th>
              <th className="py-2 px-4 border">Maladie</th>
              <th className="py-2 px-4 border">Régime Recommandé</th>
              <th className="py-2 px-4 border">Allergie</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border text-center">{rec.id}</td>
                <td className="py-2 px-4 border text-center">{rec.age}</td>
                <td className="py-2 px-4 border">{rec.gender_name}</td>
                <td className="py-2 px-4 border">{rec.disease_name}</td>
                <td className="py-2 px-4 border">{rec.diet_name}</td>
                <td className="py-2 px-4 border">
                  {rec.allergy_name || "Aucune"}
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => deleteRecommendation(rec.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
