/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F1A',
          800: '#131A2A',
          700: '#1C263B',
        },
        neon: {
          blue: '#00F0FF',
          purple: '#B026FF',
          cyan: '#00FFCC',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-blue': '0 0 10px rgba(0, 240, 255, 0.6), 0 0 20px rgba(0, 240, 255, 0.4)',
        'neon-purple': '0 0 10px rgba(176, 38, 255, 0.6), 0 0 20px rgba(176, 38, 255, 0.4)',
      }
    },
  },
  plugins: [],
};
