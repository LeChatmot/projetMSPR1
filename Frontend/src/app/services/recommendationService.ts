export interface ExerciseRecommendation {
  exercice: string;
  score: number;
}

export interface RecommendationResult {
  user_id: number;
  objectif: string;
  recommendations: ExerciseRecommendation[];
}

export const recommendationService = {
  async getRecommendations(userId: number): Promise<ExerciseRecommendation[]> {
    try {
      const response = await fetch(`/api/recommendations/${userId}`);
      const json = (await response.json()) as { success: boolean; data: RecommendationResult };
      return json.success ? json.data.recommendations : [];
    } catch {
      return [];
    }
  },
};
