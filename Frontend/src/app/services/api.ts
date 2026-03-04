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

// État de la connexion backend
let backendAvailable: boolean | null = null;

/**
 * Vérifie si le backend est disponible
 */
async function checkBackendHealth(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_CONFIG.baseURL}/health`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    backendAvailable = response.ok;
    return backendAvailable;
  } catch (error) {
    console.warn("⚠️ Backend non disponible, mode mock activé");
    backendAvailable = false;
    return false;
  }
}

/**
 * Effectue un appel API avec gestion des erreurs et fallback mock
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback?: () => Promise<T>,
): Promise<T> {
  const isBackendUp = await checkBackendHealth();

  // Si backend disponible, faire l'appel réel
  if (isBackendUp) {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<T> = await response.json();
      return result.data;
    } catch (error) {
      console.error(`❌ Erreur API ${endpoint}:`, error);

      // Si fallback mock disponible, l'utiliser
      if (mockFallback) {
        console.warn("🔄 Fallback vers mock data");
        return mockFallback();
      }
      throw error;
    }
  }

  // Mode mock : utiliser le fallback
  if (mockFallback) {
    return mockFallback();
  }

  throw new Error(`Aucune donnée disponible pour ${endpoint}`);
}

/**
 * Réinitialise l'état du backend (utile pour les tests)
 */
export function resetBackendCheck(): void {
  backendAvailable = null;
}

/**
 * Force le mode mock (utile pour le développement)
 */
export function forceMockMode(): void {
  backendAvailable = false;
}

/**
 * Force le mode API (utile pour tester le backend)
 */
export function forceApiMode(): void {
  backendAvailable = true;
}
