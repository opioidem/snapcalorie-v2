'use client';

import { VisionResult } from '@/lib/types';
import { USDAFood } from '@/lib/usda';
import styles from './FoodResult.module.css';

interface FoodResultProps {
  visionResult: VisionResult;
  usdaResult: USDAFood | null;
  onConfirm: () => void;
  onRetry: () => void;
  onManualSearch: () => void;
}

export default function FoodResult({
  visionResult,
  usdaResult,
  onConfirm,
  onRetry,
  onManualSearch,
}: FoodResultProps) {
  const displayFood = usdaResult || visionResult;
  const hasUSDA = !!usdaResult;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Detection Result</h3>
        {hasUSDA && <span className={styles.usdaBadge}>USDA Verified</span>}
      </div>

      <div className={styles.result}>
        <div className={styles.name}>{displayFood.name}</div>

        {visionResult.confidence < 0.7 && (
          <div className={styles.confidenceWarning}>
            Low confidence ({Math.round(visionResult.confidence * 100)}%) — verify portion size
          </div>
        )}

        <div className={styles.serving}>{displayFood.servingLabel}</div>

        <div className={styles.calories}>
          <span className={styles.caloriesValue}>
            {Math.round(displayFood.calories)}
          </span>
          <span className={styles.caloriesUnit}>kcal</span>
        </div>

        <div className={styles.macros}>
          <div className={styles.macro}>
            <span className={styles.macroLabel}>Protein</span>
            <span className={styles.macroValue}>{Math.round(displayFood.protein)}g</span>
          </div>
          <div className={styles.macro}>
            <span className={styles.macroLabel}>Carbs</span>
            <span className={styles.macroValue}>{Math.round(displayFood.carbs)}g</span>
          </div>
          <div className={styles.macro}>
            <span className={styles.macroLabel}>Fat</span>
            <span className={styles.macroValue}>{Math.round(displayFood.fat)}g</span>
          </div>
        </div>

        {!hasUSDA && (
          <div className={styles.noUSDA}>
            No USDA match found — using AI estimate
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className="btn btn-outline" onClick={onRetry}>
          Retry
        </button>
        <button className="btn btn-outline" onClick={onManualSearch}>
          Search
        </button>
        <button className="btn" onClick={onConfirm}>
          Log Food
        </button>
      </div>
    </div>
  );
}
