import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    colors: {
      accent: "rgb(var(--color-accent) / <alpha-value>)",
      bg: "var(--color-bg)",
      black: "#000",
      white: "#fff",
    },
  },
  plugins: [],
};
export default config;
