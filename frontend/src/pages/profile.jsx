import React, { useContext, useEffect, useState } from 'react';
import { Typography, Card, CardContent, Grid, Avatar, Box, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { AuthContext } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import { cardSx } from '../theme/tokens';

function Profile() {
  const { userData, getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    (async () => {
      try { setMeetings(await getHistoryOfUser()); } catch { setMeetings([]); }
    })();
  }, [getHistoryOfUser]);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>Profile</Typography>
        <Typography color="text.secondary">View your profile details and usage logs</Typography>
      </Box>
      <Grid container spacing={3.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...cardSx, borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3.5 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '1.75rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                  {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{userData?.name || 'User'}</Typography>
                  <Typography color="text.secondary" variant="body1">@{userData?.username || 'username'}</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 3.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="body2">Account Type</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Standard Free Tier</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="body2">Account Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>Active</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...cardSx, borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                <QueryStatsIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Activity Statistics</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <Typography color="text.secondary" variant="body2">Meetings attended</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>{meetings.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <Typography color="text.secondary" variant="body2">Hours in call</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>{(meetings.length * 0.4).toFixed(1)}h</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default withAuth(Profile);

