/**
 * Hook React pour le Dashboard
 * Agrège toutes les données nécessaires pour la page d'accueil
 */

import { useCallback, useEffect, useState } from "react";
import { mockWeightEvolution } from "../data/mockData";
import { getPatientStats } from "../services/patientService";
import { getSportDistribution, getSportStats } from "../services/sportService";
import type { DashboardKPIs, WeightEvolution } from "../types";

interface UseDashboardReturn {
  kpis: DashboardKPIs | null;
  weightEvolution: WeightEvolution[];
  sportDistribution: { type: string; sessions: number }[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [weightEvolution] = useState<WeightEvolution[]>(mockWeightEvolution); // Données statiques pour l'instant
  const [sportDistribution, setSportDistribution] = useState<
    { type: string; sessions: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupération parallèle des données du dashboard
      const [patientStats, sportStats, sportDist] = await Promise.all([
        getPatientStats(),
        getSportStats(),
        getSportDistribution(),
      ]);

      // Construction des KPIs à partir des stats
      const dashboardKPIs: DashboardKPIs = {
        totalPatients: patientStats.totalPatients,
        avgCaloriesBurned: sportStats.averageCalories,
        avgSessionDuration: sportStats.averageDuration,
        healthAlerts: patientStats.patientsWithRisk,
      };

      setKpis(dashboardKPIs);
      setSportDistribution(sportDist);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement du dashboard",
      );
      console.error("Erreur useDashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    kpis,
    weightEvolution,
    sportDistribution,
    loading,
    error,
    refresh: fetchData,
  };
}

// Hook simplifié pour juste les KPIs
export function useDashboardKPIs(): {
  kpis: DashboardKPIs | null;
  loading: boolean;
  error: string | null;
} {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const [patientStats, sportStats] = await Promise.all([
          getPatientStats(),
          getSportStats(),
        ]);

        setKpis({
          totalPatients: patientStats.totalPatients,
          avgCaloriesBurned: sportStats.averageCalories,
          avgSessionDuration: sportStats.averageDuration,
          healthAlerts: patientStats.patientsWithRisk,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  return { kpis, loading, error };
}
