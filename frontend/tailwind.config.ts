import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { navy: { 50: '#eef3fb', 100: '#d9e4f5', 600: '#1e4a8a', 700: '#173b70', 800: '#112d57', 900: '#0b1f3a' } },
      boxShadow: { card: '0 1px 2px rgba(15,23,42,.05), 0 4px 12px rgba(15,23,42,.04)' },
    },
  },
  plugins: [],
};
export default config;
