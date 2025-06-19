/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        yellow: '#FFC107', // Primary yellow
        'yellow-dark': '#FFA000', // Darker yellow for hover
        blue: '#1E3A8A', // Primary blue
        'blue-dark': '#152B70', // Darker blue for hover
        'blue-light': '#3B82F6', // Lighter blue for accents
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};