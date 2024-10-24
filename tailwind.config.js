/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bgSlate900: "#0f172a",
          backgroundGray: "#111827",
          textWhite: "#FFFFFF",
          textGray800: "#1f2937"
        },
        light: {
          background: "#FFFFFF",
          text: "#1E1E2F"
        },
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

