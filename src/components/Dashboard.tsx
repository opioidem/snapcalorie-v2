'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FoodEntry, VisionResult, ApiKeys } from '@/lib/types';
import { loadAppState, addFoodEntry, deleteFoodEntry } from '@/lib/storage';
import { detectFood, initWebLLM } from '@/lib/vision';
import { searchUSDA, USDAFood } from '@/lib/usda';
import { calculatePlan } from '@/lib/fitness';
import { applyTheme, getThemeId } from '@/lib/themes';
import Camera from './Camera';
import FoodResult from './FoodResult';
import Settings from './Settings';
import styles from './Dashboard.module.css';

interface DashboardProps {
  onResetOnboarding: () => void;
}

export default function Dashboard({ onResetOnboarding }: DashboardProps) {
  const [foodLog, setFoodLog] = useState<FoodEntry[]>([]);
  const [profile, setProfile] = useState<{ dailyCalories: number; protein: number } | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [visionSource, setVisionSource] = useState('webllm');
  const [showCamera, setShowCamera] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<VisionResult | null>(null);
  const [usdaResult, setUsdaResult] = useState<USDAFood | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [modelLoaded, setModelLoaded] = useState(false);

  // Load state on mount
  useEffect(() => {
    const state = loadAppState();
    setFoodLog(state.foodLog);
    setApiKeys(state.apiKeys);
    setVisionSource(state.selectedVisionSource);

    // Apply saved theme
    applyTheme(getThemeId());

    if (state.profile) {
      const plan = calculatePlan(
        state.profile.weightKg,
        state.profile.heightCm,
        state.profile.age,
        state.profile.sex === 'male',
        state.profile.activityLevel,
        state.profile.goal
      );
      setProfile({ dailyCalories: plan.dailyCalories, protein: plan.protein });
    }

    // Preload WebLLM if selected
    if (state.selectedVisionSource === 'webllm' && typeof window !== 'undefined') {
      initWebLLM('Phi-3.5-vision-instruct-q4f16_1-MLC', (progress) => {
        setStatus(progress);
      }).then(() => {
        setModelLoaded(true);
        setStatus(null);
      });
    }
  }, []);

  const todayFood = foodLog.filter(f => f.date === selectedDate);
  const consumed = todayFood.reduce((sum, f) => sum + f.calories, 0);
  const protein = todayFood.reduce((sum, f) => sum + f.protein, 0);
  const carbs = todayFood.reduce((sum, f) => sum + f.carbs, 0);
  const fat = todayFood.reduce((sum, f) => sum + f.fat, 0);

  const remaining = (profile?.dailyCalories || 2000) - consumed;
  const isOver = remaining < 0;

  const handleCapture = useCallback(async (imageBase64: string) => {
    setAnalyzing(true);
    setStatus('Analyzing...');
    setShowCamera(false);

    try {
      const result = await detectFood({
        source: visionSource,
        imageBase64,
        apiKeys,
        onProgress: setStatus,
      });

      setVisionResult(result);

      // Try to find USDA match
      try {
        const usdaFoods = await searchUSDA(result.name, apiKeys.usda);
        if (usdaFoods.length > 0) {
          setUsdaResult(usdaFoods[0]);
        }
      } catch (e) {
        console.error('USDA search failed:', e);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setAnalyzing(false);
    }
  }, [visionSource, apiKeys]);

  const handleConfirm = useCallback(() => {
    if (!visionResult) return;

    const entry: FoodEntry = {
      id: uuidv4(),
      name: usdaResult?.name || visionResult.name,
      calories: usdaResult?.calories || visionResult.calories,
      protein: usdaResult?.protein || visionResult.protein,
      carbs: usdaResult?.carbs || visionResult.carbs,
      fat: usdaResult?.fat || visionResult.fat,
      servingLabel: usdaResult?.servingLabel || visionResult.servingLabel,
      source: usdaResult ? 'usda' : 'vision',
      date: getTodayDate(),
      createdAt: new Date().toISOString(),
    };

    const newLog = addFoodEntry(entry);
    setFoodLog(newLog);
    setVisionResult(null);
    setUsdaResult(null);
    setStatus(null);
  }, [visionResult, usdaResult]);

  const handleDelete = useCallback((id: string) => {
    const newLog = deleteFoodEntry(id);
    setFoodLog(newLog);
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Today</h1>
        <button className="btn btn-outline" onClick={() => setShowSettings(true)}>
          Settings
        </button>
      </header>

      {/* Date Strip */}
      <div className={styles.dateStrip}>
        {getLast7Days().map((date) => (
          <div
            key={date.date}
            className={`${styles.dateChip} ${date.date === selectedDate ? styles.active : ''}`}
            onClick={() => setSelectedDate(date.date)}
          >
            <span className={styles.dateChipDay}>{date.day}</span>
            <span className={styles.dateChipDate}>{date.num}</span>
          </div>
        ))}
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroLabel}>
          {isOver ? 'Over target' : 'Remaining today'}
        </div>
        <div className={`${styles.heroNumber} ${isOver ? styles.over : ''}`}>
          {Math.abs(remaining)}
        </div>
        <div className={styles.heroSub}>
          {isOver ? `${Math.abs(remaining)} over` : `of ${profile?.dailyCalories || 2000}`}
        </div>
      </div>

      {/* Day Rail */}
      {todayFood.length > 0 && (
        <div className={styles.dayRail}>
          {todayFood.map((food, i) => {
            const fraction = food.calories / consumed;
            const dominantMacro = food.protein >= food.carbs && food.protein >= food.fat
              ? 'protein'
              : food.carbs >= food.fat ? 'carbs' : 'fat';
            return (
              <div
                key={food.id}
                className={`${styles.railSegment} ${styles[dominantMacro]}`}
                style={{ width: `${fraction * 100}%`, transform: 'scaleX(0)' }}
                ref={(el) => {
                  if (el) requestAnimationFrame(() => {
                    el.style.transform = 'scaleX(1)';
                  });
                }}
              />
            );
          })}
        </div>
      )}

      {/* Macro Bars */}
      <div className={styles.macroSection}>
        <div className="macro-bar">
          <span className="macro-bar-label">Protein</span>
          <div className="macro-bar-track">
            <div
              className="macro-bar-fill protein"
              style={{ width: `${Math.min((protein / (profile?.protein || 150)) * 100, 100)}%` }}
            />
          </div>
          <span className="macro-bar-value">{Math.round(protein)} / {profile?.protein || 150}g</span>
        </div>

        <div className="macro-bar">
          <span className="macro-bar-label">Carbs</span>
          <div className="macro-bar-track">
            <div
              className="macro-bar-fill carbs"
              style={{ width: `${Math.min((carbs / 200) * 100, 100)}%` }}
            />
          </div>
          <span className="macro-bar-value">{Math.round(carbs)} / 200g</span>
        </div>

        <div className="macro-bar">
          <span className="macro-bar-label">Fat</span>
          <div className="macro-bar-track">
            <div
              className="macro-bar-fill fat"
              style={{ width: `${Math.min((fat / 70) * 100, 100)}%` }}
            />
          </div>
          <span className="macro-bar-value">{Math.round(fat)} / 70g</span>
        </div>
      </div>

      {/* Food Log */}
      <div className={styles.foodLog}>
        <h2>Food Log</h2>

        {todayFood.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🍽️</div>
            <p>No food logged today</p>
            <p className={styles.emptyHint}>Tap the + button to add a meal</p>
          </div>
        ) : (
          <div className={styles.foodList}>
            {todayFood.map((food) => (
              <div key={food.id} className={styles.foodEntry}>
                <div className={styles.foodInfo}>
                  <div className={styles.foodName}>{food.name}</div>
                  <div className={styles.foodMeta}>
                    {food.servingLabel} · {food.source}
                  </div>
                </div>
                <div className={styles.foodCalories}>
                  {Math.round(food.calories)} kcal
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(food.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      {status && (
        <div className={styles.status}>
          <div className="spinner" />
          <span>{status}</span>
        </div>
      )}

      {/* Vision Result */}
      {visionResult && (
        <FoodResult
          visionResult={visionResult}
          usdaResult={usdaResult}
          onConfirm={handleConfirm}
          onRetry={() => {
            setVisionResult(null);
            setUsdaResult(null);
            setShowCamera(true);
          }}
          onManualSearch={() => {
            setVisionResult(null);
            setUsdaResult(null);
          }}
        />
      )}

      {/* FAB */}
      <button
        className={styles.fab}
        onClick={() => setShowCamera(true)}
        disabled={analyzing}
      >
        +
      </button>

      {/* Camera Modal */}
      {showCamera && (
        <Camera
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onReset={onResetOnboarding}
        />
      )}
    </div>
  );
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getLast7Days(): Array<{ date: string; day: string; num: string }> {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const result = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() + i);
    result.push({
      date: d.toISOString().split('T')[0],
      day: days[i],
      num: d.getDate().toString(),
    });
  }

  return result;
}
