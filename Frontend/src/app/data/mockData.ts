/**
 * Mock Data - Données de test pour le développement
 * Ces données sont utilisées en fallback si le backend n'est pas disponible
 */

import type {
  DashboardKPIs,
  DietDistribution,
  DietPlan,
  NutritionStats,
  Patient,
  PatientStats,
  SportDistribution,
  SportSession,
  SportStats,
  WeightEvolution,
} from "../types";

// ==================== PATIENTS ====================
export const mockPatients: Patient[] = [
  {
    id: "P001",
    age: 45,
    gender: "M",
    riskDisease: "Hypertension",
    dietRecommendation: "Low Carb",
    weight: 85.5,
    importDate: "2026-02-04",
  },
  {
    id: "P002",
    age: 32,
    gender: "F",
    riskDisease: "None",
    dietRecommendation: "Balanced",
    weight: 62.3,
    importDate: "2026-02-04",
  },
  {
    id: "P003",
    age: 58,
    gender: "M",
    riskDisease: "Diabetes Type 2",
    dietRecommendation: "Low Carb",
    weight: 92.1,
    importDate: "2026-02-03",
  },
  {
    id: "P004",
    age: 27,
    gender: "F",
    riskDisease: "None",
    dietRecommendation: "High Protein",
    weight: 58.7,
    importDate: "2026-02-03",
  },
  {
    id: "P005",
    age: 71,
    gender: "M",
    riskDisease: "Hypertension",
    dietRecommendation: "Mediterranean",
    weight: 78.9,
    importDate: "2026-02-02",
  },
  {
    id: "P006",
    age: 39,
    gender: "F",
    riskDisease: "None",
    dietRecommendation: "Balanced",
    weight: 65.2,
    importDate: "2026-02-02",
  },
  {
    id: "P007",
    age: 52,
    gender: "M",
    riskDisease: "High Cholesterol",
    dietRecommendation: "Low Fat",
    weight: 88.4,
    importDate: "2026-02-01",
  },
  {
    id: "P008",
    age: 24,
    gender: "F",
    riskDisease: "None",
    dietRecommendation: "Balanced",
    weight: 56.8,
    importDate: "2026-02-01",
  },
];

// ==================== SPORT SESSIONS ====================
export const mockSportSessions: SportSession[] = [
  { type: "Yoga", duration: 45, caloriesBurned: 180, date: "2026-02-04" },
  { type: "HIIT", duration: 30, caloriesBurned: 350, date: "2026-02-04" },
  { type: "Cardio", duration: 60, caloriesBurned: 420, date: "2026-02-03" },
  { type: "Strength", duration: 50, caloriesBurned: 290, date: "2026-02-03" },
  { type: "Yoga", duration: 60, caloriesBurned: 240, date: "2026-02-02" },
  { type: "HIIT", duration: 35, caloriesBurned: 380, date: "2026-02-02" },
  { type: "Cardio", duration: 45, caloriesBurned: 330, date: "2026-02-01" },
  { type: "Strength", duration: 55, caloriesBurned: 310, date: "2026-02-01" },
  { type: "Yoga", duration: 50, caloriesBurned: 200, date: "2026-01-31" },
  { type: "Cardio", duration: 70, caloriesBurned: 490, date: "2026-01-31" },
  { type: "HIIT", duration: 40, caloriesBurned: 400, date: "2026-01-30" },
  { type: "Strength", duration: 60, caloriesBurned: 330, date: "2026-01-30" },
  { type: "Yoga", duration: 55, caloriesBurned: 220, date: "2026-01-29" },
  { type: "Cardio", duration: 50, caloriesBurned: 360, date: "2026-01-29" },
  { type: "HIIT", duration: 32, caloriesBurned: 370, date: "2026-01-28" },
  { type: "Strength", duration: 48, caloriesBurned: 280, date: "2026-01-28" },
  { type: "Yoga", duration: 42, caloriesBurned: 170, date: "2026-01-27" },
  { type: "Cardio", duration: 55, caloriesBurned: 390, date: "2026-01-27" },
];

// ==================== WEIGHT EVOLUTION ====================
export const mockWeightEvolution: WeightEvolution[] = [
  { month: "Sept 2025", averageWeight: 74.2 },
  { month: "Oct 2025", averageWeight: 73.8 },
  { month: "Nov 2025", averageWeight: 72.5 },
  { month: "Déc 2025", averageWeight: 71.9 },
  { month: "Jan 2026", averageWeight: 71.2 },
  { month: "Fév 2026", averageWeight: 70.5 },
];

