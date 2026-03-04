/**
 * Hook personnalisé pour gérer les données de nutrition
 * Gère automatiquement le chargement, les erreurs et le fallback vers les mocks
 */

import { useEffect, useState } from "react";
import {
  calculateNutritionStats,
  getDietDistribution,
  mockDietPlans,
} from "../data/mockData";
import { nutritionService } from "../services";
import type { DietDistribution, DietPlan, NutritionStats } from "../types";

interface UseNutritionReturn {
  dietDistribution: DietDistribution[];
  stats: NutritionStats;
  dietPlans: DietPlan[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useNutrition(): UseNutritionReturn {
  const [dietDistribution, setDietDistribution] = useState<DietDistribution[]>(
    [],
  );
  const [stats, setStats] = useState<NutritionStats>({
    totalDietTypes: 0,
    activePlans: 0,
    averageCaloriesPerDay: 0,
    availableRecipes: 0,
  });
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNutritionData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Essayer d'abord via le service (backend + fallback mock)
      const [distribution, nutritionStats] = await Promise.all([
        nutritionService.getDietDistribution(),
        nutritionService.getNutritionStats(),
      ]);
      setDietDistribution(distribution);
      setStats(nutritionStats);
      setDietPlans(mockDietPlans);
    } catch (err) {
      // En cas d'erreur, utiliser les mock data
      console.warn("⚠️ Utilisation des données mock pour la nutrition");
      setDietDistribution(getDietDistribution());
      setStats(calculateNutritionStats());
      setDietPlans(mockDietPlans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutritionData();
  }, []);

  return {
    dietDistribution,
    stats,
    dietPlans,
    loading,
    error,
    refresh: fetchNutritionData,
  };
}
