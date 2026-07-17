import { createTheme } from '@mui/material/styles';
import { colors, shadows } from './tokens';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colors.primary, light: '#818CF8', dark: '#4F46E5' },
    background: { default: colors.background, paper: colors.surface },
    text: { primary: colors.text, secondary: colors.textSecondary },
    success: { main: colors.success },
    error: { main: colors.danger },
    divider: colors.border,
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  transitions: { duration: { shortest: 150, short: 200, standard: 250 } },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: colors.background, color: colors.text } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          transition: 'background-color 200ms, border-color 200ms, transform 200ms',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
        },
        contained: {
          backgroundColor: colors.primary,
          color: colors.text,
          '&:hover': { backgroundColor: '#4F46E5' },
        },
        outlined: {
          borderColor: colors.border,
          color: colors.text,
          '&:hover': { borderColor: colors.primary, backgroundColor: 'rgba(99, 102, 241, 0.08)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: colors.background,
            transition: 'border-color 200ms',
            '& fieldset': { borderColor: colors.border },
            '&:hover fieldset': { borderColor: '#475569' },
            '&.Mui-focused fieldset': { borderColor: colors.primary },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          boxShadow: shadows.sm,
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none', backgroundColor: colors.surface } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: colors.surface, borderLeft: `1px solid ${colors.border}` },
      },
    },
    MuiTabs: {
      styleOverrides: { indicator: { backgroundColor: colors.primary, height: 2 } },
    },
  },
});

export { colors };
