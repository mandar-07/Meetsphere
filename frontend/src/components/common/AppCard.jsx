import { Card } from '@mui/material';
import { cardSx } from '../../theme/tokens';

export default function AppCard({ children, sx = {}, ...props }) {
  return (
    <Card sx={{ ...cardSx, ...sx }} {...props}>
      {children}
    </Card>
  );
}
