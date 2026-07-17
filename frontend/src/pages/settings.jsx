import { Typography, Card, CardContent, Switch, FormControlLabel, Divider, Box } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import withAuth from '../utils/withAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import { cardSx } from '../theme/tokens';

function Settings() {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>Settings</Typography>
        <Typography color="text.secondary">Manage your client settings and notifications</Typography>
      </Box>

      <Card sx={{ ...cardSx, maxWidth: 640, borderColor: 'divider' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
            <DarkModeIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Appearance</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>Dark Mode</Typography>
              <Typography variant="caption" color="text.secondary">MeetSphere uses dark mode by default for visual ease.</Typography>
            </Box>
            <Switch defaultChecked disabled />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
            <NotificationsActiveIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Notifications</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>Meeting Reminders</Typography>
                <Typography variant="caption" color="text.secondary">Receive popup alarms before scheduled calls begin.</Typography>
              </Box>
              <Switch defaultChecked />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>Chat Notifications</Typography>
                <Typography variant="caption" color="text.secondary">Play a subtle chime sound for incoming chat texts.</Typography>
              </Box>
              <Switch />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 1.5, p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
            <InfoOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20, mt: 0.25 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
              Hardware device settings (such as selecting camera, microphone, and speakers) are configurable during an active meeting using the control panel controls.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default withAuth(Settings);

