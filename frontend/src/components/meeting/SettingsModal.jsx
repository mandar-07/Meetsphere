import { Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../theme/tokens';

export default function SettingsModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Meeting Settings
        <IconButton onClick={onClose} size="small" aria-label="Close"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 3 }}>
        <FormControl fullWidth size="small"><InputLabel>Camera</InputLabel><Select label="Camera" defaultValue="default"><MenuItem value="default">Default Camera</MenuItem></Select></FormControl>
        <FormControl fullWidth size="small"><InputLabel>Microphone</InputLabel><Select label="Microphone" defaultValue="default"><MenuItem value="default">Default Microphone</MenuItem></Select></FormControl>
        <FormControl fullWidth size="small"><InputLabel>Speaker</InputLabel><Select label="Speaker" defaultValue="default"><MenuItem value="default">Default Speaker</MenuItem></Select></FormControl>
        <FormControlLabel control={<Switch defaultChecked />} label="Noise suppression" />
        <FormControlLabel control={<Switch defaultChecked />} label="Echo cancellation" />
      </DialogContent>
    </Dialog>
  );
}
