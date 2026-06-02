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
        brand: {
          blue: "#1E5BC6",
          "blue-dark": "#1749A8",
          "blue-light": "#EBF1FB",
          orange: "#F47920",
          "orange-dark": "#D96510",
          "orange-light": "#FEF3E8",
          dark: "#1A1A1A",
          bg: "#F5F7FA",
        },
        "vs-blue": "#1E5BC6",
        "vs-blue-dark": "#1749A8",
        "vs-blue-light": "#EBF1FB",
        "vs-orange": "#F47920",
        "vs-orange-dark": "#D96510",
        "vs-orange-light": "#FEF3E8",
        "vs-dark": "#1A1A1A",
        "vs-bg": "#F5F7FA",
        "vs-navy": "#0D2757",
        "vs-gray-700": "#374151",
        "vs-gray-600": "#6B7280",
        "vs-gray-400": "#9CA3AF",
        "vs-gray-200": "#E5E7EB",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          xl: "1440px",
        },
      },
      maxWidth: {
        "8xl": "1440px",
      },
      backgroundImage: {
        "vs-gradient":
          "linear-gradient(135deg, #1E5BC6 0%, #2E6FD6 55%, #F47920 100%)",
        "vs-hero":
          "linear-gradient(160deg, #F0F5FF 0%, #FFFFFF 40%, #FFF8F2 100%)",
        "vs-dark-gradient":
          "linear-gradient(135deg, #1E5BC6 0%, #1749A8 60%, #0D2757 100%)",
        "vs-navy-gradient":
          "linear-gradient(135deg, #0D2757 0%, #1749A8 60%, #1E5BC6 100%)",
      },
      boxShadow: {
        vs: "0 2px 8px rgba(0,0,0,0.06)",
        "vs-md": "0 4px 16px rgba(0,0,0,0.09)",
        "vs-lg": "0 12px 40px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        vs: "6px",
        "vs-lg": "12px",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(1.55)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "cta-pulse-blue": {
          "0%": { boxShadow: "0 0 0 0 rgba(30,91,198,0.55)" },
          "70%": { boxShadow: "0 0 0 14px rgba(30,91,198,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(30,91,198,0)" },
        },
        "cta-pulse-orange": {
          "0%": { boxShadow: "0 0 0 0 rgba(244,121,32,0.55)" },
          "70%": { boxShadow: "0 0 0 14px rgba(244,121,32,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(244,121,32,0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float 3s ease-in-out 1.5s infinite",
        "fade-in-up": "fade-in-up 0.5s ease forwards",
        "cta-pulse-blue": "cta-pulse-blue 2s ease-out infinite",
        "cta-pulse-orange": "cta-pulse-orange 2s ease-out infinite 0.8s",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            img: { borderRadius: "0.5rem" },
            "h1,h2,h3,h4": { fontWeight: "700" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
