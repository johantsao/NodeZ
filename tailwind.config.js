/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plex-sans)', 'IBM Plex Sans', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'IBM Plex Mono', 'monospace'],
        heading: ['var(--font-plex-sans)', 'IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#3aa9f3',
          hover: '#2d8fd0',
          glow: 'rgba(58, 169, 243, 0.12)',
        },
      },
    },
  },
  plugins: [],
}
