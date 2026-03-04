/**
 * Service pour la gestion des données sportives
 * Gère les appels API vers le backend avec fallback vers les mocks
 */

import {
  calculateSportStats,
  getSportDistribution,
  mockSportSessions,
} from "../data/mockData";
import type { SportDistribution, SportSession, SportStats } from "../types";
import { apiCall } from "./api";

export const sportService = {
  /**
   * Récupère toutes les sessions sportives
   */
  async getSessions(): Promise<SportSession[]> {
    return apiCall<SportSession[]>("/sport/sessions", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockSportSessions;
    });
  },

  /**
   * Récupère la distribution des sports
   */
  async getDistribution(): Promise<SportDistribution[]> {
    return apiCall<SportDistribution[]>("/sport/distribution", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getSportDistribution();
    });
  },

  /**
   * Récupère les stats sportives
   */
  async getStats(): Promise<SportStats> {
    return apiCall<SportStats>("/sport/stats", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return calculateSportStats();
    });
  },

  /**
   * Ajoute une nouvelle session
   */
  async addSession(session: Omit<SportSession, "id">): Promise<SportSession> {
    return apiCall<SportSession>(
      "/sport/sessions",
      {
        method: "POST",
        body: JSON.stringify(session),
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newSession: SportSession = {
          ...session,
          id: `S${String(mockSportSessions.length + 1).padStart(3, "0")}`,
        };
        return newSession;
      },
    );
  },
};
