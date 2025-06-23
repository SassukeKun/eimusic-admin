/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Cores específicas do EiMusic Admin
      colors: {
        // Gradientes principais
        primary: {
          50: '#f3f1ff',
          100: '#ebe5ff',
          200: '#d9ceff',
          300: '#bea6ff',
          400: '#9f75ff',
          500: '#843dff',
          600: '#7916ff',
          700: '#6b04fd',
          800: '#5a03d4',
          900: '#4c05ad',
          950: '#2e0074',
        },
        // Background escuro com gradiente
        dark: {
          50: '#18181b',
          100: '#27272a',
          200: '#3f3f46',
          300: '#52525b',
          400: '#71717a',
          500: '#a1a1aa',
          600: '#d4d4d8',
          700: '#e4e4e7',
          800: '#f4f4f5',
          900: '#fafafa',
        },
        // Cores de status específicas
        status: {
          approved: '#10b981',
          pending: '#f59e0b',
          blocked: '#ef4444',
          verified: '#3b82f6',
        }
      },
      // Gradientes customizados
      backgroundImage: {
        'admin-gradient': 'linear-gradient(135deg, #1f2937 0%, #7c3aed 15%, #1f2937 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(55, 65, 81, 0.5) 0%, rgba(17, 24, 39, 0.8) 100%)',
        'button-gradient': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        'header-gradient': 'linear-gradient(90deg, #7c3aed 0%, #ec4899 25%, #eab308 50%, #10b981 100%)',
      },
      // Animações otimizadas
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      // Sombras customizadas
      boxShadow: {
        'admin': '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      // Espaçamentos específicos
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Breakpoints customizados para admin
      screens: {
        'xs': '475px',
        'admin-sm': '640px',
        'admin-md': '768px',
        'admin-lg': '1024px',
        'admin-xl': '1280px',
        'admin-2xl': '1536px',
      }
    },
  },
  plugins: [
    // Plugin para animações avançadas
    function({ addUtilities }) {
      const newUtilities = {
        '.backdrop-blur-admin': {
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
        },
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}