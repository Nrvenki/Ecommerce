// ======================================================
// utils/colors.js — App-wide Color Palette
// ======================================================
// Boys' fashion theme: vibrant blues, electric purples,
// energetic oranges, and cool teals on dark backgrounds.
// ======================================================

export const COLORS = {
  // === Primary Dark Background ===
  bgPrimary: '#0f0f23',       // Deep navy-black
  bgSecondary: '#1a1a3e',     // Dark indigo
  bgCard: '#1e1e4a',          // Card background
  bgInput: '#252560',         // Input field background
  bgModal: '#141432',         // Modal overlay background

  // === Accent Colors ===
  accentBlue: '#4facfe',      // Bright sky blue
  accentPurple: '#a855f7',    // Vibrant purple
  accentOrange: '#ff6b35',    // Energetic orange
  accentTeal: '#2dd4bf',      // Cool teal/mint
  accentPink: '#f472b6',      // Soft pink accent
  accentYellow: '#fbbf24',    // Warm gold/yellow

  // === Gradient Pairs ===
  gradientBlueStart: '#4facfe',
  gradientBlueEnd: '#00f2fe',
  gradientPurpleStart: '#a855f7',
  gradientPurpleEnd: '#6366f1',
  gradientOrangeStart: '#ff6b35',
  gradientOrangeEnd: '#fbbf24',
  gradientTealStart: '#2dd4bf',
  gradientTealEnd: '#06b6d4',

  // === Text Colors ===
  textPrimary: '#ffffff',
  textSecondary: '#b4b4d0',
  textMuted: '#6b6b8d',
  textAccent: '#4facfe',

  // === Utility Colors ===
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  border: '#2a2a5e',

  // === Shadows ===
  shadowBlue: 'rgba(79, 172, 254, 0.3)',
  shadowPurple: 'rgba(168, 85, 247, 0.3)',
  shadowOrange: 'rgba(255, 107, 53, 0.3)',
};

// Category color map for visual distinction
export const CATEGORY_COLORS = {
  'T-Shirts': { bg: '#1e3a5f', accent: '#4facfe' },
  'Jeans': { bg: '#1e2a4a', accent: '#6366f1' },
  'Hoodies': { bg: '#2d1b4e', accent: '#a855f7' },
  'Jackets': { bg: '#1b3d3d', accent: '#2dd4bf' },
  'Shorts': { bg: '#3d2b1b', accent: '#ff6b35' },
  'Formal': { bg: '#1b2d3d', accent: '#fbbf24' },
  'Sports': { bg: '#1b3d2b', accent: '#22c55e' },
  'Accessories': { bg: '#3d1b2d', accent: '#f472b6' },
};

export default COLORS;
