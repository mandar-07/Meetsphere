import { Box, Container, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi2';
import GlassCard from '../common/GlassCard';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VP Engineering, TechFlow',
    avatar: 'SC',
    content: 'TeamMeet transformed how our distributed team collaborates. The video quality is exceptional and the interface is intuitive.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Lead, InnovateCo',
    avatar: 'MJ',
    content: 'We switched from three different tools to TeamMeet. Screen sharing, chat, and recordings in one place — game changer.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'CEO, StartupHub',
    avatar: 'ER',
    content: 'The security features give us confidence for client meetings. Enterprise-grade without the enterprise price tag.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <Box component="section" id="testimonials" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2 }}>
            Testimonials
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 700, mb: 2 }}>
            Loved by teams worldwide
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HiStar key={i} size={18} color="#F59E0B" />
                  ))}
                </Box>
                <Typography sx={{ color: '#CBD5E1', lineHeight: 1.7, mb: 3, fontStyle: 'italic' }}>
                  &ldquo;{t.content}&rdquo;
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#6366F1', width: 44, height: 44, fontWeight: 600 }}>
                    {t.avatar}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{t.name}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>{t.role}</Typography>
                  </Box>
                </Box>
              </GlassCard>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
