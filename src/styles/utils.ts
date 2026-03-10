import tw from '@/styles/tw';

export type ButtonVariant = 'primary' | 'danger';

interface ButtonTheme {
  bgClass: string;
  textClass: string;
  borderColor: string;
  rippleColor: string;
  spinnerColor: string;
}

export const getButtonTheme = (variant: ButtonVariant): ButtonTheme => {
  const themes: Record<ButtonVariant, ButtonTheme> = {
    primary: {
      bgClass: 'bg-primary',
      textClass: 'text-ink-700',
      borderColor: 'border-white',
      rippleColor: '#1D4ED8',
      spinnerColor: tw.color('ink-700') || '#000000',
    },
    danger: {
      bgClass: 'bg-red-500',
      textClass: 'text-white',
      borderColor: 'border-red-600',
      rippleColor: '#B91C1C',
      spinnerColor: '#FFFFFF',
    },
  };

  return themes[variant];
};
