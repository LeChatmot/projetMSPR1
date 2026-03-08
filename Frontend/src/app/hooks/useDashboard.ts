/**
 * Hook personnalisé pour gérer les données du dashboard
 * Combine les données de plusieurs sources pour les KPIs
 */

import { useEffect, useState } from "react";
import {
  calculateKPIs,
  getSportDistribution,
  mockWeightEvolution,
} from "../data/mockData";
import { apiCall } from "../services/api";
import type {
  DashboardKPIs,
  SportDistribution,
  WeightEvolution,
} from "../types";

interface UseDashboardReturn {
  kpis: DashboardKPIs;
  sportDistribution: SportDistribution[];
  weightEvolution: WeightEvolution[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalPatients: 0,
    avgCaloriesBurned: 0,
    avgSessionDuration: 0,
    healthAlerts: 0,
  });
  const [sportDistribution, setSportDistribution] = useState<
    SportDistribution[]
  >([]);
  const [weightEvolution, setWeightEvolution] = useState<WeightEvolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Tentative de récupération via l'API
      // On utilise Promise.all pour paralléliser les appels si les endpoints existent
      const [apiKpis, apiDistribution, apiWeight] = await Promise.all([
        apiCall<DashboardKPIs>("/dashboard/kpis"),
        apiCall<SportDistribution[]>("/dashboard/sport-distribution"),
        apiCall<WeightEvolution[]>("/dashboard/weight-evolution"),
      ]);

      setKpis(apiKpis);
      setSportDistribution(apiDistribution);
      setWeightEvolution(apiWeight);
    } catch (err) {
      // Fallback vers les mock data en cas d'erreur ou backend indisponible
      console.warn("⚠️ Utilisation des données mock pour le dashboard");
      setKpis(calculateKPIs());
      setSportDistribution(getSportDistribution());
      setWeightEvolution(mockWeightEvolution);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On utilise `void` pour indiquer qu'on ignore volontairement la promesse retournée, ce qui est requis par useEffect.
    void fetchDashboardData();
  }, []);

  return {
    kpis,
    sportDistribution,
    weightEvolution,
    loading,
    error,
    refresh: fetchDashboardData,
  };
}
