import {
  AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, Divider
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { AuthContext } from '../../contexts/AuthContext';
import { colors } from '../../theme/tokens';

const navLinks = [
  { path: '/home', label: 'Dashboard' },
  { path: '/history', label: 'History' },
  { path: '/profile', label: 'Profile' },
  { path: '/settings', label: 'Settings' },
];

export default function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const linkSx = (active) => ({
    color: active ? colors.text : colors.textSecondary,
    backgroundColor: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    borderRadius: '8px',
    px: 2,
    py: 0.75,
    fontSize: '0.875rem',
    textTransform: 'none',
    transition: 'all 200ms ease',
    '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.06)', color: colors.text },
  });

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton sx={{ display: { md: 'none' }, color: 'text.primary' }} onClick={() => setMobileOpen(true)} aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <VideocamOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography component={Link} to="/home" variant="h6" sx={{ fontWeight: 700, color: 'text.primary', textDecoration: 'none', letterSpacing: '-0.01em' }}>
              MeetSphere
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navLinks.map((l) => (
              <Button key={l.path} component={Link} to={l.path} sx={linkSx(location.pathname === l.path)}>{l.label}</Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: 'primary.main', color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <IconButton onClick={handleLogout} aria-label="Logout" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 260 } }}>
        <List sx={{ width: '100%', pt: 2, px: 1.5, bgcolor: 'background.default', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1.5, mb: 2 }}>
            <VideocamOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>MeetSphere</Typography>
          </Box>
          {navLinks.map((l) => (
            <ListItemButton key={l.path} component={Link} to={l.path} selected={location.pathname === l.path} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2, mb: 0.5, py: 1 }}>
              <ListItemText primary={l.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: location.pathname === l.path ? 600 : 500 }} />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 2, borderColor: 'divider' }} />
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, py: 1, color: 'error.main', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' } }}><ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} /></ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
