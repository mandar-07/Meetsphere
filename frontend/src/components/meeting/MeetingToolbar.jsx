import { Box, IconButton, Tooltip, Badge, Divider } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { colors } from '../../theme/tokens';

const controlBtn = (active, muted) => ({
  width: 44,
  height: 44,
  borderRadius: '10px',
  color: muted ? colors.danger : colors.text,
  bgcolor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
  border: `1px solid ${active ? colors.primary : colors.border}`,
  transition: 'all 200ms ease',
  '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.12)' },
});

export default function MeetingToolbar({
  video,
  audio,
  screen,
  screenAvailable,
  newMessages,
  onToggleVideo,
  onToggleAudio,
  onToggleScreen,
  onToggleChat,
  onToggleParticipants,
  onToggleSettings,
  onEndCall,
}) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.5,
        bgcolor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        maxWidth: 'calc(100vw - 32px)',
        overflowX: 'auto',
      }}
    >
      <Tooltip title="Microphone">
        <IconButton onClick={onToggleAudio} sx={controlBtn(audio, !audio)} aria-label="Microphone">
          {audio ? <MicIcon fontSize="small" /> : <MicOffIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Camera">
        <IconButton onClick={onToggleVideo} sx={controlBtn(video, !video)} aria-label="Camera">
          {video ? <VideocamIcon fontSize="small" /> : <VideocamOffIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      {screenAvailable && (
        <Tooltip title="Screen share">
          <IconButton onClick={onToggleScreen} sx={controlBtn(screen, false)} aria-label="Screen share">
            {screen ? <StopScreenShareIcon fontSize="small" /> : <ScreenShareIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      )}
      <Divider orientation="vertical" flexItem sx={{ borderColor: colors.border, mx: 0.5 }} />
      <Tooltip title="Chat">
        <Badge badgeContent={newMessages || null} color="error">
          <IconButton onClick={onToggleChat} sx={controlBtn(false, false)} aria-label="Chat">
            <ChatIcon fontSize="small" />
          </IconButton>
        </Badge>
      </Tooltip>
      <Tooltip title="Participants">
        <IconButton onClick={onToggleParticipants} sx={controlBtn(false, false)} aria-label="Participants">
          <PeopleIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Settings">
        <IconButton onClick={onToggleSettings} sx={controlBtn(false, false)} aria-label="Settings">
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem sx={{ borderColor: colors.border, mx: 0.5 }} />
      <Tooltip title="Leave meeting">
        <IconButton
          onClick={onEndCall}
          aria-label="Leave meeting"
          sx={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            bgcolor: colors.danger,
            color: '#fff',
            '&:hover': { bgcolor: '#DC2626' },
          }}
        >
          <CallEndIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
