/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        text: '#e5e5e5',
        muted: '#888888',
        error: '#ff5f5f',
        accent: 'var(--accent)'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.4)'
      }
    }
  },
  plugins: []
};
