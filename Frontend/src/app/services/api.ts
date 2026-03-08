/**
 * Service API de base
 * Gère la configuration HTTP et le fallback vers les mocks
 */

import type { ApiResponse } from "../types";

// Configuration de l'API
const API_CONFIG = {
  baseURL: "http://localhost:5000/api", // URL du backend Flask
  timeout: 5000,
  retries: 1,
};

/**
 * Effectue un appel API avec gestion des erreurs et fallback mock
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback?: () => Promise<T>,
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();
    if (!result.success) {
      throw new Error(result.message || "L'API a retourné une erreur");
    }
    return result.data;
  } catch (error) {
    console.error(`❌ Erreur API sur ${endpoint}:`, error);

    if (mockFallback) {
      console.warn(`🔄 Fallback vers les données mock pour ${endpoint}`);
      return mockFallback();
    }

    // Si pas de fallback, on relance l'erreur pour que le hook puisse l'afficher
    throw error;
  }
}
