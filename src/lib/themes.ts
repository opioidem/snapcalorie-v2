// Theme system — all 8 themes from Obsidian vault

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgCard: string;
    bgCardRaised: string;
    accent: string;
    accentLight: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  font: string;
  cardRadius: string;
  cardShadow: string;
  cardBorder: string;
  glassEffect: string;
}

export const THEMES: Theme[] = [
  {
    id: 'spatial',
    name: 'Spatial',
    emoji: '🌌',
    colors: {
      bgPrimary: '#0a0a1a',
      bgSecondary: '#1a0a2a',
      bgCard: 'rgba(255,255,255,0.05)',
      bgCardRaised: 'rgba(255,255,255,0.08)',
      accent: '#8b5cf6',
      accentLight: '#a78bfa',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      border: 'rgba(139,92,246,0.3)',
      error: '#ef4444',
      success: '#22c55e',
      protein: '#8b5cf6',
      carbs: '#f59e0b',
      fat: '#ef4444',
    },
    font: "'JetBrains Mono', monospace",
    cardRadius: '0px',
    cardShadow: 'none',
    cardBorder: '2px solid rgba(139,92,246,0.3)',
    glassEffect: 'none',
  },
  {
    id: 'dark',
    name: 'Dark',
    emoji: '🌑',
    colors: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#121212',
      bgCard: '#1e1e1e',
      bgCardRaised: '#252525',
      accent: '#3b82f6',
      accentLight: '#60a5fa',
      textPrimary: '#ffffff',
      textSecondary: '#a0a0a0',
      border: '#2a2a2a',
      error: '#ef4444',
      success: '#22c55e',
      protein: '#3b82f6',
      carbs: '#f59e0b',
      fat: '#ef4444',
    },
    font: "'JetBrains Mono', monospace",
    cardRadius: '0px',
    cardShadow: 'none',
    cardBorder: '1px solid #2a2a2a',
    glassEffect: 'none',
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    emoji: '🔲',
    colors: {
      bgPrimary: '#000000',
      bgSecondary: '#0a0a0a',
      bgCard: '#111111',
      bgCardRaised: '#1a1a1a',
      accent: '#00ff00',
      accentLight: '#33ff33',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      border: '#ffffff',
      error: '#ff0000',
      success: '#00ff00',
      protein: '#00ff00',
      carbs: '#ffff00',
      fat: '#ff0000',
    },
    font: "'JetBrains Mono', monospace",
    cardRadius: '0px',
    cardShadow: 'none',
    cardBorder: '2px solid #ffffff',
    glassEffect: 'none',
  },
  {
    id: 'glass',
    name: 'Glass',
    emoji: '🪟',
    colors: {
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgCard: 'rgba(255,255,255,0.1)',
      bgCardRaised: 'rgba(255,255,255,0.15)',
      accent: '#60a5fa',
      accentLight: '#93c5fd',
      textPrimary: '#ffffff',
      textSecondary: '#94a3b8',
      border: 'rgba(255,255,255,0.2)',
      error: '#f87171',
      success: '#4ade80',
      protein: '#60a5fa',
      carbs: '#fbbf24',
      fat: '#f87171',
    },
    font: "'JetBrains Mono', monospace",
    cardRadius: '16px',
    cardShadow: '0 8px 32px rgba(0,0,0,0.3)',
    cardBorder: '1px solid rgba(255,255,255,0.2)',
    glassEffect: 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);',
  },
  {
    id: 'minimalism',
    name: 'Minimal',
    emoji: '⚪',
    colors: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f8f9fa',
      bgCard: '#ffffff',
      bgCardRaised: '#f1f3f5',
      accent: '#111111',
      accentLight: '#333333',
      textPrimary: '#111111',
      textSecondary: '#666666',
      border: '#e5e5e5',
      error: '#dc2626',
      success: '#16a34a',
      protein: '#111111',
      carbs: '#666666',
      fat: '#999999',
    },
    font: "'JetBrains Mono', monospace",
    cardRadius: '0px',
    cardShadow: 'none',
    cardBorder: '1px solid #e5e5e5',
    glassEffect: 'none',
  },
  {
    id: 'neomorphism',
    name: 'Neomorph',
    emoji: '🟣',
    colors: {
      bgPrimary: '#2d2d2d',
      bgSecondary: '#333333',
      bgCard: '#2d2d2d',
      bgCardRaised: '#353535',
      accent: '#a29bfe',
      accentLight: '#c4b5fd',
      textPrimary: '#ffffff',
      textSecondary: '#999999',
      border: 'transparent',
      error: '#ff6b6b',
      success: '#51cf66',
      protein: '#a29bfe',
      carbs: '#ffd43b',
      fat: '#ff6b6b',
    },
    font: "'JetBrains Mono', monospace",
    cardRadius: '20px',
    cardShadow: '8px 8px 16px #1a1a1a, -8px -8px 16px #3d3d3d',
    cardBorder: 'none',
    glassEffect: 'none',
  },
  {
    id: 'light',
    name: 'Light',
    emoji: '☀️',
    colors: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f8f9fa',
      bgCard: '#ffffff',
      bgCardRaised: '#f1f3f5',
      accent: '#3b82f6',
      accentLight: '#60a5fa',
      textPrimary: '#111111',
      textSecondary: '#666666',
      border: '#e5e5e5',
      error: '#dc2626',
      success: '#16a34a',
      protein: '#3b82f6',
      carbs: '#f59e0b',
      fat: '#ef4444',
    },
    font: "'JetBrains Mono', monospace",
    cardRadius: '8px',
    cardShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cardBorder: '1px solid #e5e5e5',
    glassEffect: 'none',
  },
  {
    id: 'maximalism',
    name: 'Maximal',
    emoji: '🌈',
    colors: {
      bgPrimary: '#000000',
      bgSecondary: '#111111',
      bgCard: '#1a1a1a',
      bgCardRaised: '#222222',
      accent: '#ff0080',
      accentLight: '#ff3399',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      border: '2px solid #ff0080',
      error: '#ff0000',
      success: '#00ff88',
      protein: '#ff0080',
      carbs: '#00ff88',
      fat: '#8b5cf6',
    },
    font: "'JetBrains Mono', monospace",
    cardRadius: '0px',
    cardShadow: 'none',
    cardBorder: '2px solid #ff0080',
    glassEffect: 'none',
  },
];

