import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const MotionButton = motion.create(Button);

export default function GradientButton({
  children,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  startIcon,
  endIcon,
  sx = {},
  ...props
}) {
  return (
    <MotionButton
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        background: variant === 'contained' ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
        border: variant === 'outlined' ? '1px solid rgba(99, 102, 241, 0.5)' : 'none',
        color: '#F8FAFC',
        fontWeight: 600,
        borderRadius: '10px',
        px: 3,
        py: 1.2,
        boxShadow: variant === 'contained' ? '0 4px 20px rgba(99, 102, 241, 0.35)' : 'none',
        '&:hover': {
          background: variant === 'contained'
            ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
            : 'rgba(99, 102, 241, 0.1)',
          filter: variant === 'contained' ? 'brightness(1.1)' : 'none',
          boxShadow: variant === 'contained' ? '0 6px 28px rgba(99, 102, 241, 0.45)' : 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}
