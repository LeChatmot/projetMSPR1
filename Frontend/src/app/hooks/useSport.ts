/**
 * Hook React pour la gestion des activités sportives
 * Fournit les données sport avec état de chargement et gestion d'erreurs
 */

import { useCallback, useEffect, useState } from "react";
import {
  getAllSessions,
  getCaloriesByType,
  getRecentSessions,
  getSportDistribution,
  getSportStats,
  getSportTypes,
} from "../services/sportService";
import type {
  SportDistribution,
  SportSession,
  SportStats,
  SportTypeInfo,
} from "../types";

interface UseSportReturn {
  sessions: SportSession[];
  recentSessions: SportSession[];
  stats: SportStats | null;
  distribution: SportDistribution[];
  caloriesByType: { type: string; avgCalories: number }[];
  sportTypes: SportTypeInfo[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSport(): UseSportReturn {
  const [sessions, setSessions] = useState<SportSession[]>([]);
  const [recentSessions, setRecentSessions] = useState<SportSession[]>([]);
  const [stats, setStats] = useState<SportStats | null>(null);
  const [distribution, setDistribution] = useState<SportDistribution[]>([]);
  const [caloriesByType, setCaloriesByType] = useState<
    { type: string; avgCalories: number }[]
  >([]);
  const [sportTypes, setSportTypes] = useState<SportTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupération parallèle de toutes les données sport
      const [
        sessionsData,
        recentData,
        statsData,
        distributionData,
        caloriesData,
        typesData,
      ] = await Promise.all([
        getAllSessions(),
        getRecentSessions(8),
        getSportStats(),
        getSportDistribution(),
        getCaloriesByType(),
        getSportTypes(),
      ]);

      setSessions(sessionsData);
      setRecentSessions(recentData);
      setStats(statsData);
      setDistribution(distributionData);
      setCaloriesByType(caloriesData);
      setSportTypes(typesData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données sport",
      );
      console.error("Erreur useSport:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    sessions,
    recentSessions,
    stats,
    distribution,
    caloriesByType,
    sportTypes,
    loading,
    error,
    refresh: fetchData,
  };
}

// Hook simplifié pour les statistiques uniquement
export function useSportStats(): {
  stats: SportStats | null;
  distribution: SportDistribution[];
  loading: boolean;
  error: string | null;
} {
  const [stats, setStats] = useState<SportStats | null>(null);
  const [distribution, setDistribution] = useState<SportDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, distributionData] = await Promise.all([
          getSportStats(),
          getSportDistribution(),
        ]);
        setStats(statsData);
        setDistribution(distributionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, distribution, loading, error };
}

// Hook pour les sessions récentes uniquement
export function useRecentSessions(limit: number = 8): {
  sessions: SportSession[];
  loading: boolean;
  error: string | null;
} {
  const [sessions, setSessions] = useState<SportSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getRecentSessions(limit);
        setSessions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [limit]);

  return { sessions, loading, error };
}
