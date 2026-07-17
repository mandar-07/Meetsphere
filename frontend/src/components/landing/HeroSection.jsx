import { Box, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiPlay } from 'react-icons/hi2';
import AnimatedBackground from '../common/AnimatedBackground';
import GradientButton from '../common/GradientButton';

export default function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        pt: 12,
        pb: 8,
        overflow: 'hidden',
      }}
    >
      <AnimatedBackground />
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 6,
            alignItems: 'center',
          }}
        >
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  mb: 3,
                  borderRadius: '20px',
                  bgcolor: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontSize: '0.85rem',
                  color: '#818CF8',
                  fontWeight: 500,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#22C55E',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                    },
                  }}
                />
                Enterprise-grade video conferencing
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  letterSpacing: '-0.03em',
                }}
              >
                Connect with your team,{' '}
                <Box component="span" className="gradient-text">
                  anywhere
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: '#94A3B8',
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 520,
                }}
              >
                Crystal-clear HD video, real-time collaboration, and enterprise security.
                The modern way to meet, present, and connect.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5 }}>
                <Link to="/auth">
                  <GradientButton
                    size="large"
                    endIcon={<HiArrowRight size={18} />}
                    sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                  >
                    Start for Free
                  </GradientButton>
                </Link>
                <GradientButton
                  variant="outlined"
                  size="large"
                  startIcon={<HiPlay size={18} />}
                  sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                >
                  Watch Demo
                </GradientButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[
                  { value: '10M+', label: 'Meetings hosted' },
                  { value: '99.9%', label: 'Uptime SLA' },
                  { value: '150+', label: 'Countries' },
                ].map((stat) => (
                  <Box key={stat.label}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                className="glass"
                sx={{
                  width: '100%',
                  maxWidth: 520,
                  aspectRatio: '4/3',
                  borderRadius: '24px',
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1.5,
                    height: '100%',
                  }}
                >
                  {['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E'].map((color, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        borderRadius: 16,
                        background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
                        border: `1px solid ${color}30`,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 12,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </Box>
                    </motion.div>
                  ))}
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: '12px',
                    bgcolor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                >
                  {['Mic', 'Cam', 'Share', 'Chat'].map((tool) => (
                    <Box
                      key={tool}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: 'rgba(99, 102, 241, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        color: '#94A3B8',
                        fontWeight: 500,
                      }}
                    >
                      {tool}
                    </Box>
                  ))}
                </Box>
              </Box>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -10,
                  padding: '12px 20px',
                  borderRadius: 12,
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#22C55E',
                }}
              >
                HD Quality
              </motion.div>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
