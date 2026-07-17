import {
  Box,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const navItems = [
  { path: '/home', label: 'Dashboard', icon: HomeOutlinedIcon },
  { path: '/history', label: 'History', icon: HistoryOutlinedIcon },
  { path: '/profile', label: 'Profile', icon: PersonOutlinedIcon },
];

const SIDEBAR_WIDTH = 240;

function SidebarContent({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <VideocamOutlinedIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          MeetSphere
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActive}
              onClick={onNavigate}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
            {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {userData?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {userData?.username || 'username'}
            </Typography>
          </Box>
        </Box>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default function DashboardSidebar({ mobileOpen, onMobileClose, onMobileOpen }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton onClick={onMobileOpen} aria-label="Open menu">
            <MenuIcon />
          </IconButton>
          <VideocamOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            MeetSphere
          </Typography>
        </Box>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={onMobileClose}
          PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}
        >
          <SidebarContent onNavigate={onMobileClose} />
        </Drawer>
      </>
    );
  }

  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <SidebarContent />
    </Box>
  );
}
