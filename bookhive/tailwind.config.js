/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Navy Blue
        secondary: '#FBBF24', // Honey Yellow
        accent: '#3B82F6', // Bright Sky Blue
        background: '#F8FAFC', // Light Grayish Blue
        card: '#FFFFFF', // White
        textPrimary: '#0F172A', // Very Dark Blue-Gray
        success: '#22C55E', // Green
        error: '#EF4444', // Red
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}