// Workout planner — ported from native Kotlin app

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';
export type WorkoutStyle = 'strength' | 'full_body' | 'push_pull_legs' | 'upper_lower' | 'hiit';
export type Equipment = 'home' | 'gym';

export interface Exercise {
  name: string;
  muscleGroup: MuscleGroup;
  homeSafe: boolean;
  sets: number;
  reps: number;
  durationSec: number;
  caloriesPerMin: number;
}

export interface PlannedExercise {
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  durationSec: number;
  caloriesBurned: number;
}

export interface WorkoutDay {
  dayNumber: number;
  week: number;
  splitLabel: string;
  exercises: PlannedExercise[];
  estimatedCalories: number;
}

export interface WorkoutPlan {
  style: WorkoutStyle;
  daysPerWeek: number;
  equipment: Equipment;
  goal: string;
  days: WorkoutDay[];
}

// Exercise catalog
const CHEST: Exercise[] = [
  { name: 'Push-Ups', muscleGroup: 'chest', homeSafe: true, sets: 3, reps: 15, durationSec: 0, caloriesPerMin: 9 },
  { name: 'Incline Push-Ups', muscleGroup: 'chest', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 8 },
  { name: 'Diamond Push-Ups', muscleGroup: 'chest', homeSafe: true, sets: 3, reps: 10, durationSec: 0, caloriesPerMin: 10 },
  { name: 'Bench Press', muscleGroup: 'chest', homeSafe: false, sets: 4, reps: 8, durationSec: 0, caloriesPerMin: 7 },
  { name: 'Incline Dumbbell Press', muscleGroup: 'chest', homeSafe: false, sets: 3, reps: 10, durationSec: 0, caloriesPerMin: 7 },
  { name: 'Dumbbell Fly', muscleGroup: 'chest', homeSafe: false, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 6 },
];

const BACK: Exercise[] = [
  { name: 'Bodyweight Row', muscleGroup: 'back', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 7 },
  { name: 'Superman Hold', muscleGroup: 'back', homeSafe: true, sets: 3, reps: 0, durationSec: 30, caloriesPerMin: 5 },
  { name: 'Pull-Ups', muscleGroup: 'back', homeSafe: true, sets: 3, reps: 8, durationSec: 0, caloriesPerMin: 10 },
  { name: 'Lat Pulldown', muscleGroup: 'back', homeSafe: false, sets: 3, reps: 10, durationSec: 0, caloriesPerMin: 7 },
  { name: 'Barbell Row', muscleGroup: 'back', homeSafe: false, sets: 4, reps: 8, durationSec: 0, caloriesPerMin: 8 },
  { name: 'Dumbbell Row', muscleGroup: 'back', homeSafe: false, sets: 3, reps: 10, durationSec: 0, caloriesPerMin: 7 },
];

const SHOULDERS: Exercise[] = [
  { name: 'Pike Push-Ups', muscleGroup: 'shoulders', homeSafe: true, sets: 3, reps: 10, durationSec: 0, caloriesPerMin: 9 },
  { name: 'Lateral Raises', muscleGroup: 'shoulders', homeSafe: true, sets: 3, reps: 15, durationSec: 0, caloriesPerMin: 6 },
  { name: 'Arm Circles', muscleGroup: 'shoulders', homeSafe: true, sets: 3, reps: 0, durationSec: 30, caloriesPerMin: 5 },
  { name: 'Overhead Press', muscleGroup: 'shoulders', homeSafe: false, sets: 4, reps: 8, durationSec: 0, caloriesPerMin: 7 },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', homeSafe: false, sets: 3, reps: 10, durationSec: 0, caloriesPerMin: 7 },
];

const ARMS: Exercise[] = [
  { name: 'Chair Dips', muscleGroup: 'arms', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 8 },
  { name: 'Bicep Curls', muscleGroup: 'arms', homeSafe: true, sets: 3, reps: 15, durationSec: 0, caloriesPerMin: 5 },
  { name: 'Overhead Tricep Extensions', muscleGroup: 'arms', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 5 },
  { name: 'Barbell Curl', muscleGroup: 'arms', homeSafe: false, sets: 3, reps: 10, durationSec: 0, caloriesPerMin: 5 },
  { name: 'Tricep Pushdown', muscleGroup: 'arms', homeSafe: false, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 5 },
];

