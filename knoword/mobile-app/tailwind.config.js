/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        "primary-hover": "#2563EB",
        error: "#EF4444",
        "error-hover": "#DC2626",
        "text-error": "#F87171",
      },
    },
  },
  plugins: [],
};