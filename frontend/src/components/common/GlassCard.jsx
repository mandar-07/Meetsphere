import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { glassSx } from '../../theme/tokens';

const MotionBox = motion.create(Box);

export default function GlassCard({ children, sx = {}, hover = false, padding = 3, ...props }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2 } : undefined}
      sx={{ ...glassSx({ p: padding }), ...sx }}
      {...props}
    >
      {children}
    </MotionBox>
  );
}
