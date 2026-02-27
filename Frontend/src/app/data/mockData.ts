// Mock Data pour le Dashboard Admin de Santé/Fitness

export interface Patient {
  id: string;
  age: number;
  gender: 'M' | 'F';
  riskDisease: string;
  dietRecommendation: string;
  weight: number;
  importDate: string;
}

export interface SportSession {
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}

export interface WeightEvolution {
  month: string;
  averageWeight: number;
}

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    age: 45,
    gender: 'M',
    riskDisease: 'Hypertension',
    dietRecommendation: 'Low Carb',
    weight: 85.5,
    importDate: '2026-02-04'
  },
  {
    id: 'P002',
    age: 32,
    gender: 'F',
    riskDisease: 'None',
    dietRecommendation: 'Balanced',
    weight: 62.3,
    importDate: '2026-02-04'
  },
  {
    id: 'P003',
    age: 58,
    gender: 'M',
    riskDisease: 'Diabetes Type 2',
    dietRecommendation: 'Low Carb',
    weight: 92.1,
    importDate: '2026-02-03'
  },
  {
    id: 'P004',
    age: 27,
    gender: 'F',
    riskDisease: 'None',
    dietRecommendation: 'High Protein',
    weight: 58.7,
    importDate: '2026-02-03'
  },
  {
    id: 'P005',
    age: 71,
    gender: 'M',
    riskDisease: 'Hypertension',
    dietRecommendation: 'Mediterranean',
    weight: 78.9,
    importDate: '2026-02-02'
  },
  {
    id: 'P006',
    age: 39,
    gender: 'F',
    riskDisease: 'None',
    dietRecommendation: 'Balanced',
    weight: 65.2,
    importDate: '2026-02-02'
  },
  {
    id: 'P007',
    age: 52,
    gender: 'M',
    riskDisease: 'High Cholesterol',
    dietRecommendation: 'Low Fat',
    weight: 88.4,
    importDate: '2026-02-01'
  },
  {
    id: 'P008',
    age: 24,
    gender: 'F',
    riskDisease: 'None',
    dietRecommendation: 'Balanced',
    weight: 56.8,
    importDate: '2026-02-01'
  }
];

export const mockSportSessions: SportSession[] = [
  { type: 'Yoga', duration: 45, caloriesBurned: 180, date: '2026-02-04' },
  { type: 'HIIT', duration: 30, caloriesBurned: 350, date: '2026-02-04' },
  { type: 'Cardio', duration: 60, caloriesBurned: 420, date: '2026-02-03' },
  { type: 'Strength', duration: 50, caloriesBurned: 290, date: '2026-02-03' },
  { type: 'Yoga', duration: 60, caloriesBurned: 240, date: '2026-02-02' },
  { type: 'HIIT', duration: 35, caloriesBurned: 380, date: '2026-02-02' },
  { type: 'Cardio', duration: 45, caloriesBurned: 330, date: '2026-02-01' },
  { type: 'Strength', duration: 55, caloriesBurned: 310, date: '2026-02-01' },
  { type: 'Yoga', duration: 50, caloriesBurned: 200, date: '2026-01-31' },
  { type: 'Cardio', duration: 70, caloriesBurned: 490, date: '2026-01-31' },
  { type: 'HIIT', duration: 40, caloriesBurned: 400, date: '2026-01-30' },
  { type: 'Strength', duration: 60, caloriesBurned: 330, date: '2026-01-30' },
  { type: 'Yoga', duration: 55, caloriesBurned: 220, date: '2026-01-29' },
  { type: 'Cardio', duration: 50, caloriesBurned: 360, date: '2026-01-29' },
  { type: 'HIIT', duration: 32, caloriesBurned: 370, date: '2026-01-28' },
  { type: 'Strength', duration: 48, caloriesBurned: 280, date: '2026-01-28' },
  { type: 'Yoga', duration: 42, caloriesBurned: 170, date: '2026-01-27' },
  { type: 'Cardio', duration: 55, caloriesBurned: 390, date: '2026-01-27' }
];

export const mockWeightEvolution: WeightEvolution[] = [
  { month: 'Sept 2025', averageWeight: 74.2 },
  { month: 'Oct 2025', averageWeight: 73.8 },
  { month: 'Nov 2025', averageWeight: 72.5 },
  { month: 'Déc 2025', averageWeight: 71.9 },
  { month: 'Jan 2026', averageWeight: 71.2 },
  { month: 'Fév 2026', averageWeight: 70.5 }
];

export const calculateKPIs = () => {
  const totalPatients = mockPatients.length;
  const avgCaloriesBurned = Math.round(
    mockSportSessions.reduce((sum, s) => sum + s.caloriesBurned, 0) / mockSportSessions.length
  );
  const avgSessionDuration = Math.round(
    mockSportSessions.reduce((sum, s) => sum + s.duration, 0) / mockSportSessions.length
  );
  const healthAlerts = mockPatients.filter(p => p.riskDisease !== 'None').length;

  return {
    totalPatients,
    avgCaloriesBurned,
    avgSessionDuration,
    healthAlerts
  };
};

export const getSportDistribution = () => {
  const distribution: { [key: string]: number } = {};
  
  mockSportSessions.forEach(session => {
    distribution[session.type] = (distribution[session.type] || 0) + 1;
  });

  return Object.entries(distribution).map(([type, count]) => ({
    type,
    sessions: count
  }));
};
