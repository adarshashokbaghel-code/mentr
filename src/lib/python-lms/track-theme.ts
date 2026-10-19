export type PyTrackTheme = {
  course: "beginner" | "intermediate";
  accent: string;
  accentHover: string;
  accentLight: string;
  accentWash: string;
  shellBg: string;
  heroBorder: string;
  heroBg: string;
  heroGradient: string;
};

export const PY_TRACK_THEMES: Record<"beginner" | "intermediate", PyTrackTheme> = {
  beginner: {
    course: "beginner",
    accent: "#2f9e6e",
    accentHover: "#278a5f",
    accentLight: "#5ee0a0",
    accentWash: "#eef8f2",
    shellBg: "#f7f5f0",
    heroBorder: "#1f2a23",
    heroBg: "#0f1612",
    heroGradient: "radial-gradient(ellipse at top,#1d3a2b 0%,#0f1612 70%)",
  },
  intermediate: {
    course: "intermediate",
    accent: "#e0a83a",
    accentHover: "#c49216",
    accentLight: "#ffd96a",
    accentWash: "#fff7e6",
    shellBg: "#faf6eb",
    heroBorder: "#2a2418",
    heroBg: "#141008",
    heroGradient: "radial-gradient(ellipse at top,#3a2f14 0%,#141008 70%)",
  },
};

export function pyTrackTheme(course: "beginner" | "intermediate"): PyTrackTheme {
  return PY_TRACK_THEMES[course];
}

export function pyTrackThemeForSlug(slug: string): PyTrackTheme {
  return slug.startsWith("int-") ? PY_TRACK_THEMES.intermediate : PY_TRACK_THEMES.beginner;
}
