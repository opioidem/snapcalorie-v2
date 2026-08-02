// localStorage helpers for SnapCalorie

import { AppState, UserProfile, FoodEntry, ApiKeys } from './types';

const KEYS = {
  PROFILE: 'snapcal_profile',
  API_KEYS: 'snapcal_api_keys',
  FOOD_LOG: 'snapcal_food_log',
  VISION_SOURCE: 'snapcal_vision_source',
  ONBOARDING_COMPLETE: 'snapcal_onboarding_complete',
};

export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return {
      profile: null,
      apiKeys: {},
      selectedVisionSource: 'webllm',
      foodLog: [],
      onboardingComplete: false,
    };
  }

  try {
    const profile = localStorage.getItem(KEYS.PROFILE);
    const apiKeys = localStorage.getItem(KEYS.API_KEYS);
    const foodLog = localStorage.getItem(KEYS.FOOD_LOG);
    const visionSource = localStorage.getItem(KEYS.VISION_SOURCE);
    const onboardingComplete = localStorage.getItem(KEYS.ONBOARDING_COMPLETE);

    return {
      profile: profile ? JSON.parse(profile) : null,
      apiKeys: apiKeys ? JSON.parse(apiKeys) : {},
      selectedVisionSource: visionSource || 'webllm',
      foodLog: foodLog ? JSON.parse(foodLog) : [],
      onboardingComplete: onboardingComplete === 'true',
    };
  } catch {
    return {
      profile: null,
      apiKeys: {},
      selectedVisionSource: 'webllm',
      foodLog: [],
      onboardingComplete: false,
    };
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export function saveApiKeys(keys: ApiKeys): void {
  localStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
}

export function saveFoodLog(log: FoodEntry[]): void {
  localStorage.setItem(KEYS.FOOD_LOG, JSON.stringify(log));
}

export function addFoodEntry(entry: FoodEntry): FoodEntry[] {
  const state = loadAppState();
  const newLog = [...state.foodLog, entry];
  saveFoodLog(newLog);
  return newLog;
}

export function deleteFoodEntry(id: string): FoodEntry[] {
  const state = loadAppState();
  const newLog = state.foodLog.filter(f => f.id !== id);
  saveFoodLog(newLog);
  return newLog;
}

export function setVisionSource(source: string): void {
  localStorage.setItem(KEYS.VISION_SOURCE, source);
}

export function setOnboardingComplete(complete: boolean): void {
  localStorage.setItem(KEYS.ONBOARDING_COMPLETE, String(complete));
}

export function clearAllData(): void {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}
