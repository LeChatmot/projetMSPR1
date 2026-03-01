/**
 * Service de gestion des patients
 * Abstrait les appels API pour les opérations CRUD sur les patients
 */

import { mockPatients } from "../data/mockData";
import type { Patient, PatientStats } from "../types";
import { apiCall } from "./api";

/**
 * Récupère tous les patients
 * GET /patients
 */
export async function getAllPatients(): Promise<Patient[]> {
  return apiCall<Patient[]>(
    "/patients",
    { method: "GET" },
    async () => mockPatients, // Fallback mock
  );
}

/**
 * Récupère un patient par son ID
 * GET /patients/:id
 */
export async function getPatientById(id: string): Promise<Patient | undefined> {
  return apiCall<Patient | undefined>(
    `/patients/${id}`,
    { method: "GET" },
    async () => mockPatients.find((p) => p.id === id),
  );
}

/**
 * Crée un nouveau patient
 * POST /patients
 */
export async function createPatient(
  patient: Omit<Patient, "id">,
): Promise<Patient> {
  return apiCall<Patient>(
    "/patients",
    {
      method: "POST",
      body: JSON.stringify(patient),
    },
    async () => {
      // Simulation mock
      const newPatient: Patient = {
        ...patient,
        id: `P${String(mockPatients.length + 1).padStart(3, "0")}`,
      };
      mockPatients.push(newPatient);
      return newPatient;
    },
  );
}

/**
 * Met à jour un patient
 * PUT /patients/:id
 */
export async function updatePatient(
  id: string,
  updates: Partial<Patient>,
): Promise<Patient> {
  return apiCall<Patient>(
    `/patients/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    },
    async () => {
      const index = mockPatients.findIndex((p) => p.id === id);
      if (index === -1) throw new Error(`Patient ${id} non trouvé`);

      mockPatients[index] = { ...mockPatients[index], ...updates };
      return mockPatients[index];
    },
  );
}

/**
 * Supprime un patient
 * DELETE /patients/:id
 */
export async function deletePatient(id: string): Promise<void> {
  return apiCall<void>(`/patients/${id}`, { method: "DELETE" }, async () => {
    const index = mockPatients.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Patient ${id} non trouvé`);
    mockPatients.splice(index, 1);
  });
}

/**
 * Récupère les statistiques des patients
 * GET /patients/stats
 */
export async function getPatientStats(): Promise<PatientStats> {
  return apiCall<PatientStats>(
    "/patients/stats",
    { method: "GET" },
    async () => {
      // Calcul des statistiques mock
      const totalPatients = mockPatients.length;
      const patientsWithRisk = mockPatients.filter(
        (p) => p.riskDisease !== "None",
      ).length;
      const averageAge = Math.round(
        mockPatients.reduce((sum, p) => sum + p.age, 0) / totalPatients,
      );
      const averageWeight =
        Math.round(
          (mockPatients.reduce((sum, p) => sum + p.weight, 0) / totalPatients) *
            10,
        ) / 10;

      return {
        totalPatients,
        patientsWithRisk,
        averageAge,
        averageWeight,
      };
    },
  );
}

/**
 * Récupère les patients à risque
 * GET /patients/risk
 */
export async function getPatientsAtRisk(): Promise<Patient[]> {
  return apiCall<Patient[]>("/patients/risk", { method: "GET" }, async () =>
    mockPatients.filter((p) => p.riskDisease !== "None"),
  );
}
