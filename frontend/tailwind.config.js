/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        /*
          'sans' is what Tailwind uses for font-sans utility class.
          Putting Inter first ensures it is always preferred.
          The rest are fallbacks in order of preference.
        */
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Cascadia Code"',
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        fixit: {
          orange: "#FF9900",
          navy: "#1A2332",
          navyDark: "#0F172A",
          bg: "#F4F6F9",
        },
      },
    },
  },
  plugins: [],
};
