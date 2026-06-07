import { useCallback, useEffect, useState } from "react";
import { nutritionService } from "../services/nutritionService";
import type { DietRecommendation, ReferenceData } from "../types";

const PER_PAGE = 50;

interface UseAdminNutritionReturn {
  recommendations: DietRecommendation[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refData: ReferenceData | null;
  setPage: (page: number) => void;
  createRecommendation: (data: Partial<DietRecommendation>) => Promise<void>;
  updateRecommendation: (id: number, data: Partial<DietRecommendation>) => Promise<void>;
  deleteRecommendation: (id: number) => Promise<void>;
}

export function useAdminNutrition(): UseAdminNutritionReturn {
  const [recommendations, setRecommendations] = useState<DietRecommendation[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refData, setRefData] = useState<ReferenceData | null>(null);

  const fetchPage = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await nutritionService.getAdminNutrition(targetPage, PER_PAGE);
      setRecommendations(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
      setPage(targetPage);
    } catch {
      setError("Impossible de charger les recommandations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPage(1);
    nutritionService.getReferenceData().then(setRefData).catch(() => {});
  }, [fetchPage]);

  const handleSetPage = useCallback(
    (newPage: number) => { void fetchPage(newPage); },
    [fetchPage],
  );

  const createRecommendation = useCallback(async (data: Partial<DietRecommendation>) => {
    const created = await nutritionService.createDietRecommendation(data);
    setRecommendations((prev) => [created, ...prev]);
    setTotal((t) => t + 1);
  }, []);

  const updateRecommendation = useCallback(async (id: number, data: Partial<DietRecommendation>) => {
    const updated = await nutritionService.updateDietRecommendation(id, data);
    setRecommendations((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }, []);

  const deleteRecommendation = useCallback(async (id: number) => {
    await nutritionService.deleteAdminNutrition(id);
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    setTotal((t) => t - 1);
  }, []);

  return {
    recommendations, total, page, totalPages, loading, error, refData,
    setPage: handleSetPage,
    createRecommendation, updateRecommendation, deleteRecommendation,
  };
}
