/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // AES Brand Colors (Based on Logo: Navy #232E48 & Red #D2232A)
        'aes-navy': {
          DEFAULT: '#232E48',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#232E48',
          600: '#1E293B',
          700: '#0F172A',
          800: '#090E1A',
          900: '#030712',
        },
        'aes-blue': {
          DEFAULT: '#2D3E50',
          light: '#3B526B',
          dark: '#1A2534',
        },
        'aes-yellow': {
          DEFAULT: '#D2232A', // Map yellow class names to Red for zero template breakages
          light: '#E53935',
          dark: '#B71C1C',
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#E53935',
          500: '#B71C1C',
        },
        'aes-surface': '#FAF7ED', // Cream ivory logo background
        'aes-card': '#FFFFFF',    // Clean white cards
        'aes-text': 'var(--color-text)',    // Dynamically scoped text color
        'aes-muted': 'var(--color-muted)',   // Dynamically scoped muted text color
        'aes-border': '#E2E8F0',  // Light border
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aes-gradient': 'linear-gradient(135deg, #232E48 0%, #2D3E50 50%, #1A2534 100%)',
        'yellow-gradient': 'linear-gradient(135deg, #D2232A, #B71C1C)',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D3E50' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'aes': '0 4px 24px rgba(35, 46, 72, 0.1)',
        'aes-glow': '0 0 20px rgba(210, 35, 42, 0.15)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 40px rgba(210, 35, 42, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'count-up': 'countUp 2s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(245, 166, 35, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(245, 166, 35, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