export function applyTheme(themeId: string) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const root = document.documentElement;
  const c = theme.colors;

  root.style.setProperty('--bg-primary', c.bgPrimary);
  root.style.setProperty('--bg-secondary', c.bgSecondary);
  root.style.setProperty('--bg-card', c.bgCard);
  root.style.setProperty('--bg-card-raised', c.bgCardRaised);
  root.style.setProperty('--accent', c.accent);
  root.style.setProperty('--accent-light', c.accentLight);
  root.style.setProperty('--text-primary', c.textPrimary);
  root.style.setProperty('--text-secondary', c.textSecondary);
  root.style.setProperty('--border', c.border);
  root.style.setProperty('--error', c.error);
  root.style.setProperty('--success', c.success);
  root.style.setProperty('--protein', c.protein);
  root.style.setProperty('--carbs', c.carbs);
  root.style.setProperty('--fat', c.fat);

  root.style.setProperty('--card-radius', theme.cardRadius);
  root.style.setProperty('--card-shadow', theme.cardShadow);
  root.style.setProperty('--card-border', theme.cardBorder);
  root.style.setProperty('--glass-effect', theme.glassEffect);
  root.style.setProperty('--font-mono', theme.font);

  document.body.style.background = `linear-gradient(135deg, ${c.bgPrimary} 0%, ${c.bgSecondary} 100%)`;
  document.body.style.fontFamily = theme.font;
}

export function getThemeId(): string {
  if (typeof window === 'undefined') return 'spatial';
  return localStorage.getItem('snapcal_theme') || 'spatial';
}

export function setThemeId(id: string) {
  localStorage.setItem('snapcal_theme', id);
}
