import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        sidebar: "rgb(var(--sidebar) / <alpha-value>)",
        sidebarHover: "rgb(var(--sidebar-hover) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accentHover: "rgb(var(--accent-hover) / <alpha-value>)",
        accentInk: "rgb(var(--accent-ink) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "Charter",
          "Iowan Old Style",
          "Palatino Linotype",
          "Georgia",
          "serif",
        ],
      },
      maxWidth: {
        reading: "46rem",
        content: "72rem",
      },
      boxShadow: {
        composer:
          "0 2px 8px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
