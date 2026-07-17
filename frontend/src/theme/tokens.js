export const colors = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#6366F1',
  success: '#22C55E',
  danger: '#EF4444',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
};

export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.2)',
  md: '0 4px 16px rgba(0, 0, 0, 0.24)',
};

export const cardSx = {
  bgcolor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: '14px',
  boxShadow: shadows.sm,
};

export const glassSx = (overrides = {}) => ({
  bgcolor: colors.surface,
  border: `1px solid ${colors.border}`,
  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
  borderRadius: '12px',
  ...overrides,
});

