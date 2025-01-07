/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hotPink: '#FF2F6E',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
