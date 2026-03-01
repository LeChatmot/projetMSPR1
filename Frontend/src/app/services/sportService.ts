/**
 * Service de gestion des activités sportives
 * Abstrait les appels API pour les opérations CRUD sur le sport
 */

import { mockSportSessions } from "../data/mockData";
import type {
  SportDistribution,
  SportSession,
  SportStats,
  SportTypeInfo,
} from "../types";
import { apiCall } from "./api";

// Informations sur les types de sport (données statiques de référence)
const SPORT_TYPES: SportTypeInfo[] = [
  {
    type: "Yoga",
    name: "Yoga",
    description: "Souplesse et relaxation",
    intensity: "Faible",
    icon: "🧘",
    color: "purple",
  },
  {
    type: "HIIT",
    name: "HIIT",
    description: "Haute intensité",
    intensity: "Très Haute",
    icon: "🔥",
    color: "red",
  },
  {
    type: "Cardio",
    name: "Cardio",
    description: "Endurance cardiovasculaire",
    intensity: "Modérée",
    icon: "🏃",
    color: "blue",
  },
  {
    type: "Strength",
    name: "Strength",
    description: "Renforcement musculaire",
    intensity: "Haute",
    icon: "💪",
    color: "green",
  },
];

/**
 * Récupère toutes les sessions sportives
 * GET /sport/sessions
 */
export async function getAllSessions(): Promise<SportSession[]> {
  return apiCall<SportSession[]>(
    "/sport/sessions",
    { method: "GET" },
    async () => mockSportSessions,
  );
}

/**
 * Récupère les sessions récentes (limitées)
 * GET /sport/sessions/recent?limit=:limit
 */
export async function getRecentSessions(
  limit: number = 8,
): Promise<SportSession[]> {
  return apiCall<SportSession[]>(
    `/sport/sessions/recent?limit=${limit}`,
    { method: "GET" },
    async () => mockSportSessions.slice(0, limit),
  );
}

/**
 * Crée une nouvelle session sportive
 * POST /sport/sessions
 */
export async function createSession(
  session: Omit<SportSession, "id">,
): Promise<SportSession> {
  return apiCall<SportSession>(
    "/sport/sessions",
    {
      method: "POST",
      body: JSON.stringify(session),
    },
    async () => {
      const newSession: SportSession = {
        ...session,
        id: `S${Date.now()}`,
      };
      mockSportSessions.unshift(newSession);
      return newSession;
    },
  );
}

/**
 * Récupère les statistiques sportives globales
 * GET /sport/stats
 */
export async function getSportStats(): Promise<SportStats> {
  return apiCall<SportStats>("/sport/stats", { method: "GET" }, async () => {
    const totalSessions = mockSportSessions.length;
    const totalCalories = mockSportSessions.reduce(
      (sum, s) => sum + s.caloriesBurned,
      0,
    );
    const totalDuration = mockSportSessions.reduce(
      (sum, s) => sum + s.duration,
      0,
    );

    return {
      totalSessions,
      totalCalories,
      totalDuration,
      averageDuration: Math.round(totalDuration / totalSessions),
      averageCalories: Math.round(totalCalories / totalSessions),
    };
  });
}

/**
 * Récupère la distribution des types de sport
 * GET /sport/distribution
 */
export async function getSportDistribution(): Promise<SportDistribution[]> {
  return apiCall<SportDistribution[]>(
    "/sport/distribution",
    { method: "GET" },
    async () => {
      const distribution: Record<string, number> = {};

      mockSportSessions.forEach((session) => {
        distribution[session.type] = (distribution[session.type] || 0) + 1;
      });

      return Object.entries(distribution).map(([type, sessions]) => ({
        type,
        sessions,
      }));
    },
  );
}

/**
 * Récupère les calories moyennes par type de sport
 * GET /sport/calories-by-type
 */
export async function getCaloriesByType(): Promise<
  { type: string; avgCalories: number }[]
> {
  return apiCall<{ type: string; avgCalories: number }[]>(
    "/sport/calories-by-type",
    { method: "GET" },
    async () => {
      const caloriesByType = mockSportSessions.reduce(
        (acc, session) => {
          if (!acc[session.type]) {
            acc[session.type] = { total: 0, count: 0 };
          }
          acc[session.type].total += session.caloriesBurned;
          acc[session.type].count += 1;
          return acc;
        },
        {} as Record<string, { total: number; count: number }>,
      );

      return Object.entries(caloriesByType).map(([type, data]) => ({
        type,
        avgCalories: Math.round(data.total / data.count),
      }));
    },
  );
}

/**
 * Récupère les informations sur les types de sport
 * GET /sport/types
 */
export async function getSportTypes(): Promise<SportTypeInfo[]> {
  return apiCall<SportTypeInfo[]>(
    "/sport/types",
    { method: "GET" },
    async () => SPORT_TYPES,
  );
}

/**
 * Récupère les informations d'un type de sport spécifique
 * GET /sport/types/:type
 */
export async function getSportTypeInfo(
  type: string,
): Promise<SportTypeInfo | undefined> {
  return apiCall<SportTypeInfo | undefined>(
    `/sport/types/${type}`,
    { method: "GET" },
    async () => SPORT_TYPES.find((st) => st.type === type),
  );
}
