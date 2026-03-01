/**
 * Export centralisé de tous les hooks
 * Facilite les imports dans les composants
 */

export { useDashboard, useDashboardKPIs } from "./useDashboard";
export {
  useDietDistribution,
  useNutrition,
  useNutritionStats,
} from "./useNutrition";
export { usePatients, usePatientsList, usePatientStats } from "./usePatients";
export { useRecentSessions, useSport, useSportStats } from "./useSport";
