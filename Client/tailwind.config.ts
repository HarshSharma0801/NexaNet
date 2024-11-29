import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        back: "#dddedd",
        primaryDark: "#22092C",
        primarylight: "#BE3144",
        primarylighter: "#860A35",
        primarylightDark: "#860A35",
        light: "#BACDDB",
      },
    },
  },
  plugins: [],
} satisfies Config;
