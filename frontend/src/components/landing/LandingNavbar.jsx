import { useState } from 'react';
import { Box, Container, IconButton, Drawer, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import GradientButton from '../common/GradientButton';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        py: 2,
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          className="glass"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 1.5,
            borderRadius: '16px',
          }}
        >
          <Link to="/" aria-label="TeamMeet Home">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HiOutlineVideoCamera size={22} color="#fff" />
              </Box>
              <Box
                component="span"
                sx={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                TeamMeet
              </Box>
            </Box>
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            {navLinks.map((link) => (
              <Box
                key={link.label}
                component="a"
                href={link.href}
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  '&:hover': { color: '#F8FAFC' },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Link to="/auth">
              <GradientButton variant="outlined" size="small" sx={{ px: 2.5 }}>
                Sign In
              </GradientButton>
            </Link>
            <Link to="/auth">
              <GradientButton size="small" sx={{ px: 2.5 }}>
                Get Started
              </GradientButton>
            </Link>
          </Box>

          <IconButton
            sx={{ display: { md: 'none' }, color: '#F8FAFC' }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HiMenuAlt3 size={24} />
          </IconButton>
        </Box>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { bgcolor: '#1E293B', width: 280, p: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <HiX size={24} color="#F8FAFC" />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} sx={{ px: 0 }}>
              <Box
                component="a"
                href={link.href}
                onClick={() => setMobileOpen(false)}
                sx={{ color: '#F8FAFC', fontWeight: 500, py: 1 }}
              >
                {link.label}
              </Box>
            </ListItem>
          ))}
          <ListItem sx={{ px: 0, mt: 2, flexDirection: 'column', gap: 1.5 }}>
            <Link to="/auth" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
              <GradientButton fullWidth variant="outlined">Sign In</GradientButton>
            </Link>
            <Link to="/auth" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
              <GradientButton fullWidth>Get Started</GradientButton>
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
