/**
 * Service pour la gestion de la nutrition
 * Gère les appels API vers le backend avec fallback vers les mocks
 */

import {
  calculateNutritionStats,
  getDietDistribution,
  mockDietPlans,
} from "../data/mockData";
import type { DietDistribution, DietPlan, NutritionStats } from "../types";
import { apiCall } from "./api";

export const nutritionService = {
  /**
   * Récupère la distribution des régimes
   */
  async getDietDistribution(): Promise<DietDistribution[]> {
    return apiCall<DietDistribution[]>(
      "/nutrition/diet-distribution",
      {},
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return getDietDistribution();
      },
    );
  },

  /**
   * Récupère les stats nutrition
   */
  async getNutritionStats(): Promise<NutritionStats> {
    return apiCall<NutritionStats>("/nutrition/stats", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return calculateNutritionStats();
    });
  },

  /**
   * Récupère les plans alimentaires
   */
  async getDietPlans(): Promise<DietPlan[]> {
    return apiCall<DietPlan[]>("/nutrition/diet-plans", {}, async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDietPlans;
    });
  },

  /**
   * Crée un nouveau plan alimentaire
   */
  async createDietPlan(
    plan: Omit<DietPlan, "icon" | "color">,
  ): Promise<DietPlan> {
    return apiCall<DietPlan>(
      "/nutrition/diet-plans",
      {
        method: "POST",
        body: JSON.stringify(plan),
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newPlan: DietPlan = {
          ...plan,
          icon: "🥗",
          color: "bg-gray-100",
        };
        return newPlan;
      },
    );
  },
};