const LEGS: Exercise[] = [
  { name: 'Bodyweight Squats', muscleGroup: 'legs', homeSafe: true, sets: 3, reps: 20, durationSec: 0, caloriesPerMin: 10 },
  { name: 'Forward Lunges', muscleGroup: 'legs', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 9 },
  { name: 'Calf Raises', muscleGroup: 'legs', homeSafe: true, sets: 3, reps: 25, durationSec: 0, caloriesPerMin: 6 },
  { name: 'Glute Bridges', muscleGroup: 'legs', homeSafe: true, sets: 3, reps: 20, durationSec: 0, caloriesPerMin: 6 },
  { name: 'Wall Sits', muscleGroup: 'legs', homeSafe: true, sets: 3, reps: 0, durationSec: 45, caloriesPerMin: 7 },
  { name: 'Jump Squats', muscleGroup: 'legs', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 14 },
  { name: 'Side Lunges', muscleGroup: 'legs', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 9 },
  { name: 'Sumo Squats', muscleGroup: 'legs', homeSafe: true, sets: 3, reps: 15, durationSec: 0, caloriesPerMin: 10 },
  { name: 'Barbell Squat', muscleGroup: 'legs', homeSafe: false, sets: 4, reps: 8, durationSec: 0, caloriesPerMin: 9 },
  { name: 'Romanian Deadlift', muscleGroup: 'legs', homeSafe: false, sets: 3, reps: 10, durationSec: 0, caloriesPerMin: 8 },
  { name: 'Leg Press', muscleGroup: 'legs', homeSafe: false, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 8 },
  { name: 'Leg Curls', muscleGroup: 'legs', homeSafe: false, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 6 },
];

const CORE: Exercise[] = [
  { name: 'Crunches', muscleGroup: 'core', homeSafe: true, sets: 3, reps: 20, durationSec: 0, caloriesPerMin: 6 },
  { name: 'Plank', muscleGroup: 'core', homeSafe: true, sets: 3, reps: 0, durationSec: 45, caloriesPerMin: 6 },
  { name: 'Leg Raises', muscleGroup: 'core', homeSafe: true, sets: 3, reps: 15, durationSec: 0, caloriesPerMin: 7 },
  { name: 'Russian Twists', muscleGroup: 'core', homeSafe: true, sets: 3, reps: 20, durationSec: 0, caloriesPerMin: 8 },
  { name: 'Mountain Climbers', muscleGroup: 'core', homeSafe: true, sets: 3, reps: 20, durationSec: 0, caloriesPerMin: 12 },
  { name: 'Bicycle Crunches', muscleGroup: 'core', homeSafe: true, sets: 3, reps: 20, durationSec: 0, caloriesPerMin: 8 },
  { name: 'Flutter Kicks', muscleGroup: 'core', homeSafe: true, sets: 3, reps: 0, durationSec: 40, caloriesPerMin: 8 },
  { name: 'V-Ups', muscleGroup: 'core', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 9 },
];

const CARDIO: Exercise[] = [
  { name: 'Jumping Jacks', muscleGroup: 'cardio', homeSafe: true, sets: 3, reps: 0, durationSec: 60, caloriesPerMin: 11 },
  { name: 'High Knees', muscleGroup: 'cardio', homeSafe: true, sets: 3, reps: 0, durationSec: 45, caloriesPerMin: 12 },
  { name: 'Burpees', muscleGroup: 'cardio', homeSafe: true, sets: 3, reps: 12, durationSec: 0, caloriesPerMin: 14 },
  { name: 'Jump Rope', muscleGroup: 'cardio', homeSafe: true, sets: 3, reps: 0, durationSec: 60, caloriesPerMin: 12 },
  { name: 'Treadmill Run', muscleGroup: 'cardio', homeSafe: false, sets: 1, reps: 0, durationSec: 1200, caloriesPerMin: 12 },
  { name: 'Stationary Bike', muscleGroup: 'cardio', homeSafe: false, sets: 1, reps: 0, durationSec: 1200, caloriesPerMin: 9 },
  { name: 'Rowing Machine', muscleGroup: 'cardio', homeSafe: false, sets: 1, reps: 0, durationSec: 900, caloriesPerMin: 10 },
];

const LIBRARY: Record<MuscleGroup, Exercise[]> = {
  chest: CHEST,
  back: BACK,
  shoulders: SHOULDERS,
  arms: ARMS,
  legs: LEGS,
  core: CORE,
  cardio: CARDIO,
};

const STYLE_LABELS: Record<WorkoutStyle, string> = {
  strength: 'Strength',
  full_body: 'Full Body',
  push_pull_legs: 'Push/Pull/Legs',
  upper_lower: 'Upper/Lower',
  hiit: 'HIIT + Cardio',
};

const STYLE_LABELS_SHORT: Record<WorkoutStyle, string> = {
  strength: 'STR',
  full_body: 'FB',
  push_pull_legs: 'PPL',
  upper_lower: 'UL',
  hiit: 'HIIT',
};

export { STYLE_LABELS, STYLE_LABELS_SHORT };

function pick(group: MuscleGroup, equipment: Equipment, count: number): Exercise[] {
  const pool = LIBRARY[group].filter(e => e.homeSafe || equipment === 'gym');
  return pool.slice(0, count);
}

