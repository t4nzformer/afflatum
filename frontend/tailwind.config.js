// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f5f2e9',      // background
        ink: '#111111',        // default text
        afflationred: '#eab2a0',        // followers
        afflationgreen: '#b7ddb0',      // following
        afflationblue: '#a9c6d9',       // afflations
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};
