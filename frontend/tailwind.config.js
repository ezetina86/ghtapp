/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00f3ff",
          magenta: "#ff00ff",
          lime: "#39ff14",
        },
        dark: {
          900: "#0a0a0a",
          800: "#1a1a1a",
          700: "#2a2a2a",
        },
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        glow: {
          "0%": {
            boxShadow: "0 0 5px #00f3ff, 0 0 10px #00f3ff, 0 0 15px #00f3ff",
          },
          "100%": {
            boxShadow: "0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
