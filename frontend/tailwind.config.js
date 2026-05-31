/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#002B49',
          dark:    '#003d5c',
          darker:  '#004266',
        },
        turquoise: {
          DEFAULT: '#00A896',
          light:   '#e5f7f5',
        },
      },
    },
  },
  plugins: [],
};
