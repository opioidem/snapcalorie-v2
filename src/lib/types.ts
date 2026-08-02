// Core types for SnapCalorie

export interface UserProfile {
  name: string;
  age: number;
  sex: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  activityLevel: 1 | 2 | 3 | 4 | 5; // sedentary to extra active
  goal: 'lose' | 'maintain' | 'gain';
  createdAt: string;
}

export interface CaloriePlan {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  protein: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingLabel: string;
  source: 'usda' | 'vision' | 'manual';
  date: string;
  createdAt: string;
}

export interface VisionResult {
  name: string;
  confidence: number;
  servingLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface VisionSource {
  id: string;
  name: string;
  requiresKey: boolean;
  isOnDevice: boolean;
  modelId?: string;
}

export const VISION_SOURCES: VisionSource[] = [
  {
    id: 'webllm',
    name: 'On-Device (Phi-3.5 Vision)',
    requiresKey: false,
    isOnDevice: true,
    modelId: 'Phi-3.5-vision-instruct-q4f16_1-MLC'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (Free Vision)',
    requiresKey: true,
    isOnDevice: false,
    modelId: 'meta-llama/llama-3.2-11b-vision-instruct:free'
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM (Llama Vision)',
    requiresKey: true,
    isOnDevice: false,
    modelId: 'meta/llama-3.2-11b-vision-instruct'
  },
  {
    id: 'groq',
    name: 'Groq (Llama Vision)',
    requiresKey: true,
    isOnDevice: false,
    modelId: 'llama-3.2-11b-vision-preview'
  },
  {
    id: 'custom',
    name: 'Custom Endpoint',
    requiresKey: true,
    isOnDevice: false
  }
];

export interface ApiKeys {
  openrouter?: string;
  nvidia?: string;
  groq?: string;
  usda?: string;
  customEndpoint?: string;
  customModel?: string;
}

export interface AppState {
  profile: UserProfile | null;
  apiKeys: ApiKeys;
  selectedVisionSource: string;
  foodLog: FoodEntry[];
  onboardingComplete: boolean;
}
