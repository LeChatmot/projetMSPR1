import { useEffect, useState } from "react";
import { sportService } from "../services/sportService";
import type { AuthUser } from "../types";

export interface PersonalHealthProfile {
  weightKg: number;
  heightCm: number;
  bmi: number;
  age: number;
  dietPlan: string;
  riskDisease: string;
  activityLevel: string;
}

export interface PersonalSession {
  id: number;
  date: string;
  type: string;
  durationMin: number;
  caloriesBurned: number;
}

export interface PersonalSportStats {
  totalSessionsThisMonth: number;
  totalCaloriesThisMonth: number;
  totalMinutesThisMonth: number;
  averageCaloriesPerSession: number;
  favoriteType: string;
}

export interface UserProfileData {
  profile: PersonalHealthProfile;
  recentSessions: PersonalSession[];
  sportStats: PersonalSportStats;
  loading: boolean;
  refresh: () => void;
}

const EMPTY_PROFILE: PersonalHealthProfile = {
  weightKg: 0, heightCm: 0, bmi: 0, age: 0,
  dietPlan: "—", riskDisease: "—", activityLevel: "—",
};

function buildStatsFromSessions(sessions: PersonalSession[]): PersonalSportStats {
  const now = new Date();
  const thisMonthSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  if (thisMonthSessions.length === 0) {
    return { totalSessionsThisMonth: 0, totalCaloriesThisMonth: 0,
             totalMinutesThisMonth: 0, averageCaloriesPerSession: 0, favoriteType: "—" };
  }

  const totalCalories = thisMonthSessions.reduce((s, r) => s + r.caloriesBurned, 0);
  const totalMinutes = thisMonthSessions.reduce((s, r) => s + r.durationMin, 0);

  const typeCounts = thisMonthSessions.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const favoriteType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0];

  return {
    totalSessionsThisMonth: thisMonthSessions.length,
    totalCaloriesThisMonth: totalCalories,
    totalMinutesThisMonth: totalMinutes,
    averageCaloriesPerSession: Math.round(totalCalories / thisMonthSessions.length),
    favoriteType,
  };
}

export function useUserProfile(user: AuthUser | null): UserProfileData {
  const [recentSessions, setRecentSessions] = useState<PersonalSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    if (!user?.backendId) return;
    setLoading(true);
    try {
      const raw = await sportService.getUserSessions(user.backendId);
      setRecentSessions(
        raw.map((s) => ({
          id: s.id,
          date: s.session_date,
          type: s.workout_type,
          durationMin: s.duration_min,
          caloriesBurned: s.calories_burned,
        })),
      );
    } catch {
      setRecentSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSessions();
  }, [user?.backendId]);

  return {
    profile: EMPTY_PROFILE,
    recentSessions,
    sportStats: buildStatsFromSessions(recentSessions),
    loading,
    refresh: fetchSessions,
  };
}
