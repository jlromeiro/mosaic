/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#050510",
          secondary: "#0A0A1F",
          tertiary: "#141430",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B4B4C8",
          tertiary: "#737390",
        },
        solana: {
          green: "#14F195",
          purple: "#9945FF",
          cyan: "#00D4FF",
        },
        border: {
          subtle: "#1F1F35",
          emphasis: "#2A2A4A",
        },
        danger: "#FF4D6D",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        container: "1400px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 8px #14F195)" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 24px #14F195)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(8px, -12px)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 1.4s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
