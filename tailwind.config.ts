import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        // Corelytics dark theme
        background: {
          DEFAULT: "#0f172a", // slate-950
          card: "#1e293b", // slate-800
          hover: "#334155", // slate-700
        },
        border: {
          DEFAULT: "#334155", // slate-700
          light: "#475569", // slate-600
        },
        accent: {
          purple: "#a855f7", // purple-500
          blue: "#3b82f6", // blue-500
          yellow: "#eab308", // yellow-500
          pink: "#ec4899", // pink-500
          orange: "#f97316", // orange-500
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
