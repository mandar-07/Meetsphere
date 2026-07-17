import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export default function AnimatedBackground({ variant = 'hero' }) {
  const orbs = [
    { size: 400, x: '10%', y: '20%', color: 'rgba(99, 102, 241, 0.15)', delay: 0 },
    { size: 300, x: '70%', y: '10%', color: 'rgba(139, 92, 246, 0.12)', delay: 2 },
    { size: 250, x: '80%', y: '60%', color: 'rgba(6, 182, 212, 0.1)', delay: 4 },
    { size: 350, x: '20%', y: '70%', color: 'rgba(99, 102, 241, 0.08)', delay: 1 },
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {variant === 'hero' && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.2), transparent),
              radial-gradient(ellipse 60% 40% at 100% 50%, rgba(139, 92, 246, 0.1), transparent),
              radial-gradient(ellipse 50% 30% at 0% 80%, rgba(6, 182, 212, 0.08), transparent)
            `,
          }}
        />
      )}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
          style={{
            position: 'absolute',
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </Box>
  );
}
