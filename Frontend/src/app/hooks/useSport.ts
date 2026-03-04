/**
 * Hook personnalisé pour gérer les données sportives
 * Gère automatiquement le chargement, les erreurs et le fallback vers les mocks
 */

import { useEffect, useState } from "react";
import {
  calculateSportStats,
  getSportDistribution,
  mockSportSessions,
} from "../data/mockData";
import { sportService } from "../services";
import type { SportDistribution, SportSession, SportStats } from "../types";

interface UseSportReturn {
  sessions: SportSession[];
  stats: SportStats;
  distribution: SportDistribution[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSport(): UseSportReturn {
  const [sessions, setSessions] = useState<SportSession[]>([]);
  const [stats, setStats] = useState<SportStats>({
    totalSessions: 0,
    totalCalories: 0,
    totalDuration: 0,
    averageDuration: 0,
    averageCalories: 0,
  });
  const [distribution, setDistribution] = useState<SportDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSportData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Essayer d'abord via le service (backend + fallback mock)
      const data = await sportService.getSessions();
      setSessions(data);
      setStats(calculateSportStats());
      setDistribution(getSportDistribution());
    } catch (err) {
      // En cas d'erreur, utiliser les mock data
      console.warn("⚠️ Utilisation des données mock pour le sport");
      setSessions(mockSportSessions);
      setStats(calculateSportStats());
      setDistribution(getSportDistribution());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportData();
  }, []);

  return {
    sessions,
    stats,
    distribution,
    loading,
    error,
    refresh: fetchSportData,
  };
}
