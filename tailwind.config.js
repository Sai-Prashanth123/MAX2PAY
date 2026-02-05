/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color (Blue)
        primary: {
          DEFAULT: '#2563eb', // primary-600 as default
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Main primary color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Stitch template tokens (used verbatim in the provided HTML)
        'background-light': '#f5faff',
        'background-dark': '#171f31',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
