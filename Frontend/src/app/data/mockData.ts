/**
 * Mock Data - Données de test pour le développement
 * Ces données sont utilisées en fallback si le backend n'est pas disponible
 */

import type {
  DashboardKPIs,
  DietDistribution,
  DietPlan,
  DietRecommendation,
  NutritionStats,
  PaginatedResponse,
  Patient,
  PatientStats,
  ReferenceData,
  SportDistribution,
  SportSession,
  SportStats,
  WeightEvolution,
} from "../types";

// ==================== REFERENCE DATA (lookups) ====================

export const mockReferenceData: ReferenceData = {
  genders:               [{ id: 1, name: "Homme" }, { id: 2, name: "Femme" }],
  disease_types:         [{ id: 1, name: "Hypertension" }, { id: 2, name: "Diabète Type 2" }, { id: 3, name: "Obésité" }, { id: 4, name: "Aucune" }],
  severity_types:        [{ id: 1, name: "Légère" }, { id: 2, name: "Modérée" }, { id: 3, name: "Sévère" }],
  diet_types:            [{ id: 1, name: "Low Carb" }, { id: 2, name: "Balanced" }, { id: 3, name: "Mediterranean" }, { id: 4, name: "High Protein" }, { id: 5, name: "Low Fat" }],
  activity_levels:       [{ id: 1, name: "Sédentaire" }, { id: 2, name: "Légèrement actif" }, { id: 3, name: "Modérément actif" }, { id: 4, name: "Très actif" }],
  dietary_restrictions:  [{ id: 1, name: "Végétarien" }, { id: 2, name: "Végétalien" }, { id: 3, name: "Sans gluten" }, { id: 4, name: "Aucune" }],
  allergies:             [{ id: 1, name: "Arachides" }, { id: 2, name: "Lactose" }, { id: 3, name: "Gluten" }, { id: 4, name: "Aucune" }],
  cuisine_types:         [{ id: 1, name: "Méditerranéenne" }, { id: 2, name: "Asiatique" }, { id: 3, name: "Française" }, { id: 4, name: "Végétarienne" }],
};

// ==================== DIET RECOMMENDATIONS (admin) ====================

