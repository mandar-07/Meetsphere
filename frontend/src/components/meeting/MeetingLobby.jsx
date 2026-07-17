import { Box, Typography, Button, TextField, Card, CardContent, Grid, Container, IconButton } from '@mui/material';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import { cardSx } from '../../theme/tokens';

export default function MeetingLobby({ username, setUsername, onConnect, localVideoRef }) {
  const roomName = window.location.pathname.substring(1) || 'Global Room';

  const handleBack = () => {
    window.location.href = '/home';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      bgcolor: 'background.default',
      py: 6,
      px: 2,
      position: 'relative'
    }}>
      <Box sx={{ position: 'absolute', top: 24, left: 24 }}>
        <Button onClick={handleBack} startIcon={<KeyboardBackspaceIcon />} sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { color: 'text.primary', backgroundColor: 'rgba(255,255,255,0.03)' } }}>Back to Dashboard</Button>
      </Box>

      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Check your video & audio</Typography>
              <Box sx={{
                aspectRatio: '16/9',
                borderRadius: '16px',
                overflow: 'hidden',
                bgcolor: '#0F172A',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                position: 'relative',
              }}>
                <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1.5,
                  bgcolor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  p: 1,
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <IconButton size="small" sx={{ color: 'text.primary', bgcolor: 'rgba(255,255,255,0.06)' }}><MicIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: 'text.primary', bgcolor: 'rgba(255,255,255,0.06)' }}><VideocamIcon fontSize="small" /></IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ ...cardSx, borderColor: 'divider', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              <CardContent sx={{ p: 4.5 }}>
                <Box sx={{ mb: 3 }}>
                  <VideocamOutlinedIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Ready to join?</Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                    Room: <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main' }}>{roomName}</Box>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Display Name"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && username.trim() && onConnect()}
                  sx={{ mb: 2.5 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={onConnect}
                  disabled={!username.trim()}
                  sx={{ py: 1.5 }}
                >
                  Join Meeting
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
