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
        // Modern Professional Palette
        background: "#FAFAFA", // Clean off-white
        surface: "#FFFFFF",
        surfaceAlt: "#F3F4F6", // Cool gray for secondary surfaces
        primary: "#FF6B4A", // Coral accent (Keep identity)
        primaryHover: "#FF542E",
        text: {
          DEFAULT: "#111827", // Gray-900
          secondary: "#4B5563", // Gray-600
          tertiary: "#9CA3AF", // Gray-400
        },
        accent: {
          blue: "#3B82F6",
          orange: "#F97316",
          purple: "#8B5CF6",
          green: "#10B981",
        },
        border: "#E5E7EB", // Gray-200
        divider: "#F3F4F6",
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
        // Soft, layered shadows for depth
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        cardHover: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
        button: "0 4px 14px 0 rgba(255, 107, 74, 0.3)",
        nav: "0 -4px 20px rgba(0,0,0,0.03)",
      },
    },
  },
  plugins: [],
};
export default config;
