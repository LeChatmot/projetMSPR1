/**
 * Export centralisé de tous les services
 * Facilite les imports dans les composants
 */

export { apiCall, forceApiMode, forceMockMode, resetBackendCheck } from "./api";
export * from "./nutritionService";
export * from "./patientService";
export * from "./sportService";
