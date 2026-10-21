import { Platform } from "react-native";

export const colors = {
  bg: "#08090E",
  bgElevated: "#0D0E15",
  surface: "#141520",
  surfaceHigh: "#1B1C29",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  violet: "#9B5CFF",
  violetSoft: "#D7B7FF",
  cyan: "#66D9FF",
  success: "#52D6A4",
  warning: "#FF656F",
  warningSoft: "rgba(255,101,111,0.16)",
  text: "#F6F5FC",
  textSecondary: "#A5A4B8",
  textMuted: "#6E6D82",
  overlay: "rgba(8,9,14,0.72)",
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const layout = {
  maxWidth: 720,
  contentPad: 20,
  tabBarHeight: Platform.OS === "web" ? 64 : 78,
} as const;

export const typography = {
  hero: { fontSize: 32, fontWeight: "700" as const, letterSpacing: -0.8, lineHeight: 38 },
  title: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.4, lineHeight: 28 },
  subtitle: { fontSize: 17, fontWeight: "600" as const, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: "600" as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: "500" as const, lineHeight: 18 },
  micro: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.3, lineHeight: 14 },
};

export const shadows = {
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  glow: {
    shadowColor: "#9B5CFF",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
};
