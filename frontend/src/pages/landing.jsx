import { AppBar, Box, Button, Card, CardContent, Container, Grid, Toolbar, Typography, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import MicIcon from '@mui/icons-material/Mic';
import { cardSx } from '../theme/tokens';

const features = [
  { icon: VideocamOutlinedIcon, title: 'Video Conferencing', desc: 'High-definition video calls directly in your browser with no installations.' },
  { icon: ScreenShareOutlinedIcon, title: 'Screen Sharing', desc: 'Share your slides, document workspace, or browser windows in one click.' },
  { icon: ChatOutlinedIcon, title: 'In-call Messages', desc: 'Exchange links and text notes instantly without interrupting the conversation.' },
  { icon: GroupsOutlinedIcon, title: 'Secure Meetings', desc: 'Join securely using encrypted room links and strict local privacy permissions.' },
];

const mockParticipants = [
  { name: 'Sarah Miller', avatar: 'S', color: '#6366F1' },
  { name: 'Marcus Chen', avatar: 'M', color: '#10B981' },
  { name: 'Elena Rostova', avatar: 'E', color: '#F59E0B' },
  { name: 'You', avatar: 'Y', color: '#8B5CF6' }
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 }, minHeight: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <VideocamOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>MeetSphere</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button component={Link} to="/auth" variant="text" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>Sign In</Button>
            <Button component={Link} to="/auth" variant="contained">Get Started</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 14 }, pb: { xs: 10, md: 16 }, flex: 1 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h1" sx={{ fontWeight: 800, mb: 2.5, lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.75rem' }, letterSpacing: '-0.03em' }}>
              Web meetings,<br />
              <Box component="span" sx={{ color: 'primary.main' }}>done beautifully.</Box>
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4.5, fontSize: '1.125rem', maxWidth: 490, lineHeight: 1.75 }}>
              MeetSphere is a minimal, blazing-fast video conferencing tool built for modern teams. Connect instantly without installation or sign-ups.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button component={Link} to="/auth" variant="contained" size="large" sx={{ px: 4, py: 1.5, fontSize: '1rem' }}>Start a Meeting</Button>
              <Button component={Link} to="/auth" variant="outlined" size="large" sx={{ px: 4, py: 1.5, fontSize: '1rem' }}>Sign In</Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ ...cardSx, p: 1.5, backgroundColor: 'background.paper', borderColor: 'divider', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
              <Grid container spacing={1.5}>
                {mockParticipants.map((p, idx) => (
                  <Grid key={idx} size={6}>
                    <Box sx={{
                      aspectRatio: '16/10',
                      borderRadius: '12px',
                      bgcolor: '#0F172A',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Avatar sx={{ bgcolor: p.color, width: 44, height: 44, fontSize: '1.25rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>{p.avatar}</Avatar>
                      <Box sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(8px)',
                        px: 1,
                        py: 0.5,
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.75rem' }}>{p.name}</Typography>
                        <MicIcon sx={{ fontSize: 12, color: 'success.main' }} />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: '#111C35', py: { xs: 8, md: 12 }, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 1, letterSpacing: '-0.02em' }}>Features built for productivity</Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 7, fontSize: '1.05rem' }}>Everything you need for clean, uninterrupted communication</Typography>
          <Grid container spacing={3.5}>
            {features.map((f) => (
              <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ ...cardSx, height: '100%', transition: 'all 200ms ease', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <f.icon sx={{ color: 'primary.main', mb: 2, fontSize: 32 }} />
                    <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1.05rem', fontWeight: 700 }}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 5, bgcolor: 'background.default', borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} MeetSphere. Built for teams everywhere.</Typography>
        </Container>
      </Box>
    </Box>
  );
}
