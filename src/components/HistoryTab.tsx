'use client';

import { useState, useEffect } from 'react';
import { FoodEntry } from '@/lib/types';
import { loadAppState } from '@/lib/storage';
import { calculatePlan } from '@/lib/fitness';
import styles from './HistoryTab.module.css';

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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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

  const entries = allEntries.filter(e => e.date === selectedDate);
  const totalCal = Math.round(entries.reduce((s, e) => s + e.calories, 0));
  const totalP = Math.round(entries.reduce((s, e) => s + e.protein, 0));
  const totalC = Math.round(entries.reduce((s, e) => s + e.carbs, 0));
  const totalF = Math.round(entries.reduce((s, e) => s + e.fat, 0));
  const pct = Math.min((totalCal / target) * 100, 100);
  const isOver = totalCal > target;

  return (
    <div className={styles.container}>
      {/* Day picker — horizontal scroll */}
      <div className={styles.dayPicker}>
        {getLast30Days().map(dateStr => {
          const d = new Date(dateStr + 'T12:00:00');
          const hasFood = allEntries.some(e => e.date === dateStr);
          return (
            <button
              key={dateStr}
              className={`${styles.dayBtn} ${selectedDate === dateStr ? styles.dayBtnActive : ''} ${hasFood ? styles.dayBtnHasData : ''}`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <span className={styles.dayDow}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className={styles.dayNum}>{d.getDate()}</span>
              {hasFood && <span className={styles.dayDot} />}
            </button>
          );
        })}
      </div>

      {/* Day label */}
      <div className={styles.dayLabel}>
        <h2>{formatDate(selectedDate)}</h2>
        <span className={styles.dayDate}>{selectedDate}</span>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={`${styles.summaryValue} ${isOver ? styles.overValue : ''}`}>{totalCal}</span>
          <span className={styles.summaryLabel}>kcal</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{totalP}g</span>
          <span className={styles.summaryLabel}>protein</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{totalC}g</span>
          <span className={styles.summaryLabel}>carbs</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{totalF}g</span>
          <span className={styles.summaryLabel}>fat</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${isOver ? styles.overBar : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={styles.progressText}>
          {isOver ? `${totalCal - target} over target` : `${target - totalCal} remaining`}
        </span>
      </div>

      {/* Meal list */}
      {entries.length === 0 ? (
        <div className={styles.empty}>
          <p>No meals logged on this day</p>
        </div>
      ) : (
        <div className={styles.mealList}>
          {entries.map(entry => (
            <div key={entry.id} className={styles.mealItem}>
              <div className={styles.mealInfo}>
                <div className={styles.mealName}>{entry.name}</div>
                <div className={styles.mealMeta}>{entry.servingLabel} · {entry.source}</div>
              </div>
              <div className={styles.mealCals}>{Math.round(entry.calories)} kcal</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
