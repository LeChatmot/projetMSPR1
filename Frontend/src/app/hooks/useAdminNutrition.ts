import { useCallback, useEffect, useState } from "react";
import { nutritionService } from "../services/nutritionService";
import type { DietRecommendation } from "../types";

interface UseAdminNutritionReturn {
  recommendations: DietRecommendation[];
  loading: boolean;
  error: string | null;
  deleteRecommendation: (id: number) => Promise<void>;
}

export function useAdminNutrition(): UseAdminNutritionReturn {
  const [recommendations, setRecommendations] = useState<DietRecommendation[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await nutritionService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      setError(
        "Impossible de charger les recommandations. Le backend est-il lancé ?",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecommendation = useCallback(
    async (id: number) => {
      const originalState = [...recommendations];
      setRecommendations((prev) => prev.filter((rec) => rec.id !== id));

      try {
        await nutritionService.deleteRecommendation(id);
      } catch (err) {
        setError(
          `Échec de la suppression (ID: ${id}). Restauration de l'état.`,
        );
        setRecommendations(originalState);
      }
    },
    [recommendations],
  );

  useEffect(() => {
    void fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, error, deleteRecommendation };
}
