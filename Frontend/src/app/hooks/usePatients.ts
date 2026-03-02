/**
 * Hook personnalisé pour gérer les données des patients
 * Gère automatiquement le chargement, les erreurs et le fallback vers les mocks
 */

import { useEffect, useState } from "react";
import { calculatePatientStats, mockPatients } from "../data/mockData";
import { patientService } from "../services";
import type { Patient, PatientStats } from "../types";

interface UsePatientsReturn {
  patients: Patient[];
  stats: PatientStats;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePatients(): UsePatientsReturn {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStats>({
    totalPatients: 0,
    patientsWithRisk: 0,
    averageAge: 0,
    averageWeight: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      // Essayer d'abord via le service (backend + fallback mock)
      const data = await patientService.getPatients();
      setPatients(data);
      setStats(calculatePatientStats());
    } catch (err) {
      // En cas d'erreur, utiliser les mock data
      console.warn("⚠️ Utilisation des données mock pour les patients");
      setPatients(mockPatients);
      setStats(calculatePatientStats());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    stats,
    loading,
    error,
    refresh: fetchPatients,
  };
}
