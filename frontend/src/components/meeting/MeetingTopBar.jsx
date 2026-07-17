import { Box, Typography, Chip } from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { colors } from '../../theme/tokens';

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MeetingTopBar({ meetingCode, elapsed, participantCount, isOnline = true }) {
  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      bgcolor: colors.surface, borderBottom: `1px solid ${colors.border}`,
      px: 3, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>{meetingCode || 'Meeting'}</Typography>
        <Chip
          icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: `${colors.success} !important` }} />}
          label="Live"
          size="small"
          sx={{ bgcolor: 'rgba(34, 197, 94, 0.12)', color: colors.success, border: `1px solid rgba(34, 197, 94, 0.25)` }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{formatTimer(elapsed)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">{participantCount} in call</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SignalCellularAltIcon sx={{ fontSize: 18, color: isOnline ? 'success.main' : 'error.main' }} />
          <Typography variant="caption" color="text.secondary">{isOnline ? 'Connected' : 'Offline'}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