export const mockDietRecommendations: DietRecommendation[] = [
  {
    id: 1, age: 45, gender: 1, height_cm: 178, current_weight_kg: 89.5, bmi: 28.3,
    disease_type: 1, severity: 2, diet_recommendation: 1, daily_caloric_target: 1800,
    activity_level: 2, cholesterol_mg: 210, blood_pressure_mmhg: 135, glucose_mg_dl: 98,
    dietary_restrictions: 4, allergy: 4, preferred_cuisine: 3, weekly_exercise_hours: 3.5,
    adherence_to_diet_plan: 0.72, dietary_nutrient_imbalance_score: 1.4,
    created_at: "2026-01-15",
    gender_name: "Homme", disease_name: "Hypertension", severity_name: "Modérée",
    allergy_name: "Aucune", diet_name: "Low Carb", activity_name: "Légèrement actif",
    restriction_name: "Aucune", cuisine_name: "Française",
  },
  {
    id: 2, age: 32, gender: 2, height_cm: 165, current_weight_kg: 61.2, bmi: 22.5,
    disease_type: 4, severity: 1, diet_recommendation: 2, daily_caloric_target: 2100,
    activity_level: 3, cholesterol_mg: 175, blood_pressure_mmhg: 118, glucose_mg_dl: 88,
    dietary_restrictions: 1, allergy: 2, preferred_cuisine: 4, weekly_exercise_hours: 5,
    adherence_to_diet_plan: 0.91, dietary_nutrient_imbalance_score: 0.6,
    created_at: "2026-01-18",
    gender_name: "Femme", disease_name: "Aucune", severity_name: "Légère",
    allergy_name: "Lactose", diet_name: "Balanced", activity_name: "Modérément actif",
    restriction_name: "Végétarien", cuisine_name: "Végétarienne",
  },
  {
    id: 3, age: 58, gender: 1, height_cm: 172, current_weight_kg: 94, bmi: 31.8,
    disease_type: 2, severity: 3, diet_recommendation: 1, daily_caloric_target: 1600,
    activity_level: 1, cholesterol_mg: 245, blood_pressure_mmhg: 145, glucose_mg_dl: 142,
    dietary_restrictions: 3, allergy: 3, preferred_cuisine: 1, weekly_exercise_hours: 1.5,
    adherence_to_diet_plan: 0.55, dietary_nutrient_imbalance_score: 2.1,
    created_at: "2026-01-20",
    gender_name: "Homme", disease_name: "Diabète Type 2", severity_name: "Sévère",
    allergy_name: "Gluten", diet_name: "Low Carb", activity_name: "Sédentaire",
    restriction_name: "Sans gluten", cuisine_name: "Méditerranéenne",
  },
  {
    id: 4, age: 27, gender: 2, height_cm: 160, current_weight_kg: 55.8, bmi: 21.8,
    disease_type: 4, severity: 1, diet_recommendation: 4, daily_caloric_target: 2300,
    activity_level: 4, cholesterol_mg: 160, blood_pressure_mmhg: 112, glucose_mg_dl: 82,
    dietary_restrictions: 4, allergy: 4, preferred_cuisine: 2, weekly_exercise_hours: 7,
    adherence_to_diet_plan: 0.88, dietary_nutrient_imbalance_score: 0.4,
    created_at: "2026-01-22",
    gender_name: "Femme", disease_name: "Aucune", severity_name: "Légère",
    allergy_name: "Aucune", diet_name: "High Protein", activity_name: "Très actif",
    restriction_name: "Aucune", cuisine_name: "Asiatique",
  },
  {
    id: 5, age: 63, gender: 1, height_cm: 175, current_weight_kg: 82.3, bmi: 26.9,
    disease_type: 1, severity: 2, diet_recommendation: 3, daily_caloric_target: 1900,
    activity_level: 2, cholesterol_mg: 228, blood_pressure_mmhg: 138, glucose_mg_dl: 104,
    dietary_restrictions: 4, allergy: 1, preferred_cuisine: 1, weekly_exercise_hours: 2.5,
    adherence_to_diet_plan: 0.68, dietary_nutrient_imbalance_score: 1.2,
    created_at: "2026-02-01",
    gender_name: "Homme", disease_name: "Hypertension", severity_name: "Modérée",
    allergy_name: "Arachides", diet_name: "Mediterranean", activity_name: "Légèrement actif",
    restriction_name: "Aucune", cuisine_name: "Méditerranéenne",
  },
  {
    id: 6, age: 41, gender: 2, height_cm: 168, current_weight_kg: 74.1, bmi: 26.3,
    disease_type: 3, severity: 2, diet_recommendation: 5, daily_caloric_target: 1700,
    activity_level: 2, cholesterol_mg: 198, blood_pressure_mmhg: 128, glucose_mg_dl: 95,
    dietary_restrictions: 2, allergy: 4, preferred_cuisine: 4, weekly_exercise_hours: 3,
    adherence_to_diet_plan: 0.62, dietary_nutrient_imbalance_score: 1.7,
    created_at: "2026-02-05",
    gender_name: "Femme", disease_name: "Obésité", severity_name: "Modérée",
    allergy_name: "Aucune", diet_name: "Low Fat", activity_name: "Légèrement actif",
    restriction_name: "Végétalien", cuisine_name: "Végétarienne",
  },
];

export const buildMockPaginatedResponse = <T>(
  items: T[],
  page: number,
  perPage: number,
): PaginatedResponse<T> => {
  const total = items.length;
  const start = (page - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);
  return {
    items: pageItems,
    total,
    page,
    per_page: perPage,
    total_pages: Math.max(1, Math.ceil(total / perPage)),
  };
};

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
    id: 1,
    targetAudience: "Perte de poids",
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
    id: 2,
    targetAudience: "Tous publics",
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
    id: 3,
    targetAudience: "Santé cardiovasculaire",
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
