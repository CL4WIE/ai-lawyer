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
        canvas: "#ffffff",
        surface: "#f7f7f8",
        sidebar: "#f9f9f9",
        sidebarHover: "#ececec",
        ink: "#0d0d0d",
        muted: "#5d5d5d",
        subtle: "#8e8ea0",
        border: "#e5e5e5",
        accent: "#0b5fff",
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
