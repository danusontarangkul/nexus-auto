// src/styles/tw.ts
import { create } from 'twrnc';
import { palette } from './theme';

const tw = create({
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          50: palette.primary[50],
          100: palette.primary[100],
          200: palette.primary[200],
          300: palette.primary[300],
          400: palette.primary[400],
          500: palette.primary[500],
          600: palette.primary[600],
          700: palette.primary[700],
          800: palette.primary[800],
          900: palette.primary[900],
        },
        secondary: {
          50: palette.secondary[50],
          100: palette.secondary[100],
          200: palette.secondary[200],
          300: palette.secondary[300],
          400: palette.secondary[400],
          500: palette.secondary[500],
          600: palette.secondary[600],
          700: palette.secondary[700],
          800: palette.secondary[800],
          900: palette.secondary[900],
        },

        // Feedback
        success: {
          500: palette.success[500],
          600: palette.success[600],
        },
        warning: {
          500: palette.warning[500],
          600: palette.warning[600],
        },
        danger: { 500: palette.danger[500], 600: palette.danger[600] },
        info: { 500: palette.info[500], 600: palette.info[600] },

        // Surfaces / text
        surface: {
          50: palette.surface[50],
          100: palette.surface[100],
          900: palette.surface[900],
        },
        ink: {
          50: palette.ink[50],
          200: palette.ink[200],
          600: palette.ink[600],
          800: palette.ink[800],
          900: palette.ink[900],
        },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
});

export default tw;

// Nice extras you can import:
// tw.color('primary-600'), tw.style('px-4 py-2', isActive && 'bg-primary-600')