// ==================== DIET PLANS ====================
export const mockDietPlans: DietPlan[] = [
  {
    name: "Low Carb",
    description:
      "Riche en protéines et matières grasses saines, faible en glucides.",
    meals: {
      breakfast: "Œufs & Avocat",
      lunch: "Poulet grillé & Salade",
      dinner: "Saumon & Brocoli",
    },
    icon: "🥑",
    color: "bg-green-100",
  },
  {
    name: "Balanced",
    description: "Équilibre entre protéines, glucides et lipides.",
    meals: {
      breakfast: "Flocons d'avoine & Fruits",
      lunch: "Riz, Poulet & Légumes",
      dinner: "Pâtes complètes & Poisson",
    },
    icon: "🥗",
    color: "bg-blue-100",
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
    icon: "🫒",
    color: "bg-purple-100",
  },
];

// ==================== CALCULS STATIQUES ====================

/**
 * Calcule les KPIs du dashboard
 */
export const calculateKPIs = (): DashboardKPIs => {
  const totalPatients = mockPatients.length;
  const avgCaloriesBurned = Math.round(
    mockSportSessions.reduce((sum, s) => sum + s.caloriesBurned, 0) /
      mockSportSessions.length,
  );
  const avgSessionDuration = Math.round(
    mockSportSessions.reduce((sum, s) => sum + s.duration, 0) /
      mockSportSessions.length,
  );
  const healthAlerts = mockPatients.filter(
    (p) => p.riskDisease !== "None",
  ).length;

  return {
    totalPatients,
    avgCaloriesBurned,
    avgSessionDuration,
    healthAlerts,
  };
};

/**
 * Calcule la distribution des sports
 */
export const getSportDistribution = (): SportDistribution[] => {
  const distribution: { [key: string]: number } = {};

  mockSportSessions.forEach((session) => {
    distribution[session.type] = (distribution[session.type] || 0) + 1;
  });

  return Object.entries(distribution).map(([type, sessions]) => ({
    type,
    sessions,
  }));
};

/**
 * Calcule les stats des patients
 */
export const calculatePatientStats = (): PatientStats => {
  const totalPatients = mockPatients.length;
  const patientsWithRisk = mockPatients.filter(
    (p) => p.riskDisease !== "None",
  ).length;
  const averageAge = Math.round(
    mockPatients.reduce((sum, p) => sum + p.age, 0) / totalPatients,
  );
  const averageWeight =
    Math.round(
      (mockPatients.reduce((sum, p) => sum + p.weight, 0) / totalPatients) * 10,
    ) / 10;

  return {
    totalPatients,
    patientsWithRisk,
    averageAge,
    averageWeight,
  };
};

/**
 * Calcule les stats sportives
 */
export const calculateSportStats = (): SportStats => {
  const totalSessions = mockSportSessions.length;
  const totalCalories = mockSportSessions.reduce(
    (sum, s) => sum + s.caloriesBurned,
    0,
  );
  const totalDuration = mockSportSessions.reduce(
    (sum, s) => sum + s.duration,
    0,
  );
  const averageDuration = Math.round(totalDuration / totalSessions);
  const averageCalories = Math.round(totalCalories / totalSessions);

  return {
    totalSessions,
    totalCalories,
    totalDuration,
    averageDuration,
    averageCalories,
  };
};

/**
 * Calcule la distribution des régimes
 */
export const getDietDistribution = (): DietDistribution[] => {
  const distribution: { [key: string]: number } = {};

  mockPatients.forEach((patient) => {
    distribution[patient.dietRecommendation] =
      (distribution[patient.dietRecommendation] || 0) + 1;
  });

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return Object.entries(distribution).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));
};

/**
 * Calcule les stats nutrition
 */
export const calculateNutritionStats = (): NutritionStats => {
  const uniqueDiets = new Set(mockPatients.map((p) => p.dietRecommendation))
    .size;

  return {
    totalDietTypes: uniqueDiets,
    activePlans: mockPatients.length,
    averageCaloriesPerDay: 2200,
    availableRecipes: 24,
  };
};
