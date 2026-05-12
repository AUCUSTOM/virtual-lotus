export type Theme = "warm" | "dark" | "rose" | "sage" | "dusk";

export const THEMES = {
  warm:   { bg: "#faf7f4", bg2: "#f5ede4", surface: "rgba(139,107,90,0.06)", border: "rgba(139,107,90,0.15)", text: "#2a2020", text2: "#9a8070", accent: "#8b6b5a", accent2: "#c4a882", glow: "rgba(196,168,130,0.2)", premium: "#a07850", card: "#fff" },
  dark:   { bg: "#0d0b09", bg2: "#141210", surface: "rgba(196,168,130,0.06)", border: "rgba(196,168,130,0.12)", text: "#f0ebe4", text2: "#8a7a6a", accent: "#c4a882", accent2: "#e0c9a8", glow: "rgba(196,168,130,0.15)", premium: "#c4a882", card: "#141210" },
  rose:   { bg: "#fdf6f8", bg2: "#f9ecf0", surface: "rgba(180,80,110,0.05)", border: "rgba(180,80,110,0.12)", text: "#2a1a20", text2: "#a07080", accent: "#c45a7a", accent2: "#e8a0b8", glow: "rgba(196,90,120,0.15)", premium: "#c45a7a", card: "#fff" },
  sage:   { bg: "#f6f8f4", bg2: "#edf2e8", surface: "rgba(80,120,80,0.05)", border: "rgba(80,120,80,0.12)", text: "#1a2a1a", text2: "#708070", accent: "#5a8a5a", accent2: "#a0c4a0", glow: "rgba(90,138,90,0.15)", premium: "#5a8a5a", card: "#fff" },
  dusk:   { bg: "#0e0b14", bg2: "#141020", surface: "rgba(160,130,220,0.06)", border: "rgba(160,130,220,0.12)", text: "#f0ecf8", text2: "#8070a0", accent: "#a882d4", accent2: "#c8a8f0", glow: "rgba(168,130,212,0.15)", premium: "#c4a882", card: "#141020" },
};