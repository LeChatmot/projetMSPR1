import { useCallback, useEffect, useState } from "react";
import { nutritionService } from "../services/nutritionService";
import type { DietRecommendation } from "../types";

const PER_PAGE = 50;

interface UseAdminPatientsReturn {
  patients: DietRecommendation[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
}

export function useAdminPatients(): UseAdminPatientsReturn {
  const [patients, setPatients] = useState<DietRecommendation[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await nutritionService.getAdminPatients(targetPage, PER_PAGE);
      setPatients(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
      setPage(targetPage);
    } catch {
      setError("Impossible de charger les patients.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPage(1);
  }, [fetchPage]);

  const handleSetPage = useCallback(
    (newPage: number) => { void fetchPage(newPage); },
    [fetchPage],
  );

  return { patients, total, page, totalPages, loading, error, setPage: handleSetPage };
}
