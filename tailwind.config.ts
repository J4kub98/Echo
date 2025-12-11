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
        serif: ["var(--font-playfair)", "Georgia", "serif"],
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
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, rgb(var(--background)) 0%, rgb(var(--surface-alt)) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #D97757 0%, #E08D55 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
