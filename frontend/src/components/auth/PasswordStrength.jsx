import { Box, LinearProgress, Typography } from '@mui/material';

function getStrength(password = '') {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
  if (/\d/.test(password)) score += 25;
  if (/[^a-zA-Z0-9]/.test(password)) score += 25;
  return score;
}

const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const colors = ['#334155', '#EF4444', '#F59E0B', '#06B6D4', '#22C55E'];

export default function PasswordStrength({ password }) {
  const strength = getStrength(password);
  const index = Math.min(4, Math.floor(strength / 25));

  if (!password) return null;

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: 'rgba(148, 163, 184, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 2,
            bgcolor: colors[index],
            transition: 'all 0.3s ease',
          },
        }}
      />
      <Typography sx={{ fontSize: '0.75rem', color: colors[index], mt: 0.5 }}>
        {labels[index]}
      </Typography>
    </Box>
  );
}
