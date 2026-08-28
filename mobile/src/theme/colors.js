// AURA OS Design Tokens — Premium Glassmorphism & Neon Palette
const colors = {
  // Backgrounds & Deep Canvas
  background: "#030712", // Deep void black/navy
  backgroundSecondary: "#0B1120",
  
  // Glass Surfaces (Translucent with light refraction)
  surface: "rgba(15, 23, 42, 0.75)",
  surfaceElevated: "rgba(30, 41, 59, 0.70)",
  surfaceHighlight: "rgba(51, 65, 85, 0.50)",
  surfaceGlass: "rgba(255, 255, 255, 0.04)",
  
  // Glass Borders (Subtle iridescent edges)
  surfaceBorder: "rgba(255, 255, 255, 0.08)",
  surfaceBorderLight: "rgba(255, 255, 255, 0.15)",
  surfaceBorderGlow: "rgba(99, 102, 241, 0.35)",

  // Brand Neon Accents
  primary: "#6366F1", // Electric Indigo
  primaryLight: "#818CF8",
  primaryDark: "#4F46E5",
  primaryGlow: "rgba(99, 102, 241, 0.4)",

  secondary: "#8B5CF6", // Cyber Purple
  secondaryLight: "#A78BFA",
  secondaryGlow: "rgba(139, 92, 246, 0.4)",

  accent: "#06B6D4", // Neon Cyan
  accentLight: "#22D3EE",
  accentGlow: "rgba(6, 182, 212, 0.4)",

  // Role Accent Colors
  student: "#6366F1",
  faculty: "#06B6D4",
  mentor: "#8B5CF6",
  parent: "#F59E0B",
  admin: "#EC4899",

  // Academic Risk Levels (Formula-weighted)
  riskHigh: "#F43F5E", // Rose Red
  riskHighBg: "rgba(244, 63, 94, 0.12)",
  riskHighBorder: "rgba(244, 63, 94, 0.35)",
  riskHighGlow: "rgba(244, 63, 94, 0.4)",

  riskMedium: "#F59E0B", // Amber Neon
  riskMediumBg: "rgba(245, 158, 11, 0.12)",
  riskMediumBorder: "rgba(245, 158, 11, 0.35)",
  riskMediumGlow: "rgba(245, 158, 11, 0.4)",

  riskLow: "#10B981", // Emerald Neon
  riskLowBg: "rgba(16, 185, 129, 0.12)",
  riskLowBorder: "rgba(16, 185, 129, 0.35)",
  riskLowGlow: "rgba(16, 185, 129, 0.4)",

  // Status Colors
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.12)",
  warning: "#F59E0B",
  warningBg: "rgba(245, 158, 11, 0.12)",
  danger: "#F43F5E",
  dangerBg: "rgba(244, 63, 94, 0.12)",
  info: "#06B6D4",
  infoBg: "rgba(6, 182, 212, 0.12)",

  // High-Contrast Typography
  text: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",
  textDark: "#64748B",

  // Linear Gradients (Pairs for LinearGradient)
  gradientPrimary: ["#6366F1", "#8B5CF6"],
  gradientCyan: ["#06B6D4", "#3B82F6"],
  gradientEmerald: ["#10B981", "#06B6D4"],
  gradientRose: ["#F43F5E", "#FB7185"],
  gradientAmber: ["#F59E0B", "#FBBF24"],
  gradientViolet: ["#8B5CF6", "#EC4899"],
  gradientCard: ["rgba(30, 41, 59, 0.70)", "rgba(15, 23, 42, 0.85)"],
  gradientGlass: ["rgba(255, 255, 255, 0.07)", "rgba(255, 255, 255, 0.02)"],
  gradientHero: ["#312E81", "#1E1B4B", "#0B0F19"],

  // Utilities
  overlay: "rgba(3, 7, 18, 0.85)",
  transparent: "transparent",
  white: "#FFFFFF",
  black: "#000000",
};

export default colors;
