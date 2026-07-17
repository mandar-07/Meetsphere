import { Box, Typography, Avatar, IconButton, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../theme/tokens';

export default function ParticipantsPanel({ open, onClose, username, videos, participantCount }) {
  const participants = [
    { id: 'local', name: username || 'You', isYou: true },
    ...videos.map((v, i) => ({ id: v.socketId, name: `Participant ${i + 1}`, isYou: false })),
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 320 },
          bgcolor: colors.surface,
          borderLeft: `1px solid ${colors.border}`,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Participants ({participantCount})</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {participants.map((p) => (
          <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, bgcolor: colors.background, border: `1px solid ${colors.border}` }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: colors.primary, fontSize: '0.85rem' }}>
              {p.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{p.name}{p.isYou ? ' (You)' : ''}</Typography>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}
