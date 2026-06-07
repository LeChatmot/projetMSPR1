/**
 * Service pour toutes les opérations liées à la nutrition.
 */
import {
  buildMockPaginatedResponse,
  getDietDistribution as mockDietDistribution,
  mockDietPlans,
  mockDietRecommendations,
  mockReferenceData,
  calculateNutritionStats as mockNutritionStats,
} from "../data/mockData";
import type {
  DietDistribution,
  DietPlan,
  DietRecommendation,
  NutritionStats,
  PaginatedResponse,
  ReferenceData,
} from "../types";
import { apiCall } from "./api";

export const nutritionService = {
  /**
   * Récupère la liste des recommandations pour le panel Admin.
   * Pas de fallback mock ici, car une page admin doit refléter la réalité ou une erreur.
   */
  getDietRecommendations: (): Promise<DietRecommendation[]> => {
    return apiCall("/nutrition/recommendations");
  },

  deleteDietRecommendation: (id: number): Promise<{ id: number }> => {
    return apiCall(`/nutrition/recommendations/${id}`, { method: "DELETE" });
  },

  getAdminPatients: (page: number, perPage: number): Promise<PaginatedResponse<DietRecommendation>> =>
    apiCall(
      `/admin/patients?page=${page}&per_page=${perPage}`,
      {},
      () => Promise.resolve(buildMockPaginatedResponse(mockDietRecommendations, page, perPage)),
    ),

  getAdminNutrition: (page: number, perPage: number): Promise<PaginatedResponse<DietRecommendation>> =>
    apiCall(
      `/admin/nutrition?page=${page}&per_page=${perPage}`,
      {},
      () => Promise.resolve(buildMockPaginatedResponse(mockDietRecommendations, page, perPage)),
    ),

  getReferenceData: (): Promise<ReferenceData> =>
    apiCall("/admin/reference-data", {}, () => Promise.resolve(mockReferenceData)),

  createDietRecommendation: (data: Partial<DietRecommendation>): Promise<DietRecommendation> =>
    apiCall("/admin/nutrition", { method: "POST", body: JSON.stringify(data) }),

  updateDietRecommendation: (id: number, data: Partial<DietRecommendation>): Promise<DietRecommendation> =>
    apiCall(`/admin/nutrition/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteAdminNutrition: (id: number): Promise<{ id: number }> =>
    apiCall(`/admin/nutrition/${id}`, { method: "DELETE" }),

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
