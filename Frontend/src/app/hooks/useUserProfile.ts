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
  id: string;
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
}

// Génère des données cohérentes basées sur le hash de l'email de l'utilisateur
// → même utilisateur = mêmes données à chaque connexion
function hashEmail(email: string): number {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

const SPORT_TYPES = ["Cardio", "Strength", "Yoga", "HIIT"];
const DIET_PLANS = ["Balanced", "Low_Carb", "Low_Sodium", "High_Protein"];
const ACTIVITY_LEVELS = ["Sédentaire", "Modéré", "Actif", "Très actif"];
const RISK_DISEASES = ["None", "None", "None", "Hypertension", "Obesity"];

export function useUserProfile(user: AuthUser | null): UserProfileData {
  if (!user) {
    return buildProfile(0);
  }
  return buildProfile(hashEmail(user.email));
}

function buildProfile(seed: number): UserProfileData {
  const pick = <T>(arr: T[], offset: number): T =>
    arr[(seed + offset) % arr.length];

  const weightKg = 60 + (seed % 40);
  const heightCm = 160 + (seed % 30);
  const bmi = parseFloat((weightKg / (heightCm / 100) ** 2).toFixed(1));
  const age = 22 + (seed % 38);

  const profile: PersonalHealthProfile = {
    weightKg,
    heightCm,
    bmi,
    age,
    dietPlan: pick(DIET_PLANS, 0),
    riskDisease: pick(RISK_DISEASES, 1),
    activityLevel: pick(ACTIVITY_LEVELS, 2),
  };

  const recentSessions: PersonalSession[] = Array.from(
    { length: 6 },
    (_, i) => {
      const daysAgo = i * 2 + (seed % 3);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const type = pick(SPORT_TYPES, i);
      const calories = 280 + ((seed + i * 37) % 320);
      const duration = 30 + ((seed + i * 13) % 60);
      return {
        id: `ps_${seed}_${i}`,
        date: date.toISOString().split("T")[0],
        type,
        durationMin: duration,
        caloriesBurned: calories,
      };
    },
  );

  const totalCalories = recentSessions.reduce(
    (s, r) => s + r.caloriesBurned,
    0,
  );
  const totalMinutes = recentSessions.reduce((s, r) => s + r.durationMin, 0);

  const sportStats: PersonalSportStats = {
    totalSessionsThisMonth: recentSessions.length,
    totalCaloriesThisMonth: totalCalories,
    totalMinutesThisMonth: totalMinutes,
    averageCaloriesPerSession: Math.round(
      totalCalories / recentSessions.length,
    ),
    favoriteType: pick(SPORT_TYPES, 3),
  };

  return { profile, recentSessions, sportStats };
}
