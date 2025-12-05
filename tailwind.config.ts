import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm & Comfy Palette (Themed via CSS Variables)
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surfaceAlt: "rgb(var(--surface-alt) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        primaryHover: "rgb(var(--primary-hover) / <alpha-value>)",
        text: {
          DEFAULT: "rgb(var(--text) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
        },
        accent: {
          blue: "#5B8DB8", // Muted Blue
          orange: "#E08D55", // Muted Orange
          purple: "#9D84B7", // Muted Purple
          green: "#6DA386", // Sage Green
        },
        border: "rgb(var(--border) / <alpha-value>)",
        divider: "rgb(var(--surface-alt) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "24px", // Slightly more rounded
        button: "9999px", // Full pill
        input: "16px",
      },
      boxShadow: {
        // Soft, warm shadows
        sm: "0 1px 2px 0 rgba(60, 40, 30, 0.05)",
        card: "0 4px 6px -1px rgba(60, 40, 30, 0.02), 0 2px 4px -1px rgba(60, 40, 30, 0.02)",
        cardHover: "0 10px 15px -3px rgba(60, 40, 30, 0.05), 0 4px 6px -2px rgba(60, 40, 30, 0.025)",
        button: "0 4px 14px 0 rgba(217, 119, 87, 0.3)", // Terracotta shadow
        nav: "0 -4px 20px rgba(60, 40, 30, 0.03)",
      },
    },
  },
  plugins: [],
};
export default config;
