import { create } from 'twrnc';
import { palette, radii } from './theme';

const tw = create({
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        surface: '#FFFFFF',
        'primary-500': palette.primary[500],
        'primary-600': palette.primary[600],

        'surface-950': palette.surface[950],
        'surface-900': palette.surface[900],
        'surface-800': palette.surface[800],
        'surface-700': palette.surface[700],
        'surface-600': palette.surface[600],
        'surface-400': palette.surface[400],
        'surface-200': palette.surface[200],
        'surface-border': palette.surface.border,

        'ink-900': palette.ink[900],
        'ink-700': palette.ink[700],
        'ink-500': palette.ink[500],
        'ink-400': palette.ink[400],
        'ink-300': palette.ink[300],
        'ink-200': palette.ink[200],
        'ink-50': palette.ink[50],
        'ink-100': palette.ink[100],

        'error-500': palette.error[500],
      },
      borderRadius: {
        md: `${radii.md}px`,
        lg: `${radii.lg}px`,
        xl: `${radii.xl}px`,
      },
    },
  },
});

export default tw;
