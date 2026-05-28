import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A67653',
          50: '#F5EDE7',
          100: '#E8D5C8',
          200: '#D4AF9B',
          300: '#BE8B6F',
          400: '#A67653',
          500: '#8B5E3C',
          600: '#6F4A2F',
          700: '#543724',
          800: '#3A2517',
          900: '#1F130B',
        },
        accent: {
          DEFAULT: '#D4AF37',
          50: '#FBF4E0',
          100: '#F5E4B3',
          200: '#EED480',
          300: '#E6C44D',
          400: '#D4AF37',
          500: '#B8942A',
          600: '#9C7A1F',
          700: '#7F6116',
          800: '#634A0F',
          900: '#473409',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0F172A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#1E293B',
        },
        muted: {
          DEFAULT: '#64748B',
          dark: '#94A3B8',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
