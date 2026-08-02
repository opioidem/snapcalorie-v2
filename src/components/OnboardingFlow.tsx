'use client';

import { useState, useEffect } from 'react';
import { UserProfile, ApiKeys, VISION_SOURCES } from '@/lib/types';
import { saveProfile, saveApiKeys, setVisionSource, setOnboardingComplete } from '@/lib/storage';
import { calculatePlan } from '@/lib/fitness';
import styles from './OnboardingFlow.module.css';

const ONBOARDING_STEPS = 5;

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    sex: 'male',
    weightKg: 70,
    heightCm: 175,
    activityLevel: 3,
    goal: 'maintain',
  });
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [selectedSource, setSelectedSource] = useState('webllm');
  const [plan, setPlan] = useState<{ dailyCalories: number; protein: number } | null>(null);

  useEffect(() => {
    if (profile.weightKg && profile.heightCm && profile.age && profile.sex && profile.activityLevel && profile.goal) {
      const calculated = calculatePlan(
        profile.weightKg,
        profile.heightCm,
        profile.age,
        profile.sex === 'male',
        profile.activityLevel as 1 | 2 | 3 | 4 | 5,
        profile.goal
      );
      setPlan({ dailyCalories: calculated.dailyCalories, protein: calculated.protein });
    }
  }, [profile.weightKg, profile.heightCm, profile.age, profile.sex, profile.activityLevel, profile.goal]);

  const handleComplete = () => {
    const fullProfile: UserProfile = {
      name: profile.name || 'User',
      age: profile.age ?? 25,
      sex: profile.sex || 'male',
      weightKg: profile.weightKg ?? 70,
      heightCm: profile.heightCm ?? 175,
      activityLevel: profile.activityLevel as 1 | 2 | 3 | 4 | 5,
      goal: profile.goal || 'maintain',
      createdAt: new Date().toISOString(),
    };

    saveProfile(fullProfile);
    saveApiKeys(apiKeys);
    setVisionSource(selectedSource);
    setOnboardingComplete(true);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.step}>
            <h2>Welcome to SnapCalorie</h2>
            <p className={styles.subtitle}>Track calories with AI-powered food detection</p>

            <div className={styles.field}>
              <label className="label">Your Name</label>
              <input
                type="text"
                className="input"
                placeholder="Enter your name"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className="label">Biological Sex</label>
              <select
                className="select"
                value={profile.sex}
                onChange={(e) => setProfile({ ...profile, sex: e.target.value as 'male' | 'female' })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className="label">Age</label>
              <input
                type="number"
                className="input"
                placeholder="25"
                value={profile.age ?? ''}
                onChange={(e) => setProfile({ ...profile, age: e.target.value === '' ? undefined : parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.step}>
            <h2>Your Stats</h2>
            <p className={styles.subtitle}>We use these to calculate your calorie needs</p>

            <div className={styles.field}>
              <label className="label">Weight (kg)</label>
              <input
                type="number"
                className="input"
                placeholder="70"
                value={profile.weightKg ?? ''}
                onChange={(e) => setProfile({ ...profile, weightKg: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
              />
            </div>

            <div className={styles.field}>
              <label className="label">Height (cm)</label>
              <input
                type="number"
                className="input"
                placeholder="175"
                value={profile.heightCm ?? ''}
                onChange={(e) => setProfile({ ...profile, heightCm: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.step}>
            <h2>Activity Level</h2>
            <p className={styles.subtitle}>How active are you on a typical day?</p>

            <div className={styles.options}>
              {[
                { value: 1, label: 'Sedentary', desc: 'Desk job, little exercise' },
                { value: 2, label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                { value: 3, label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                { value: 4, label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
                { value: 5, label: 'Extra Active', desc: 'Very hard exercise, physical job' },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`${styles.option} ${profile.activityLevel === opt.value ? styles.selected : ''}`}
                  onClick={() => setProfile({ ...profile, activityLevel: opt.value as 1 | 2 | 3 | 4 | 5 })}
                >
                  <div className={styles.optionLabel}>{opt.label}</div>
                  <div className={styles.optionDesc}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.step}>
            <h2>Your Goal</h2>
            <p className={styles.subtitle}>What do you want to achieve?</p>

            <div className={styles.options}>
              {[
                { value: 'lose', label: 'Lose Weight', desc: '-500 cal/day deficit' },
                { value: 'maintain', label: 'Maintain', desc: 'Keep current weight' },
                { value: 'gain', label: 'Build Muscle', desc: '+300 cal/day surplus' },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`${styles.option} ${profile.goal === opt.value ? styles.selected : ''}`}
                  onClick={() => setProfile({ ...profile, goal: opt.value as 'lose' | 'maintain' | 'gain' })}
                >
                  <div className={styles.optionLabel}>{opt.label}</div>
                  <div className={styles.optionDesc}>{opt.desc}</div>
                </div>
              ))}
            </div>

            {plan && (
              <div className={styles.planPreview}>
                <div className={styles.planTitle}>Your Daily Target</div>
                <div className={styles.planCalories}>{plan.dailyCalories} kcal</div>
                <div className={styles.planProtein}>{plan.protein}g protein</div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className={styles.step}>
            <h2>AI Food Detection</h2>
            <p className={styles.subtitle}>Choose how to analyze food photos</p>

            <div className={styles.visionSources}>
              {VISION_SOURCES.map((source) => (
                <div
                  key={source.id}
                  className={`${styles.visionSource} ${selectedSource === source.id ? styles.selected : ''}`}
                  onClick={() => setSelectedSource(source.id)}
                >
                  <div className={styles.visionSourceHeader}>
                    <div className={styles.visionSourceName}>{source.name}</div>
                    {source.isOnDevice && (
                      <span className={styles.badgeOnDevice}>Privacy First</span>
                    )}
                    {source.requiresKey && (
                      <span className={styles.badgeKey}>API Key</span>
                    )}
                  </div>

                  {selectedSource === source.id && source.requiresKey && (
                    <div className={styles.apiKeyField}>
                      <input
                        type="password"
                        className="input"
                        placeholder={`${source.name} API key`}
                        value={apiKeys[source.id as keyof ApiKeys] || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, [source.id]: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.field}>
              <label className="label">USDA API Key (optional, increases rate limits)</label>
              <input
                type="password"
                className="input"
                placeholder="Get free key at fdc.nal.usda.gov"
                value={apiKeys.usda || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, usda: e.target.value })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {Array.from({ length: ONBOARDING_STEPS }, (_, i) => (
          <div
            key={i}
            className={`${styles.progressDot} ${i + 1 <= step ? styles.active : ''}`}
          />
        ))}
      </div>

      {renderStep()}

      <div className={styles.actions}>
        {step > 1 && (
          <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}

        {step < ONBOARDING_STEPS ? (
          <button className="btn" onClick={() => setStep(step + 1)}>
            Next
          </button>
        ) : (
          <button className="btn" onClick={handleComplete}>
            Start Tracking
          </button>
        )}
      </div>
    </div>
  );
}
