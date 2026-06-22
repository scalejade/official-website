import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Keep support but default to Light
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFFFF",
        surface: "#F8FAFC",
        scalejade: {
          600: "#047857", // Action items & Hero highlights (AA contrast on white)
          800: "#065f46", // Sophisticated borders & Typography
          900: "#064e3b", // Deep Dark Footer & Contrast Sections
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;