/**
 * Hook React pour la gestion des patients
 * Fournit les données patients avec état de chargement et gestion d'erreurs
 */

import { useCallback, useEffect, useState } from "react";
import {
  getAllPatients,
  getPatientStats,
  getPatientsAtRisk,
} from "../services/patientService";
import type { Patient, PatientStats } from "../types";

interface UsePatientsReturn {
  patients: Patient[];
  stats: PatientStats | null;
  patientsAtRisk: Patient[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePatients(): UsePatientsReturn {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [patientsAtRisk, setPatientsAtRisk] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupération parallèle des données
      const [patientsData, statsData, atRiskData] = await Promise.all([
        getAllPatients(),
        getPatientStats(),
        getPatientsAtRisk(),
      ]);

      setPatients(patientsData);
      setStats(statsData);
      setPatientsAtRisk(atRiskData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des patients",
      );
      console.error("Erreur usePatients:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    patients,
    stats,
    patientsAtRisk,
    loading,
    error,
    refresh: fetchData,
  };
}

// Hook simplifié pour juste la liste des patients
export function usePatientsList(): {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
} {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    refresh: fetchPatients,
  };
}

// Hook pour les statistiques uniquement
export function usePatientStats(): {
  stats: PatientStats | null;
  loading: boolean;
  error: string | null;
} {
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPatientStats();
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
