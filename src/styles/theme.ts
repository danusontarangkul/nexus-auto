export const palette = {
  primary: {
    500: '#3B82F6',
    600: '#2563EB',
  },
  surface: {
    950: '#121212', // background
    900: '#1A1A1A',
    800: '#242424',
    700: '#2D2C2C',
    600: '#363434', // ← your Figma gray for cards / inputs
    border: '#4A4848',
  },
  ink: {
    900: '#F8FAFC', // text high contrast
    700: '#E4E7EB', // labels / subtitles
    500: '#B0B0B0', // placeholders
    400: '#9CA3AF', // disabled text
    300: '#6B7280', // secondary text
    200: '#D1D5DB', // secondary text
    100: '#F1F5F9', // lightest text
    50: '#F8FAFC', // lightest text
  },
  error: {
    500: '#EF4444',
  },
};

export const radii = {
  md: 12,
  lg: 16,
  xl: 20, // mock looks ~16–20
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
};

export const typography = {
  titleXL: {
    fontFamily: 'SourceSansPro_700Bold',
    fontSize: 24,
    letterSpacing: 0.2,
  },
  titleLg: { fontFamily: 'SourceSansPro_700Bold', fontSize: 22 },
  title: { fontFamily: 'SourceSansPro_600SemiBold', fontSize: 20 },
  body: { fontFamily: 'SourceSansPro_400Regular', fontSize: 16 },
  detail: { fontFamily: 'SourceSansPro_400Regular', fontSize: 13 },
  link: { fontFamily: 'SourceSansPro_600SemiBold', fontSize: 18 },
  label: {
    fontFamily: 'SourceSansPro_600SemiBold',
    fontSize: 16,
    color: palette.ink[500],
  },
};
