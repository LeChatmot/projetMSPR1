/**
 * Service pour toutes les opérations liées à la nutrition.
 */
import {
  getDietDistribution as mockDietDistribution,
  mockDietPlans,
  calculateNutritionStats as mockNutritionStats,
} from "../data/mockData";
import type {
  DietDistribution,
  DietPlan,
  DietRecommendation,
  NutritionStats,
} from "../types";
import { apiCall } from "./api";

export const nutritionService = {
  /**
   * Récupère la liste des recommandations pour le panel Admin.
   * Pas de fallback mock ici, car une page admin doit refléter la réalité ou une erreur.
   */
  getRecommendations: (): Promise<DietRecommendation[]> => {
    return apiCall("/nutrition/recommendations");
  },

  /**
   * Supprime une recommandation spécifique.
   */
  deleteRecommendation: (id: number): Promise<{ id: number }> => {
    return apiCall(`/nutrition/recommendations/${id}`, { method: "DELETE" });
  },

  /**
   * Récupère la distribution des régimes pour le dashboard public.
   */
  getDietDistribution: (): Promise<DietDistribution[]> => {
    return apiCall("/nutrition/distribution", {}, () =>
      Promise.resolve(mockDietDistribution()),
    );
  },

  /**
   * Récupère les statistiques de nutrition pour le dashboard public.
   */
  getNutritionStats: (): Promise<NutritionStats> => {
    return apiCall("/nutrition/stats", {}, () =>
      Promise.resolve(mockNutritionStats()),
    );
  },

  /**
   * Récupère les plans de régime pour le dashboard public.
   */
  getDietPlans: (): Promise<DietPlan[]> => {
    return apiCall("/nutrition/plans", {}, () =>
      Promise.resolve(mockDietPlans),
    );
  },
};
