import React, { useContext, useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Card, CardContent, Grid, Avatar, CircularProgress, IconButton, Tooltip, Alert, Snackbar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import withAuth from '../utils/withAuth';
import { AuthContext } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { cardSx } from '../theme/tokens';

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copySnackbar, setCopySnackbar] = useState(false);
  const { addToUserHistory, getHistoryOfUser, userData } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try { setRecentMeetings(await getHistoryOfUser()); }
      catch { setRecentMeetings([]); }
      finally { setLoading(false); }
    })();
  }, [getHistoryOfUser]);

  const handleJoin = async () => {
    if (!meetingCode.trim()) return;
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  const handleCreate = () => {
    const code = Math.random().toString(36).substring(2, 10);
    setMeetingCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingCode);
    setCopySnackbar(true);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <DashboardLayout>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
          Welcome back{userData?.name ? `, ${userData.name.split(' ')[0]}` : ''}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>Manage your sessions and join calls instantly</Typography>
      </Box>

      <Grid container spacing={3.5} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...cardSx, height: '100%', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <LoginIcon color="primary" sx={{ fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Join Meeting</Typography>
              </Box>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
                Enter a room code below to jump directly into an ongoing video conference session.
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <TextField
                  fullWidth
                  label="Meeting Code"
                  placeholder="e.g. abc-123-xyz"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  sx={{ mb: 2.5 }}
                />
                <Button fullWidth variant="contained" size="large" onClick={handleJoin} disabled={!meetingCode.trim()} sx={{ py: 1.5 }}>
                  Join Meeting
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...cardSx, height: '100%', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <AddIcon color="primary" sx={{ fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Create Meeting</Typography>
              </Box>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
                Generate a unique room identifier code and share it with your participants to start a fresh call.
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {meetingCode && (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.75,
                    borderRadius: 2.5,
                    bgcolor: 'background.default',
                    border: '1px dashed',
                    borderColor: 'divider',
                  }}>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main', fontSize: '1.05rem', ml: 1 }}>{meetingCode}</Typography>
                    <Tooltip title="Copy code">
                      <IconButton size="small" onClick={copyToClipboard} sx={{ color: 'text.secondary' }}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                <Button fullWidth variant="outlined" size="large" color="inherit" onClick={handleCreate} sx={{ py: 1.5 }}>
                  Generate Meeting Code
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            Recent Meetings
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
          ) : recentMeetings.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {recentMeetings.slice(0, 5).map((m, i) => (
                <Card key={i} sx={{ ...cardSx, borderColor: 'divider', transition: 'border-color 150ms', '&:hover': { borderColor: 'primary.main' } }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3, '&:last-child': { pb: 2 } }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, letterSpacing: '0.02em', color: 'text.primary' }}>{m.meetingCode}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25, fontSize: '0.8rem' }}>
                        <CalendarMonthIcon sx={{ fontSize: 13 }} />
                        {formatDate(m.date)}
                      </Typography>
                    </Box>
                    <Button variant="contained" size="small" onClick={() => navigate(`/${m.meetingCode}`)} sx={{ py: 0.75, px: 2 }}>Rejoin</Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card sx={cardSx}>
              <CardContent sx={{ py: 4 }}><Typography color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.9rem' }}>No recent meetings found.</Typography></CardContent>
            </Card>
          )}

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 4.5 }}>Upcoming Meetings</Typography>
          <Card sx={{ ...cardSx, borderColor: 'divider' }}>
            <CardContent sx={{ py: 4.5 }}>
              <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
                No scheduled meetings. Copy a code and share it to get started.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Profile Summary</Typography>
          <Card sx={{ ...cardSx, borderColor: 'divider' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: '1.2rem', fontWeight: 600 }}>{userData?.name?.charAt(0)?.toUpperCase() || 'U'}</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>{userData?.name || 'User'}</Typography>
                  <Typography variant="body2" color="text.secondary">@{userData?.username || 'username'}</Typography>
                </Box>
              </Box>
              <Box sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 2.5, p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" variant="body2">Sessions joined</Typography>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>{recentMeetings.length}</Typography>
              </Box>
              <Button component={Link} to="/profile" fullWidth variant="outlined" color="inherit" sx={{ py: 1 }}>View Full Profile</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={copySnackbar} autoHideDuration={2000} onClose={() => setCopySnackbar(false)}>
        <Alert severity="success" onClose={() => setCopySnackbar(false)} variant="filled" sx={{ width: '100%' }}>Meeting code copied to clipboard!</Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default withAuth(HomeComponent);

