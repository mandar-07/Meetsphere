import { Box, Container, Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { HiOutlineVideoCamera } from 'react-icons/hi2';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Security', 'Integrations'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Resources: ['Documentation', 'Help Center', 'API', 'Status'],
  Legal: ['Privacy', 'Terms', 'Cookies'],
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        bgcolor: 'rgba(15, 23, 42, 0.5)',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' },
            gap: 4,
            mb: 6,
          }}
        >
          <Box>
            <Link to="/">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HiOutlineVideoCamera size={20} color="#fff" />
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>TeamMeet</Typography>
              </Box>
            </Link>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280 }}>
              Enterprise-grade video conferencing for modern teams. Connect, collaborate, and create together.
            </Typography>
          </Box>

          {Object.entries(footerLinks).map(([category, links]) => (
            <Box key={category}>
              <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>{category}</Typography>
              {links.map((link) => (
                <Typography
                  key={link}
                  component="a"
                  href="#"
                  sx={{
                    display: 'block',
                    color: '#94A3B8',
                    fontSize: '0.85rem',
                    mb: 1,
                    transition: 'color 0.2s',
                    '&:hover': { color: '#F8FAFC' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)', mb: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ color: '#64748B', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} TeamMeet. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <Typography
                key={social}
                component="a"
                href="#"
                sx={{ color: '#64748B', fontSize: '0.85rem', '&:hover': { color: '#94A3B8' } }}
              >
                {social}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
