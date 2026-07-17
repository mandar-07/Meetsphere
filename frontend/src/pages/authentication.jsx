import * as React from 'react';
import { Box, TextField, Typography, Snackbar, Alert, Button, Tabs, Tab, Container, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { AuthContext } from '../contexts/AuthContext';
import { cardSx } from '../theme/tokens';

export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
    try {
      setError('');
      if (formState === 0) await handleLogin(username, password);
      if (formState === 1) {
        const result = await handleRegister(name, username, password);
        setUsername(''); setMessage(result); setOpen(true); setError('');
        setFormState(0); setPassword(''); setName('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      bgcolor: 'background.default',
      position: 'relative',
      py: 6,
      px: 2
    }}>
      <Box sx={{ position: 'absolute', top: 24, left: 24 }}>
        <Button component={Link} to="/" startIcon={<KeyboardBackspaceIcon />} sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { color: 'text.primary', backgroundColor: 'rgba(255,255,255,0.03)' } }}>Back to home</Button>
      </Box>

      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <VideocamOutlinedIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1.5 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>MeetSphere</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.9rem' }}>Join the future of clean browser video calling</Typography>
        </Box>

        <Card sx={{ ...cardSx, border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 32px rgba(0,0,0,0.24)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            <Tabs
              value={formState}
              onChange={(_, v) => { setFormState(v); setError(''); }}
              variant="fullWidth"
              sx={{
                mb: 3.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', py: 1.5 },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAuth(); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
              {formState === 1 && (
                <TextField required fullWidth label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              )}
              <TextField required fullWidth label="Username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus={formState === 0} />
              <TextField required fullWidth label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 0.5, fontWeight: 500, fontSize: '0.85rem' }} role="alert">
                  {error}
                </Typography>
              )}

              <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 1.5, py: 1.5, fontSize: '0.975rem', fontWeight: 600 }} onClick={handleAuth}>
                {formState === 0 ? 'Sign In' : 'Create Account'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity="success" onClose={() => setOpen(false)} variant="filled" sx={{ width: '100%' }}>{message}</Alert>
      </Snackbar>
    </Box>
  );
}
