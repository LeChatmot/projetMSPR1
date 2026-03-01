/**
 * Types centralisés pour l'application
 * Définissent les contrats de données entre frontend et backend
 */

// ==================== PATIENTS ====================
export interface Patient {
  id: string;
  age: number;
  gender: "M" | "F";
  riskDisease: string;
  dietRecommendation: string;
  weight: number;
  importDate: string;
}

export interface PatientStats {
  totalPatients: number;
  patientsWithRisk: number;
  averageAge: number;
  averageWeight: number;
}

// ==================== SPORT ====================
export interface SportSession {
  id?: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}

export interface SportStats {
  totalSessions: number;
  totalCalories: number;
  totalDuration: number;
  averageDuration: number;
  averageCalories: number;
}

export interface SportDistribution {
  type: string;
  sessions: number;
}

export interface SportTypeInfo {
  type: string;
  name: string;
  description: string;
  intensity: "Faible" | "Modérée" | "Haute" | "Très Haute";
  icon: string;
  color: string;
}

// ==================== NUTRITION ====================
export interface DietDistribution {
  name: string;
  value: number;
  color: string;
}

export interface NutritionStats {
  totalDietTypes: number;
  activePlans: number;
  averageCaloriesPerDay: number;
  availableRecipes: number;
}

export interface DietPlan {
  name: string;
  description: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  icon: string;
  color: string;
}

// ==================== DASHBOARD ====================
export interface DashboardKPIs {
  totalPatients: number;
  avgCaloriesBurned: number;
  avgSessionDuration: number;
  healthAlerts: number;
}

export interface WeightEvolution {
  month: string;
  averageWeight: number;
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  timestamp: string;
}
