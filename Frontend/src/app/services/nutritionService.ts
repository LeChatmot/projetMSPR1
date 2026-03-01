/**
 * Service de gestion de la nutrition
 * Abstrait les appels API pour les opérations sur la nutrition
 */

import { mockPatients } from "../data/mockData";
import type { DietDistribution, DietPlan, NutritionStats } from "../types";
import { apiCall } from "./api";

// Plans alimentaires de référence (données statiques)
const DIET_PLANS: DietPlan[] = [
  {
    name: "Low Carb",
    description:
      "Riche en protéines et matières grasses saines, faible en glucides.",
    meals: {
      breakfast: "Œufs & Avocat",
      lunch: "Poulet grillé & Salade",
      dinner: "Saumon & Brocoli",
    },
    icon: "Apple",
    color: "blue",
  },
  {
    name: "Balanced",
    description: "Équilibre entre protéines, glucides et lipides.",
    meals: {
      breakfast: "Flocons d'avoine & Fruits",
      lunch: "Riz, Poulet & Légumes",
      dinner: "Pâtes complètes & Poisson",
    },
    icon: "Salad",
    color: "green",
  },
  {
    name: "Mediterranean",
    description:
      "Inspiré du régime méditerranéen, riche en huile d'olive et poisson.",
    meals: {
      breakfast: "Yaourt grec & Miel",
      lunch: "Salade grecque & Feta",
      dinner: "Poisson grillé & Légumes",
    },
    icon: "ChefHat",
    color: "purple",
  },
  {
    name: "High Protein",
    description: "Optimisé pour la prise de masse musculaire.",
    meals: {
      breakfast: "Omelette au fromage",
      lunch: "Steak de bœuf & Quinoa",
      dinner: "Blanc de poulet & Légumes",
    },
    icon: "Dumbbell",
    color: "orange",
  },
  {
    name: "Low Fat",
    description: "Faible en matières grasses, idéal pour la perte de poids.",
    meals: {
      breakfast: "Fruits frais & Thé vert",
      lunch: "Salade de thon & Légumes",
      dinner: "Soupe de légumes & Pain complet",
    },
    icon: "Heart",
    color: "red",
  },
];

// Couleurs pour les graphiques
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

/**
 * Récupère la distribution des régimes alimentaires
 * GET /nutrition/diet-distribution
 */
export async function getDietDistribution(): Promise<DietDistribution[]> {
  return apiCall<DietDistribution[]>(
    "/nutrition/diet-distribution",
    { method: "GET" },
    async () => {
      const distribution = mockPatients.reduce(
        (acc, patient) => {
          acc[patient.dietRecommendation] =
            (acc[patient.dietRecommendation] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return Object.entries(distribution).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      }));
    },
  );
}

/**
 * Récupère les statistiques nutritionnelles
 * GET /nutrition/stats
 */
export async function getNutritionStats(): Promise<NutritionStats> {
  return apiCall<NutritionStats>(
    "/nutrition/stats",
    { method: "GET" },
    async () => {
      const distribution = mockPatients.reduce(
        (acc, patient) => {
          acc[patient.dietRecommendation] =
            (acc[patient.dietRecommendation] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        totalDietTypes: Object.keys(distribution).length,
        activePlans: mockPatients.length,
        averageCaloriesPerDay: 2200, // Valeur mock fixe
        availableRecipes: 156, // Valeur mock fixe
      };
    },
  );
}

/**
 * Récupère tous les plans alimentaires disponibles
 * GET /nutrition/diet-plans
 */
export async function getAllDietPlans(): Promise<DietPlan[]> {
  return apiCall<DietPlan[]>(
    "/nutrition/diet-plans",
    { method: "GET" },
    async () => DIET_PLANS,
  );
}

/**
 * Récupère un plan alimentaire spécifique
 * GET /nutrition/diet-plans/:name
 */
export async function getDietPlan(name: string): Promise<DietPlan | undefined> {
  return apiCall<DietPlan | undefined>(
    `/nutrition/diet-plans/${name}`,
    { method: "GET" },
    async () => DIET_PLANS.find((plan) => plan.name === name),
  );
}

/**
 * Récupère les recommandations pour un patient spécifique
 * GET /nutrition/recommendations/:patientId
 */
export async function getPatientRecommendations(patientId: string): Promise<{
  dietPlan: DietPlan;
  dailyCalories: number;
  restrictions: string[];
}> {
  return apiCall<{
    dietPlan: DietPlan;
    dailyCalories: number;
    restrictions: string[];
  }>(`/nutrition/recommendations/${patientId}`, { method: "GET" }, async () => {
    const patient = mockPatients.find((p) => p.id === patientId);
    if (!patient) throw new Error(`Patient ${patientId} non trouvé`);

    const dietPlan =
      DIET_PLANS.find((plan) => plan.name === patient.dietRecommendation) ||
      DIET_PLANS[0];

    // Calcul des calories basé sur le poids (simplifié)
    const dailyCalories = Math.round(patient.weight * 22);

    // Restrictions basées sur les maladies
    const restrictions: string[] = [];
    if (patient.riskDisease === "Diabetes Type 2") {
      restrictions.push("Sucre", "Glucides raffinés");
    }
    if (patient.riskDisease === "Hypertension") {
      restrictions.push("Sel", "Sodium");
    }
    if (patient.riskDisease === "High Cholesterol") {
      restrictions.push("Graisses saturées", "Cholestérol");
    }

    return {
      dietPlan,
      dailyCalories,
      restrictions,
    };
  });
}
