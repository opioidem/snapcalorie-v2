'use client';

import { useState, useEffect } from 'react';
import { WorkoutPlan, WorkoutStyle, Equipment, overload, generateWorkoutPlan, STYLE_LABELS, STYLE_LABELS_SHORT } from '@/lib/workout';
import { loadAppState } from '@/lib/storage';
import Icon from './Icons';
import styles from './WorkoutTab.module.css';

const WORKOUT_KEY = 'snapcal_workout_plan';
const COMPLETED_KEY = 'snapcal_workout_completed';

export default function WorkoutTab() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [week, setWeek] = useState(1);
  const [dayIndex, setDayIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showSetup, setShowSetup] = useState(false);
  const [setupStyle, setSetupStyle] = useState<WorkoutStyle>('full_body');
  const [setupDays, setSetupDays] = useState(4);
  const [setupEquipment, setSetupEquipment] = useState<Equipment>('home');

  useEffect(() => {
    const planJson = localStorage.getItem(WORKOUT_KEY);
    const completedJson = localStorage.getItem(COMPLETED_KEY);
    if (planJson) {
      try { setPlan(JSON.parse(planJson)); } catch {}
    }
    if (completedJson) {
      try { setCompleted(new Set(JSON.parse(completedJson))); } catch {}
    }
  }, []);

  const handleGenerate = () => {
    const state = loadAppState();
    const goal = state.profile?.goal || 'maintain';
    const newPlan = generateWorkoutPlan(goal, setupDays, setupStyle, setupEquipment);
    setPlan(newPlan);
    setDayIndex(0);
    setWeek(1);
    setCompleted(new Set());
    localStorage.setItem(WORKOUT_KEY, JSON.stringify(newPlan));
    setShowSetup(false);
  };

  const toggleExercise = (week: number, dayIdx: number, exIdx: number) => {
    const key = `${week}-${dayIdx}-${exIdx}`;
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem(COMPLETED_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const currentDay = plan ? overload(plan.days[dayIndex], week) : null;
  const completedCount = currentDay
    ? currentDay.exercises.filter((_, i) => completed.has(`${week}-${dayIndex}-${i}`)).length
    : 0;
  const progressPct = currentDay ? (completedCount / currentDay.exercises.length) * 100 : 0;

  return (
    <div className={styles.container}>
      {showSetup ? (
        <div className={styles.setup}>
          <h3>Plan Settings</h3>
          <div className={styles.field}>
            <label className="label">Style</label>
            <div className={styles.styleGrid}>
              {(Object.keys(STYLE_LABELS) as WorkoutStyle[]).map(s => (
                <button
                  key={s}
                  className={`${styles.styleBtn} ${setupStyle === s ? styles.styleActive : ''}`}
                  onClick={() => setSetupStyle(s)}
                >
                  <span className={styles.styleAbbr}>{STYLE_LABELS_SHORT[s]}</span>
                  <span className={styles.styleFull}>{STYLE_LABELS[s]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <label className="label">Days per week: {setupDays}</label>
            <input
              type="range"
              min={3}
              max={6}
              value={setupDays}
              onChange={(e) => setSetupDays(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>
          <div className={styles.field}>
            <label className="label">Equipment</label>
            <div className={styles.equipRow}>
              <button
                className={`${styles.equipBtn} ${setupEquipment === 'home' ? styles.equipActive : ''}`}
                onClick={() => setSetupEquipment('home')}
              >
                <Icon name="settings" size={16} color="currentColor" /> Home
              </button>
              <button
                className={`${styles.equipBtn} ${setupEquipment === 'gym' ? styles.equipActive : ''}`}
                onClick={() => setSetupEquipment('gym')}
              >
                <Icon name="dumbbell" size={16} color="currentColor" /> Gym
              </button>
            </div>
          </div>
          <button className="btn" onClick={handleGenerate} style={{ width: '100%' }}>
            Generate Plan
          </button>
        </div>
      ) : !plan ? (
        <div className={styles.empty}>
          <Icon name="dumbbell" size={48} color="var(--text-secondary)" />
          <p style={{ marginTop: '1rem' }}>No workout plan yet</p>
          <p className={styles.emptyHint}>Tap "Create Plan" to generate one</p>
        </div>
      ) : (
        <>
          {/* Week selector FIRST (above day tabs) */}
          <div className={styles.weekSelector}>
            {[1, 2, 3, 4].map(w => (
              <button
                key={w}
                className={`${styles.weekBtn} ${week === w ? styles.weekActive : ''}`}
                onClick={() => setWeek(w)}
              >
                W{w}
              </button>
            ))}
          </div>

          {/* Day tabs SECOND (below week selector) */}
          <div className={styles.dayTabs}>
            {plan.days.map((day, i) => (
              <button
                key={i}
                className={`${styles.dayTab} ${dayIndex === i ? styles.dayTabActive : ''}`}
                onClick={() => setDayIndex(i)}
              >
                {STYLE_LABELS_SHORT[plan.style]} {i + 1}
              </button>
            ))}
          </div>

          {/* Current day */}
          {currentDay && (
            <div className={styles.dayContent}>
              <div className={styles.dayHeader}>
                <h2 className={styles.dayTitle}>{currentDay.splitLabel}</h2>
                <span className={styles.daySub}>
                  Day {currentDay.dayNumber} · Week {currentDay.week} · ~{currentDay.estimatedCalories} kcal
                </span>
              </div>

              {/* Progress bar */}
              <div className={styles.progress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ transform: `scaleX(${progressPct / 100})` }} />
                </div>
                <span className={styles.progressText}>{completedCount}/{currentDay.exercises.length}</span>
              </div>

              {/* Exercises */}
              <div className={styles.exercises}>
                {currentDay.exercises.map((ex, i) => {
                  const done = completed.has(`${week}-${dayIndex}-${i}`);
                  return (
                    <div
                      key={i}
                      className={`${styles.exercise} ${done ? styles.exerciseDone : ''}`}
                      onClick={() => toggleExercise(week, dayIndex, i)}
                    >
                      <div className={styles.check}>
                        {done && <Icon name="check" size={14} color="var(--accent-light)" />}
                      </div>
                      <div className={styles.exInfo}>
                        <div className={styles.exName}>{ex.name}</div>
                        <div className={styles.exDetail}>
                          {ex.reps > 0
                            ? `${ex.sets} × ${ex.reps} reps`
                            : `${ex.sets} × ${ex.durationSec}s`}
                          {' · '}
                          ~{Math.round(ex.caloriesBurned)} kcal
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
