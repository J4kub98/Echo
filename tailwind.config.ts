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
        // Warm, inviting Echo palette from screenshot
        background: "#F5E6D3", // warm peach/beige
        surface: "#FFFFFF",
        surfaceAlt: "#FFF8F0",
        primary: "#FF6B4A", // coral accent
        primaryHover: "#FF8566",
        text: {
          DEFAULT: "#2C2420",
          secondary: "#6B5D52",
          tertiary: "#9B8A7A",
        },
        accent: {
          blue: "#4A9EFF",
          orange: "#FF9147",
          purple: "#B47AFF",
        },
        border: "#E8D8C8",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        button: "50px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(44, 36, 32, 0.06)",
        button: "0 4px 12px rgba(255, 107, 74, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
