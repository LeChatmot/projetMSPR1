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
      // En mode développement, on utilise les mock data
      // Plus tard, ceci sera remplacé par des appels API réels
      setKpis(calculateKPIs());
      setSportDistribution(getSportDistribution());
      setWeightEvolution(mockWeightEvolution);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
