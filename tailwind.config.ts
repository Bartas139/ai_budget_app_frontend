import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        surface: "#F7F5F2",
        canvas: "#FDFCFB",
        line: "#EBEBEB",
        ink: {
          DEFAULT: "#1A1A2E",
          secondary: "#6B6B80",
          muted: "#A8A8B8",
        },
        sage: {
          50: "#F0F5F1",
          100: "#D6EAD9",
          200: "#B8D9BC",
          400: "#7AB87F",
          600: "#4A9050",
        },
        rose: {
          50: "#FDF0F2",
          100: "#FADDE2",
          200: "#F5BAC3",
          400: "#E87A8D",
          600: "#C94D64",
        },
        sky: {
          50: "#F0F4FB",
          100: "#D9E5F7",
          200: "#B8CCF0",
          400: "#7AA0E0",
          600: "#4A74C8",
        },
        gold: {
          50: "#FDF6EC",
          100: "#FAE9CC",
          200: "#F5D099",
          400: "#E8A84A",
          600: "#C47A1A",
        },
        lavender: {
          50: "#F4F0FB",
          100: "#E4D9F7",
          200: "#C9B5F0",
          400: "#9B7DD8",
          600: "#6E4BBF",
        },
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        subtle: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        card: "0 2px 8px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.06)",
        elevated: "0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.08)",
        "rose-glow": "0 4px 20px rgba(232,122,141,0.25)",
        "sage-glow": "0 4px 20px rgba(122,184,127,0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
