import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        surface: "#131315",
        "surface-2": "#1b1b1e",
        line: "#28282b",
        "line-soft": "#1f1f22",
        paper: "#f6f6f1",
        muted: "#9c9c96",
        yellow: "#ffff00",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
      },
      boxShadow: {
        hard: "6px 6px 0 0 #000",
        "hard-sm": "4px 4px 0 0 #000",
        "hard-yellow": "6px 6px 0 0 #ffff00",
        "hard-line": "4px 4px 0 0 #28282b",
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.22em",
      },
    },
  },
  plugins: [],
};

export default config;
