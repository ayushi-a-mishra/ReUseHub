/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1360px',
      },
    },
    extend: {
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['20px', { lineHeight: '28px' }],
        xl: ['25px', { lineHeight: '32px' }],
        '2xl': ['31px', { lineHeight: '38px', letterSpacing: '-0.02em' }],
        '3xl': ['39px', { lineHeight: '46px', letterSpacing: '-0.02em' }],
        '4xl': ['49px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        '5xl': ['61px', { lineHeight: '68px', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        prose: '65ch',
      },
      colors: {
        // HSL Semantic Tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          raised: 'hsl(var(--surface-raised))',
        },

        text: {
          primary: 'hsl(var(--text-primary))',
          muted: 'hsl(var(--text-muted))',
        },

        // 11-Step Green Scale (Brand Primary #16A34A & Forest #14532D)
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A', // Brand Primary
          700: '#15803D',
          800: '#166534',
          900: '#14532D', // Deep Forest
          950: '#052E16',
        },
        primary: {
          DEFAULT: '#16A34A',
          foreground: '#ffffff',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        forest: {
          DEFAULT: '#14532D',
          50: '#F0F7F2',
          100: '#DCEDE1',
          500: '#15803D',
          800: '#14532D',
          900: '#0A2E19',
        },

        // 11-Step Orange Scale (Accent #F97316 for single main CTA & highlights)
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // Brand Accent
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        accent: {
          DEFAULT: '#F97316',
          foreground: '#ffffff',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },

        // 11-Step Slate Scale
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        // Semantic Status Colors
        status: {
          available: '#10B981',
          requested: '#F59E0B',
          reserved: '#6366F1',
          reused: '#059669',
          removed: '#EF4444',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      borderRadius: {
        input: '8px',
        button: '12px',
        card: '16px',
        hero: '24px',
        full: '9999px',
        lg: '12px',
        md: '8px',
        sm: '6px',
        xl: '16px',
        '2xl': '24px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // 3 levels of layered soft shadows tinted with brand green at 6-10% opacity
        'elevation-1': '0 2px 8px -1px rgba(22, 163, 74, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'elevation-2': '0 8px 24px -4px rgba(22, 163, 74, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'elevation-3': '0 20px 48px -8px rgba(22, 163, 74, 0.10), 0 8px 24px -4px rgba(0, 0, 0, 0.06)',
        soft: '0 2px 8px -1px rgba(22, 163, 74, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        card: '0 8px 24px -4px rgba(22, 163, 74, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        glass: '0 8px 32px 0 rgba(22, 163, 74, 0.08)',
        hover: '0 20px 48px -8px rgba(22, 163, 74, 0.10), 0 8px 24px -4px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        120: '120ms',
        200: '200ms',
        320: '320ms',
        600: '600ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms cubic-bezier(0.2, 0, 0, 1)',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
