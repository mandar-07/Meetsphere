import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  HiOutlineVideoCamera,
  HiOutlineShieldCheck,
  HiOutlineChatBubbleLeftRight,
  HiOutlineComputerDesktop,
  HiOutlineUsers,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import GlassCard from '../common/GlassCard';

const features = [
  {
    icon: HiOutlineVideoCamera,
    title: 'HD Video & Audio',
    description: 'Crystal-clear 1080p video with adaptive bitrate and noise suppression for professional meetings.',
    color: '#6366F1',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, waiting rooms, and host controls to keep your meetings secure.',
    color: '#22C55E',
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'Real-time Chat',
    description: 'Slack-like messaging with reactions, file sharing, and pinned messages during calls.',
    color: '#06B6D4',
  },
  {
    icon: HiOutlineComputerDesktop,
    title: 'Screen Sharing',
    description: 'Share your entire screen or specific windows with smooth, low-latency streaming.',
    color: '#8B5CF6',
  },
  {
    icon: HiOutlineUsers,
    title: 'Up to 100 Participants',
    description: 'Gallery view, speaker view, and adaptive layouts for meetings of any size.',
    color: '#F59E0B',
  },
  {
    icon: HiOutlineSparkles,
    title: 'AI Assistant',
    description: 'Smart meeting summaries, live transcription, and intelligent noise cancellation.',
    color: '#EC4899',
  },
];

export default function FeaturesSection() {
  return (
    <Box
      component="section"
      id="features"
      sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#6366F1',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              mb: 2,
            }}
          >
            Features
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 700,
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Everything you need to collaborate
          </Typography>
          <Typography sx={{ color: '#94A3B8', maxWidth: 560, mx: 'auto', fontSize: '1.1rem' }}>
            Powerful features designed for modern teams. From quick standups to all-hands meetings.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard sx={{ height: '100%' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: `${feature.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <feature.icon size={24} color={feature.color} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: '#94A3B8', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {feature.description}
                </Typography>
              </GlassCard>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
