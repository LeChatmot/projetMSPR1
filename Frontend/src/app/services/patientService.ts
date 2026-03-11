/**
 * Service pour la gestion des patients
 * Gère les appels API vers le backend avec fallback vers les mocks
 */

import { calculatePatientStats, mockPatients } from "../data/mockData";
import type { Patient, PatientStats } from "../types";
import { apiCall } from "./api";

export const patientService = {
  /**
   * Récupère tous les patients
   */
  async getPatients(): Promise<Patient[]> {
    return apiCall<Patient[]>("/patients", {}, async () => {
      // Simulation d'un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockPatients;
    });
  },

  /**
   * Récupère un patient par son ID
   */
  async getPatient(id: string): Promise<Patient | undefined> {
    const patients = await this.getPatients();
    return patients.find((p) => p.id === id);
  },

  /**
   * Crée un nouveau patient
   */
  async createPatient(patient: Omit<Patient, "id">): Promise<Patient> {
    return apiCall<Patient>(
      "/patients",
      {
        method: "POST",
        body: JSON.stringify(patient),
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newPatient: Patient = {
          ...patient,
          id: `P${String(mockPatients.length + 1).padStart(3, "0")}`,
        };
        return newPatient;
      },
    );
  },

  /**
   * Met à jour un patient existant
   */
  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    return apiCall<Patient>(
      `/patients/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(patient),
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const existing = mockPatients.find((p) => p.id === id);
        if (!existing) throw new Error("Patient non trouvé");
        return { ...existing, ...patient };
      },
    );
  },

  /**
   * Supprime un patient
   */
  async deletePatient(id: string): Promise<void> {
    return apiCall<void>(`/patients/${id}`, { method: "DELETE" }, async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Succès silencieu
    });
  },

  /**
   * Récupère les statistiques des patients
   */
  async getPatientStats(): Promise<PatientStats> {
    return apiCall<PatientStats>("/patients/stats", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return calculatePatientStats();
    });
  },
};
