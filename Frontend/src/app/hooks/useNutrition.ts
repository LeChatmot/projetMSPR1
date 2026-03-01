/**
 * Hook React pour la gestion de la nutrition
 * Fournit les données nutrition avec état de chargement et gestion d'erreurs
 */

import { useCallback, useEffect, useState } from "react";
import {
  getAllDietPlans,
  getDietDistribution,
  getNutritionStats,
} from "../services/nutritionService";
import type { DietDistribution, DietPlan, NutritionStats } from "../types";

interface UseNutritionReturn {
  dietDistribution: DietDistribution[];
  stats: NutritionStats | null;
  dietPlans: DietPlan[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useNutrition(): UseNutritionReturn {
  const [dietDistribution, setDietDistribution] = useState<DietDistribution[]>(
    [],
  );
  const [stats, setStats] = useState<NutritionStats | null>(null);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupération parallèle des données nutrition
      const [distributionData, statsData, plansData] = await Promise.all([
        getDietDistribution(),
        getNutritionStats(),
        getAllDietPlans(),
      ]);

      setDietDistribution(distributionData);
      setStats(statsData);
      setDietPlans(plansData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données nutrition",
      );
      console.error("Erreur useNutrition:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    dietDistribution,
    stats,
    dietPlans,
    loading,
    error,
    refresh: fetchData,
  };
}

// Hook pour les statistiques uniquement
export function useNutritionStats(): {
  stats: NutritionStats | null;
  loading: boolean;
  error: string | null;
} {
  const [stats, setStats] = useState<NutritionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getNutritionStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

// Hook pour la distribution des régimes uniquement
export function useDietDistribution(): {
  distribution: DietDistribution[];
  loading: boolean;
  error: string | null;
} {
  const [distribution, setDistribution] = useState<DietDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const data = await getDietDistribution();
        setDistribution(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, []);

  return { distribution, loading, error };
}
