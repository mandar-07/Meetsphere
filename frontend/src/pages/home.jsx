import React, { useContext, useState, useEffect } from 'react';
import {
  Box, TextField, Typography, Button, Card, CardContent, Grid, Avatar,
  CircularProgress, IconButton, Tooltip, Alert, Snackbar, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import withAuth from '../utils/withAuth';
import { AuthContext } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { cardSx } from '../theme/tokens';

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  const [meetingsList, setMeetingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copySnackbar, setCopySnackbar] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedName, setSchedName] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [schedCode, setSchedCode] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const { addToUserHistory, getHistoryOfUser, userData, scheduleNewMeeting } = useContext(AuthContext);

  const fetchMeetings = async () => {
    try {
      const data = await getHistoryOfUser();
      setMeetingsList(data || []);
    } catch (e) {
      setMeetingsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleJoin = async () => {
    if (!meetingCode.trim()) return;
    try {
      // Find if there is an existing meeting name, else default
      await addToUserHistory(meetingCode, `Session ${meetingCode}`);
      navigate(`/${meetingCode}`);
    } catch (e) {
      navigate(`/${meetingCode}`);
    }
  };

  const handleCreate = () => {
    const code = Math.random().toString(36).substring(2, 10);
    setMeetingCode(code);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySnackbar(true);
  };

  const openScheduleDialog = () => {
    const code = Math.random().toString(36).substring(2, 10);
    setSchedCode(code);
    setSchedName('');
    // Default to current time + 1 hour in local timezone format
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() + 1);
    defaultDate.setMinutes(0);
    const offset = defaultDate.getTimezoneOffset();
    const localISO = new Date(defaultDate.getTime() - offset * 60000).toISOString().slice(0, 16);
    setSchedTime(localISO);
    setScheduleOpen(true);
  };

  const handleScheduleSubmit = async () => {
    if (!schedName.trim() || !schedTime) return;
    try {
      await scheduleNewMeeting(schedCode, schedName, new Date(schedTime).toISOString());
      setScheduleOpen(false);
      setFeedbackMsg("Meeting scheduled successfully!");
      setFeedbackOpen(true);
      fetchMeetings();
    } catch (err) {
      setFeedbackMsg("Failed to schedule meeting.");
      setFeedbackOpen(true);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Separate meeting history from scheduled/upcoming meetings
  const recentMeetings = meetingsList.filter(m => m.status === 'completed' || (!m.scheduledAt && m.status === 'active'));
  const upcomingMeetings = meetingsList.filter(m => m.scheduledAt && m.status === 'active' && new Date(m.scheduledAt) > new Date());

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
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Create & Schedule</Typography>
              </Box>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
                Generate a meeting code instantly or schedule a future conference for your team.
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
                      <IconButton size="small" onClick={() => copyToClipboard(meetingCode)} sx={{ color: 'text.secondary' }}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Button fullWidth variant="outlined" color="inherit" onClick={handleCreate} sx={{ py: 1.5 }}>
                      Instant Code
                    </Button>
                  </Grid>
                  <Grid size={6}>
                    <Button fullWidth variant="contained" color="secondary" onClick={openScheduleDialog} sx={{ py: 1.5 }}>
                      Schedule Call
                    </Button>
                  </Grid>
                </Grid>
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
                      <Typography sx={{ fontWeight: 600, letterSpacing: '0.02em', color: 'text.primary' }}>{m.meetingName || m.meetingCode}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25, fontSize: '0.8rem' }}>
                        <CalendarMonthIcon sx={{ fontSize: 13 }} />
                        {formatDate(m.date)} {m.duration > 0 && `• ${m.duration} mins`}
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

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 4.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            Upcoming Meetings
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
          ) : upcomingMeetings.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {upcomingMeetings.map((m, i) => (
                <Card key={i} sx={{ ...cardSx, borderColor: 'divider' }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: 3, '&:last-child': { pb: 2 } }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{m.meetingName}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25, fontSize: '0.8rem' }}>
                        <CalendarMonthIcon sx={{ fontSize: 13 }} />
                        {formatDate(m.scheduledAt)} at {formatTime(m.scheduledAt)} • Code: {m.meetingCode}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => copyToClipboard(m.meetingCode)} sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <Button variant="contained" color="success" size="small" onClick={() => navigate(`/${m.meetingCode}`)}>Start</Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card sx={{ ...cardSx, borderColor: 'divider' }}>
              <CardContent sx={{ py: 4.5 }}>
                <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
                  No scheduled meetings. Click "Schedule Call" to book one.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Profile Summary</Typography>
          <Card sx={{ ...cardSx, borderColor: 'divider' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  src={userData?.avatar || ""}
                  sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: '1.2rem', fontWeight: 600 }}
                >
                  {!userData?.avatar && (userData?.name?.charAt(0)?.toUpperCase() || 'U')}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>{userData?.name || 'User'}</Typography>
                  <Typography variant="body2" color="text.secondary">@{userData?.username || 'username'}</Typography>
                </Box>
              </Box>
              <Box sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 2.5, p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" variant="body2">Sessions joined</Typography>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>{meetingsList.length}</Typography>
              </Box>
              <Button component={Link} to="/profile" fullWidth variant="outlined" color="inherit" sx={{ py: 1 }}>View Full Profile</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Schedule Meeting Dialog */}
      <Dialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 4, width: 400 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Schedule Meeting</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          <TextField
            fullWidth
            label="Meeting Name"
            placeholder="e.g. Weekly Sync"
            value={schedName}
            onChange={(e) => setSchedName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Schedule Date & Time"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            value={schedTime}
            onChange={(e) => setSchedTime(e.target.value)}
          />
          <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'background.default', border: '1px dashed', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Generated Meeting Code</Typography>
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main', fontSize: '1rem' }}>{schedCode}</Typography>
            </Box>
            <Tooltip title="Copy code">
              <IconButton size="small" onClick={() => copyToClipboard(schedCode)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setScheduleOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleScheduleSubmit} variant="contained" disabled={!schedName.trim() || !schedTime}>Schedule</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={copySnackbar} autoHideDuration={2000} onClose={() => setCopySnackbar(false)}>
        <Alert severity="success" onClose={() => setCopySnackbar(false)} variant="filled" sx={{ width: '100%' }}>Meeting code copied to clipboard!</Alert>
      </Snackbar>

      <Snackbar open={feedbackOpen} autoHideDuration={3000} onClose={() => setFeedbackOpen(false)}>
        <Alert severity={feedbackMsg.includes("failed") || feedbackMsg.includes("Failed") ? "error" : "success"} onClose={() => setFeedbackOpen(false)} variant="filled" sx={{ width: '100%' }}>
          {feedbackMsg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default withAuth(HomeComponent);
