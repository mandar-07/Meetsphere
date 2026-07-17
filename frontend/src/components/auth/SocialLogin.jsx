import { Box, Typography } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaMicrosoft } from 'react-icons/fa';

const providers = [
  { name: 'Google', icon: FcGoogle },
  { name: 'Microsoft', icon: FaMicrosoft, color: '#00A4EF' },
  { name: 'GitHub', icon: FaGithub, color: '#F8FAFC' },
];

export default function SocialLogin() {
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(148, 163, 184, 0.2)' }} />
        <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>or continue with</Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(148, 163, 184, 0.2)' }} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {providers.map((p) => (
          <Box
            key={p.name}
            component="button"
            type="button"
            aria-label={`Sign in with ${p.name}`}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 1.2,
              borderRadius: '10px',
              bgcolor: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              color: '#F8FAFC',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
              },
            }}
          >
            <p.icon size={20} color={p.color} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {p.name}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
