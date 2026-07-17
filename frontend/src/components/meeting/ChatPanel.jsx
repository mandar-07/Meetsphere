import { useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Drawer } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../theme/tokens';

export default function ChatPanel({ open, onClose, messages, message, onMessageChange, onSend, username }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 360 },
          bgcolor: colors.surface,
          borderLeft: `1px solid ${colors.border}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: `1px solid ${colors.border}` }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Chat</Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close chat"><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.length === 0 ? (
            <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', py: 4 }}>
              No messages yet
            </Typography>
          ) : (
            messages.map((item, i) => {
              const isOwn = item.sender === username;
              return (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>{item.sender}</Typography>
                  <Box
                    sx={{
                      maxWidth: '85%',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: isOwn ? colors.primary : colors.background,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <Typography variant="body2">{item.data}</Typography>
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={chatEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={message}
            onChange={onMessageChange}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
          />
          <IconButton onClick={onSend} disabled={!message?.trim()} color="primary" aria-label="Send">
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}