function getDayConfig(dayNum: number, style: WorkoutStyle): { label: string; focus: MuscleGroup[] } {
  switch (style) {
    case 'full_body':
      return { label: 'Full Body', focus: ['legs', 'chest', 'back', 'core'] };
    case 'strength':
      return { label: 'Strength', focus: ['legs', 'chest', 'back', 'shoulders', 'core'] };
    case 'push_pull_legs': {
      const cycle = ['Push', 'Pull', 'Legs', 'Full Body', 'Push', 'Pull'];
      const label = cycle[(dayNum - 1) % 6];
      const focus: MuscleGroup[] = label === 'Push'
        ? ['chest', 'shoulders', 'arms', 'core']
        : label === 'Pull'
        ? ['back', 'arms', 'core']
        : label === 'Legs'
        ? ['legs', 'core']
        : ['legs', 'chest', 'back', 'core'];
      return { label, focus };
    }
    case 'upper_lower': {
      const label = dayNum % 2 === 1 ? 'Upper' : 'Lower';
      const focus: MuscleGroup[] = label === 'Upper'
        ? ['chest', 'back', 'shoulders', 'arms']
        : ['legs', 'core'];
      return { label, focus };
    }
    case 'hiit': {
      const focus: MuscleGroup[] = dayNum % 2 === 1
        ? ['cardio', 'core', 'legs']
        : ['cardio', 'arms', 'core'];
      return { label: 'HIIT', focus };
    }
  }
}

function getCounts(style: WorkoutStyle): Partial<Record<MuscleGroup, number>> {
  switch (style) {
    case 'hiit':
      return { cardio: 3, core: 2, legs: 1, arms: 1 };
    case 'strength':
      return { legs: 2, chest: 1, back: 1, shoulders: 1, core: 1 };
    case 'push_pull_legs':
      return { chest: 3, shoulders: 2, back: 3, arms: 2, legs: 4, core: 1 };
    case 'upper_lower':
      return { chest: 2, back: 2, shoulders: 2, arms: 2, legs: 4, core: 1 };
    default:
      return { legs: 2, chest: 2, back: 2, shoulders: 1, arms: 1, core: 1 };
  }
}

function toPlanned(ex: Exercise, style: WorkoutStyle): PlannedExercise {
  const sets = style === 'strength' ? 5 : ex.sets;
  const reps = style === 'strength' && ex.reps > 0 ? 5 : ex.reps;
  const duration = ex.durationSec;
  const workMin = ex.durationSec > 0 ? ex.durationSec / 60 : sets * 0.75;
  const cal = ex.caloriesPerMin * workMin * (style === 'strength' && ex.reps > 0 ? 0.8 : 1);
  return {
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    sets,
    reps,
    durationSec: duration,
    caloriesBurned: Math.round(cal * 10) / 10,
  };
}

function buildDay(dayNum: number, daysPerWeek: number, style: WorkoutStyle, equipment: Equipment): WorkoutDay {
  const { label, focus } = getDayConfig(dayNum, style);
  const counts = getCounts(style);
  const exercises: PlannedExercise[] = [];

  for (const group of focus) {
    const count = counts[group] ?? 1;
    const pool = pick(group, equipment, 20);
    const start = (dayNum - 1) % pool.length;
    for (let i = 0; i < Math.min(count, pool.length); i++) {
      exercises.push(toPlanned(pool[(start + i) % pool.length], style));
    }
  }

  return {
    dayNumber: dayNum,
    week: 1,
    splitLabel: label,
    exercises,
    estimatedCalories: Math.round(exercises.reduce((s, e) => s + e.caloriesBurned, 0)),
  };
}

export function generateWorkoutPlan(
  goal: string,
  daysPerWeek: number,
  style: WorkoutStyle,
  equipment: Equipment
): WorkoutPlan {
  const days: WorkoutDay[] = [];
  for (let i = 1; i <= daysPerWeek; i++) {
    days.push(buildDay(i, daysPerWeek, style, equipment));
  }
  return { style, daysPerWeek, equipment, goal, days };
}

export function overload(day: WorkoutDay, week: number): WorkoutDay {
  if (week <= 1) return day;
  const overloaded = day.exercises.map(ex => {
    let sets = ex.sets;
    let reps = ex.reps;
    let duration = ex.durationSec;
    if (week >= 3) sets += 1;
    if (week >= 2 && reps > 0) reps += 1;
    if (week >= 2 && duration > 0) duration += 5;
    if (week >= 4 && reps > 0) reps += 1;
    const factor = 1 + ((sets > ex.sets ? 0.33 : 0) + (week - 1) * 0.08);
    return { ...ex, sets, reps, durationSec: duration, caloriesBurned: ex.caloriesBurned * factor };
  });
  return {
    ...day,
    exercises: overloaded,
    estimatedCalories: Math.round(overloaded.reduce((s, e) => s + e.caloriesBurned, 0)),
    week,
  };
}
