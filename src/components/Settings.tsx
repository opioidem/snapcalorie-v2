'use client';

import { useState, useEffect } from 'react';
import { UserProfile, ApiKeys, VISION_SOURCES } from '@/lib/types';
import { loadAppState, saveProfile, saveApiKeys, setVisionSource, clearAllData } from '@/lib/storage';
import { calculatePlan } from '@/lib/fitness';
import { THEMES, applyTheme, getThemeId, setThemeId } from '@/lib/themes';
import styles from './Settings.module.css';

interface SettingsProps {
  onClose: () => void;
  onReset: () => void;
}

export default function Settings({ onClose, onReset }: SettingsProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [visionSource, setVisionSource] = useState('webllm');
  const [currentTheme, setCurrentTheme] = useState('spatial');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [plan, setPlan] = useState<{ dailyCalories: number; protein: number } | null>(null);

  useEffect(() => {
    const state = loadAppState();
    setProfile(state.profile || {});
    setApiKeys(state.apiKeys);
    setVisionSource(state.selectedVisionSource);
    setCurrentTheme(getThemeId());

    if (state.profile) {
      const calculated = calculatePlan(
        state.profile.weightKg,
        state.profile.heightCm,
        state.profile.age,
        state.profile.sex === 'male',
        state.profile.activityLevel,
        state.profile.goal
      );
      setPlan({ dailyCalories: calculated.dailyCalories, protein: calculated.protein });
    }
  }, []);

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

  const handleSaveProfile = () => {
    const fullProfile: UserProfile = {
      name: profile.name || 'User',
      age: profile.age ?? 25,
      sex: profile.sex || 'male',
      weightKg: profile.weightKg ?? 70,
      heightCm: profile.heightCm ?? 175,
      activityLevel: profile.activityLevel as 1 | 2 | 3 | 4 | 5,
      goal: profile.goal || 'maintain',
      createdAt: profile.createdAt || new Date().toISOString(),
    };
    saveProfile(fullProfile);
  };

  const handleSaveApiKeys = () => {
    saveApiKeys(apiKeys);
    setVisionSource(visionSource);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    setThemeId(themeId);
    applyTheme(themeId);
  };

  const handleReset = () => {
    clearAllData();
    setShowResetConfirm(false);
    onReset();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.body}>
          {/* Profile Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Profile</h3>

            <div className={styles.field}>
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                onBlur={handleSaveProfile}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className="label">Age</label>
                <input
                  type="number"
                  className="input"
                  value={profile.age ?? ''}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                  onBlur={handleSaveProfile}
                />
              </div>
              <div className={styles.field}>
                <label className="label">Sex</label>
                <select
                  className="select"
                  value={profile.sex || 'male'}
                  onChange={(e) => { setProfile({ ...profile, sex: e.target.value as 'male' | 'female' }); }}
                  onBlur={handleSaveProfile}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className="label">Weight (kg)</label>
                <input
                  type="number"
                  className="input"
                  value={profile.weightKg ?? ''}
                  onChange={(e) => setProfile({ ...profile, weightKg: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                  onBlur={handleSaveProfile}
                />
              </div>
              <div className={styles.field}>
                <label className="label">Height (cm)</label>
                <input
                  type="number"
                  className="input"
                  value={profile.heightCm ?? ''}
                  onChange={(e) => setProfile({ ...profile, heightCm: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                  onBlur={handleSaveProfile}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className="label">Activity Level</label>
              <select
                className="select"
                value={profile.activityLevel || 3}
                onChange={(e) => setProfile({ ...profile, activityLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
                onBlur={handleSaveProfile}
              >
                <option value={1}>Sedentary</option>
                <option value={2}>Lightly Active</option>
                <option value={3}>Moderately Active</option>
                <option value={4}>Very Active</option>
                <option value={5}>Extra Active</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className="label">Goal</label>
              <select
                className="select"
                value={profile.goal || 'maintain'}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value as 'lose' | 'maintain' | 'gain' })}
                onBlur={handleSaveProfile}
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Build Muscle</option>
              </select>
            </div>

            {plan && (
              <div className={styles.planPreview}>
                <span>Daily Target: </span>
                <strong>{plan.dailyCalories} kcal</strong>
                <span> · </span>
                <strong>{plan.protein}g protein</strong>
              </div>
            )}
          </section>

          {/* Theme Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Theme</h3>
            <div className={styles.themeGrid}>
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  className={`${styles.themeCard} ${currentTheme === theme.id ? styles.themeActive : ''}`}
                  onClick={() => handleThemeChange(theme.id)}
                  style={{
                    background: theme.colors.bgPrimary,
                    borderColor: currentTheme === theme.id ? theme.colors.accent : theme.colors.border,
                    color: theme.colors.textPrimary,
                  }}
                >
                  <span className={styles.themeEmoji}>{theme.emoji}</span>
                  <span className={styles.themeName}>{theme.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Vision Source Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>AI Vision Source</h3>
            <div className={styles.visionSources}>
              {VISION_SOURCES.map((source) => (
                <div
                  key={source.id}
                  className={`${styles.visionOption} ${visionSource === source.id ? styles.visionActive : ''}`}
                  onClick={() => setVisionSource(source.id)}
                >
                  <div className={styles.visionName}>{source.name}</div>
                  <div className={styles.visionBadges}>
                    {source.isOnDevice && <span className={styles.badgePrivacy}>Private</span>}
                    {source.requiresKey && <span className={styles.badgeKey}>Key</span>}
                  </div>
                </div>
              ))}
            </div>

            {VISION_SOURCES.find(s => s.id === visionSource)?.requiresKey && (
              <div className={styles.field}>
                <label className="label">API Key</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter API key"
                  value={apiKeys[visionSource as keyof ApiKeys] || ''}
                  onChange={(e) => setApiKeys({ ...apiKeys, [visionSource]: e.target.value })}
                  onBlur={handleSaveApiKeys}
                />
              </div>
            )}

            <div className={styles.field}>
              <label className="label">USDA API Key (optional)</label>
              <input
                type="password"
                className="input"
                placeholder="Free key at fdc.nal.usda.gov"
                value={apiKeys.usda || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, usda: e.target.value })}
                onBlur={handleSaveApiKeys}
              />
            </div>
          </section>

          {/* Danger Zone */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Danger Zone</h3>
            {!showResetConfirm ? (
              <button
                className={styles.resetBtn}
                onClick={() => setShowResetConfirm(true)}
              >
                Reset All Data
              </button>
            ) : (
              <div className={styles.resetConfirm}>
                <p>This will delete your profile, food log, and all settings. This cannot be undone.</p>
                <div className={styles.resetActions}>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn"
                    style={{ background: 'var(--error)' }}
                    onClick={handleReset}
                  >
                    Delete Everything
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
