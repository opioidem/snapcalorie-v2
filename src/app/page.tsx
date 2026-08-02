'use client';

import { useState, useEffect } from 'react';
import OnboardingFlow from '@/components/OnboardingFlow';
import Dashboard from '@/components/Dashboard';
import { loadAppState, clearAllData, setOnboardingComplete } from '@/lib/storage';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const state = loadAppState();
    setOnboardingComplete(state.onboardingComplete);
    setLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

  const handleResetOnboarding = () => {
    if (confirm('Reset all data and start over?')) {
      clearAllData();
      setOnboardingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard onResetOnboarding={handleResetOnboarding} />;
}
