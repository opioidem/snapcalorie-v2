'use client';

import { useState, useEffect } from 'react';
import { FoodEntry } from '@/lib/types';
import { loadAppState } from '@/lib/storage';
import { calculatePlan } from '@/lib/fitness';
import styles from './HistoryTab.module.css';

interface DaySummary {
  date: string;
  label: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
  entries: FoodEntry[];
}

function getLast30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function HistoryTab() {
  const [allEntries, setAllEntries] = useState<FoodEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [target, setTarget] = useState(2000);

  useEffect(() => {
    const state = loadAppState();
    setAllEntries(state.foodLog);
    if (state.profile) {
      const plan = calculatePlan(
        state.profile.weightKg,
        state.profile.heightCm,
        state.profile.age,
        state.profile.sex === 'male',
        state.profile.activityLevel,
        state.profile.goal
      );
      setTarget(plan.dailyCalories);
    }
  }, []);

  const days = getLast30Days().map(dateStr => {
    const entries = allEntries.filter(e => e.date === dateStr);
    return {
      date: dateStr,
      label: formatDate(dateStr),
      totalCalories: Math.round(entries.reduce((s, e) => s + e.calories, 0)),
      totalProtein: Math.round(entries.reduce((s, e) => s + e.protein, 0)),
      totalCarbs: Math.round(entries.reduce((s, e) => s + e.carbs, 0)),
      totalFat: Math.round(entries.reduce((s, e) => s + e.fat, 0)),
      mealCount: entries.length,
      entries,
    };
  });

  const selected = selectedDay ? days.find(d => d.date === selectedDay) : null;
  const totalLogged = allEntries.length;
  const daysWithFood = days.filter(d => d.mealCount > 0).length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>History</h1>
        <div className={styles.stats}>
          <span>{totalLogged} meals</span>
          <span>·</span>
          <span>{daysWithFood} days</span>
        </div>
      </header>

      {selected ? (
        <div className={styles.detail}>
          <button className={styles.backBtn} onClick={() => setSelectedDay(null)}>
            ← Back to all days
          </button>

          <div className={styles.detailHeader}>
            <h2>{selected.label}</h2>
            <span className={styles.detailDate}>{selected.date}</span>
          </div>

          {/* Summary cards */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryValue}>{selected.totalCalories}</span>
              <span className={styles.summaryLabel}>kcal</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryValue}>{selected.totalProtein}g</span>
              <span className={styles.summaryLabel}>protein</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryValue}>{selected.totalCarbs}g</span>
              <span className={styles.summaryLabel}>carbs</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryValue}>{selected.totalFat}g</span>
              <span className={styles.summaryLabel}>fat</span>
            </div>
          </div>

          {/* Meal list */}
          {selected.entries.length === 0 ? (
            <div className={styles.empty}>
              <p>No meals logged this day</p>
            </div>
          ) : (
            <div className={styles.mealList}>
              {selected.entries.map(entry => (
                <div key={entry.id} className={styles.mealItem}>
                  <div className={styles.mealInfo}>
                    <div className={styles.mealName}>{entry.name}</div>
                    <div className={styles.mealMeta}>
                      {entry.servingLabel} · {entry.source}
                    </div>
                  </div>
                  <div className={styles.mealCals}>{Math.round(entry.calories)} kcal</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.dayList}>
          {days.map(day => (
            <div
              key={day.date}
              className={`${styles.dayCard} ${day.mealCount === 0 ? styles.dayEmpty : ''}`}
              onClick={() => day.mealCount > 0 && setSelectedDay(day.date)}
            >
              <div className={styles.dayLeft}>
                <div className={styles.dayLabel}>{day.label}</div>
                <div className={styles.dayDate}>{day.date}</div>
              </div>

              <div className={styles.dayMiddle}>
                {day.mealCount > 0 ? (
                  <>
                    <div className={styles.dayCal}>{day.totalCalories} kcal</div>
                    <div className={styles.dayMeals}>{day.mealCount} meals</div>
                  </>
                ) : (
                  <div className={styles.dayNoData}>—</div>
                )}
              </div>

              {day.mealCount > 0 && (
                <div className={styles.dayBar}>
                  <div
                    className={`${styles.dayBarFill} ${day.totalCalories > target ? styles.overTarget : ''}`}
                    style={{ width: `${Math.min((day.totalCalories / target) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
