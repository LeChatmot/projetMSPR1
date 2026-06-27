import {
  calculateSportStats,
  getSportDistribution,
  mockSportSessions,
} from "../data/mockData";
import type { SportDistribution, SportSession, SportStats } from "../types";
import { apiCall } from "./api";

export interface UserSession {
  id: number;
  user_id: number;
  workout_type: string;
  duration_min: number;
  calories_burned: number;
  session_date: string;
}

export interface NewSessionPayload {
  user_id: number;
  workout_type: string;
  duration_min: number;
  calories_burned: number;
  session_date: string;
}

export const sportService = {
  async getSessions(): Promise<SportSession[]> {
    return apiCall<SportSession[]>("/sport/sessions", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockSportSessions;
    });
  },

  async getDistribution(): Promise<SportDistribution[]> {
    return apiCall<SportDistribution[]>("/sport/distribution", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getSportDistribution();
    });
  },

  async getStats(): Promise<SportStats> {
    return apiCall<SportStats>("/sport/stats", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return calculateSportStats();
    });
  },

  async getUserSessions(userId: number): Promise<UserSession[]> {
    const response = await fetch(`/api/user/sessions/${userId}`);
    const json = await response.json() as { success: boolean; data: UserSession[] };
    return json.success ? json.data : [];
  },

  async addUserSession(payload: NewSessionPayload): Promise<UserSession> {
    const response = await fetch("/api/user/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await response.json() as { success: boolean; data: UserSession };
    if (!json.success) throw new Error("Erreur lors de l'ajout de la séance");
    return json.data;
  },
};
