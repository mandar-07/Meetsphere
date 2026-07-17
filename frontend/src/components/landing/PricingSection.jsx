import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi2';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal use and small teams getting started.',
    features: ['Up to 40 min meetings', '100 participants', 'HD video & audio', 'Screen sharing', 'Chat'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For growing teams that need more power and flexibility.',
    features: ['Unlimited meeting duration', 'Cloud recording', 'Custom backgrounds', 'Priority support', 'Analytics dashboard', 'AI assistant'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Advanced security and admin controls for large organizations.',
    features: ['SSO & SAML', 'Dedicated support', 'Custom branding', 'Advanced analytics', 'Compliance tools', 'SLA guarantee'],
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <Box component="section" id="pricing" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2 }}>
            Pricing
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 700, mb: 2 }}>
            Simple, transparent pricing
          </Typography>
          <Typography sx={{ color: '#94A3B8', maxWidth: 480, mx: 'auto' }}>
            Start free and scale as you grow. No hidden fees.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, alignItems: 'stretch' }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                hover={!plan.highlighted}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  ...(plan.highlighted && {
                    border: '1px solid rgba(99, 102, 241, 0.5)',
                    boxShadow: '0 8px 40px rgba(99, 102, 241, 0.25)',
                  }),
                }}
              >
                {plan.highlighted && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      px: 2,
                      py: 0.5,
                      borderRadius: '20px',
                      bgcolor: '#6366F1',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Most Popular
                  </Box>
                )}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{plan.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}</Typography>
                  <Typography sx={{ color: '#94A3B8' }}>{plan.period}</Typography>
                </Box>
                <Typography sx={{ color: '#94A3B8', mb: 3, fontSize: '0.9rem' }}>{plan.description}</Typography>
                <Box sx={{ flex: 1, mb: 3 }}>
                  {plan.features.map((f) => (
                    <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <HiCheck size={18} color="#22C55E" />
                      <Typography sx={{ fontSize: '0.9rem', color: '#CBD5E1' }}>{f}</Typography>
                    </Box>
                  ))}
                </Box>
                <Link to="/auth">
                  <GradientButton
                    fullWidth
                    variant={plan.highlighted ? 'contained' : 'outlined'}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </GradientButton>
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
