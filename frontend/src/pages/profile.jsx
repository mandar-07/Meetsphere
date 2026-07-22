import React, { useContext, useEffect, useState } from 'react';
import {
  Typography, Card, CardContent, Grid, Avatar, Box, Divider, Button,
  TextField, Alert, Snackbar
} from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { AuthContext } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import { cardSx } from '../theme/tokens';

function Profile() {
  const { userData, getHistoryOfUser, updateUserProfile } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(userData?.avatar || '');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setMeetings(await getHistoryOfUser());
      } catch {
        setMeetings([]);
      }
    })();
  }, [getHistoryOfUser]);

  // Handle local state sync when context changes
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setAvatar(userData.avatar || '');
    }
  }, [userData]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 80 * 1024) {
        setFeedbackMsg("Image size should be less than 80KB (Mongoose payload limit)");
        setFeedbackOpen(true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const msg = await updateUserProfile(name, password || undefined, avatar);
      setFeedbackMsg(msg || "Profile updated successfully!");
      setFeedbackOpen(true);
      setIsEditing(false);
      setPassword('');
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || "Failed to update profile.");
      setFeedbackOpen(true);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>Profile</Typography>
        <Typography color="text.secondary">View and edit your profile details and usage logs</Typography>
      </Box>

      <Grid container spacing={3.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...cardSx, borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3.5 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={avatar}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '1.75rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
                    }}
                  >
                    {!avatar && (userData?.name?.charAt(0)?.toUpperCase() || 'U')}
                  </Avatar>
                  {isEditing && (
                    <Box sx={{ position: 'absolute', right: -4, bottom: -4 }}>
                      <input
                        accept="image/*"
                        id="avatar-upload-file"
                        type="file"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="avatar-upload-file">
                        <Button
                          component="span"
                          sx={{
                            minWidth: 0,
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: '#fff',
                            p: 0,
                            '&:hover': { bgcolor: 'primary.dark' }
                          }}
                        >
                          <PhotoCameraIcon sx={{ fontSize: 16 }} />
                        </Button>
                      </label>
                    </Box>
                  )}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{userData?.name || 'User'}</Typography>
                  <Typography color="text.secondary" variant="body1">@{userData?.username || 'username'}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3.5 }} />

              {!isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" variant="body2">Full Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{userData?.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" variant="body2">Username</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{userData?.username}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" variant="body2">Account Type</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Standard Free Tier</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{ mt: 1.5, py: 1 }}
                  >
                    Edit Details
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={6}>
                      <Button fullWidth variant="outlined" color="inherit" onClick={() => { setIsEditing(false); setName(userData?.name || ''); setAvatar(userData?.avatar || ''); setPassword(''); }}>
                        Cancel
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button type="submit" fullWidth variant="contained" color="primary">
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
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
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {(meetings.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60).toFixed(1)}h
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={feedbackOpen} autoHideDuration={3000} onClose={() => setFeedbackOpen(false)}>
        <Alert severity={feedbackMsg.includes("less than") || feedbackMsg.includes("failed") ? "error" : "success"} onClose={() => setFeedbackOpen(false)} variant="filled" sx={{ width: '100%' }}>
          {feedbackMsg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default withAuth(Profile);
