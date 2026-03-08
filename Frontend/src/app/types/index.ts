/**
 * Ce fichier centralise toutes les interfaces TypeScript du projet.
 */

// --- API Standard ---
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  timestamp: string;
}

// --- Dashboard ---
export interface DashboardKPIs {
  totalPatients: number;
  avgCaloriesBurned: number;
  avgSessionDuration: number;
  healthAlerts: number;
}

export interface SportDistribution {
  type: string;
  sessions: number;
}

export interface WeightEvolution {
  month: string;
  averageWeight: number;
}

// --- Admin & Nutrition ---
export interface DietRecommendation {
  id: number;
  age: number;
  gender: number;
  height_cm: number;
  current_weight_kg: number;
  bmi: number;
  disease_type: number;
  severity: number;
  diet_recommendation: number;
  daily_caloric_target: number;
  activity_level: number;
  created_at: string;
  cholesterol_mg: number;
  blood_pressure_mmhg: number;
  glucose_mg_dl: number;
  dietary_restrictions: number;
  allergy: number;
  preferred_cuisine: number;
  weekly_exercise_hours: number;
  adherence_to_diet_plan: number;
  dietary_nutrient_imbalance_score: number;
  // Champs joints pour l'affichage
  gender_name: string;
  disease_name: string;
  allergy_name: string;
  diet_name: string;
}

export interface DietPlan {
  id: number;
  name: string;
  description: string;
  targetAudience: string;
  meals?: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  icon?: string;
  color?: string;
}

export interface NutritionStats {
  totalDietTypes: number;
  activePlans: number;
  averageCaloriesPerDay: number;
  availableRecipes: number;
}

// --- Patients ---
export interface Patient {
  id: string;
  name?: string;
  age: number;
  gender: "Homme" | "Femme" | "Autre" | "M" | "F";
  weight: number; // in kg
  height?: number; // in cm
  riskDisease?: string; // Maladie/risque (ex: "None", "Hypertension", "Diabetes")
  dietRecommendation?: string; // Régime recommandé
  importDate?: string; // Date d'import optionnelle
}

export interface PatientStats {
  totalPatients: number;
  patientsWithRisk: number;
  averageAge: number;
  averageWeight: number;
}

// --- Nutrition (Dashboard) ---
export interface DietDistribution {
  name: string;
  value: number;
  color: string;
}

// --- Sport ---
export interface SportSession {
  id?: string;
  date: string;
  type: string;
  duration: number; // in minutes
  caloriesBurned: number;
}

export interface SportStats {
  totalSessions: number;
  totalCalories: number;
  totalDuration: number;
  averageDuration: number;
  averageCalories: number;
}
