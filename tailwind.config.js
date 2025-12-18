/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#00E5FF',
        background: '#121212',
        surface: '#1E1E1E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
      },
    },
  },
  plugins: [],
}
