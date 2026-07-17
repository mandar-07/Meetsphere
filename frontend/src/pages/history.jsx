import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import { cardSx } from '../theme/tokens';

function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { setMeetings(await getHistoryOfUser()); } catch { setMeetings([]); }
      finally { setLoading(false); }
    })();
  }, [getHistoryOfUser]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Meeting History</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Past sessions you participated in</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : meetings.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {meetings.map((m, i) => (
            <Card key={i} sx={cardSx}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{m.meetingCode}</Typography>
                  <Typography variant="body2" color="text.secondary">{formatDate(m.date)}</Typography>
                </Box>
                <Button variant="contained" size="small" onClick={() => navigate(`/${m.meetingCode}`)}>Rejoin</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Card sx={cardSx}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>No meeting history yet</Typography>
            <Button variant="contained" onClick={() => navigate('/home')}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

export default withAuth(History);
