/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0D0F14',
          800: '#161922',
          700: '#1F2430',
          600: '#2A303C',
          500: '#3A4250',
        },
        primary: '#00D4FF',
        warning: '#F5A623',
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'scanline': 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
      }
    },
  },
  plugins: [],
}
