// Fitness calculations for calorie planning

export type Goal = 'lose' | 'maintain' | 'gain';

export interface CaloriePlan {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  protein: number;
  goal: Goal;
}

// Mifflin-St Jeor BMR formula
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  isMale: boolean
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return isMale ? base + 5 : base - 161;
}

// Activity multipliers
const ACTIVITY_MULTIPLIERS = {
  1: 1.2,   // Sedentary
  2: 1.375, // Lightly active
  3: 1.55,  // Moderately active
  4: 1.725, // Very active
  5: 1.9,   // Extra active
} as const;

export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  isMale: boolean,
  activityLevel: 1 | 2 | 3 | 4 | 5
): number {
  const bmr = calculateBMR(weightKg, heightCm, age, isMale);
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateDailyCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  isMale: boolean,
  activityLevel: 1 | 2 | 3 | 4 | 5,
  goal: Goal
): number {
  const tdee = calculateTDEE(weightKg, heightCm, age, isMale, activityLevel);

  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500); // ~0.5kg/week deficit
    case 'gain':
      return Math.round(tdee + 300); // Lean bulk
    default:
      return tdee;
  }
}

export function calculateProteinTarget(weightKg: number, goal: Goal): number {
  switch (goal) {
    case 'lose':
      return Math.round(weightKg * 2.2); // Higher protein for cutting
    case 'gain':
      return Math.round(weightKg * 1.8);
    default:
      return Math.round(weightKg * 1.6);
  }
}

export function calculatePlan(
  weightKg: number,
  heightCm: number,
  age: number,
  isMale: boolean,
  activityLevel: 1 | 2 | 3 | 4 | 5,
  goal: Goal
): CaloriePlan {
  return {
    bmr: Math.round(calculateBMR(weightKg, heightCm, age, isMale)),
    tdee: calculateTDEE(weightKg, heightCm, age, isMale, activityLevel),
    dailyCalories: calculateDailyCalories(weightKg, heightCm, age, isMale, activityLevel, goal),
    protein: calculateProteinTarget(weightKg, goal),
    goal,
  };
}
