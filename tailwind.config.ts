import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fundo: "#f8fafc",
        card: "#ffffff",
        destaque: "#0369a1",
        perigo: "#dc2626"
      }
    }
  },
  plugins: []
};

export default config;
