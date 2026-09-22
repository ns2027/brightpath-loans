import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          200: "#bce0ff",
          300: "#8ecbff",
          400: "#59acff",
          500: "#3187ff",
          600: "#1c66f5",
          700: "#1750e1",
          800: "#1a41b6",
          900: "#1c3a8f",
          950: "#152358",
        },
      },
    },
  },
  plugins: [],
};
export default config;
