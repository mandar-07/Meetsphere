import { useState } from 'react';
import { Box, Container, Typography, Collapse } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';
import GlassCard from '../common/GlassCard';

const faqs = [
  {
    q: 'How many participants can join a meeting?',
    a: 'Free plans support up to 100 participants. Pro and Enterprise plans support unlimited participants with optimized performance.',
  },
  {
    q: 'Is my data encrypted?',
    a: 'Yes. All meetings use end-to-end encryption. We never store or access your meeting content without explicit consent.',
  },
  {
    q: 'Can I record meetings?',
    a: 'Cloud recording is available on Pro and Enterprise plans. Recordings are stored securely and can be shared with your team.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Our Free plan is available forever with no credit card required. Pro plans include a 14-day free trial.',
  },
  {
    q: 'What browsers are supported?',
    a: 'TeamMeet works on Chrome, Firefox, Safari, and Edge. We recommend the latest version for the best experience.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Box component="section" id="faq" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2 }}>
            FAQ
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 700 }}>
            Frequently asked questions
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard hover={false} padding={0} sx={{ overflow: 'hidden' }}>
                <Box
                  component="button"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2.5,
                    bgcolor: 'transparent',
                    border: 'none',
                    color: '#F8FAFC',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  aria-expanded={openIndex === index}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>{faq.q}</Typography>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiChevronDown size={22} color="#94A3B8" />
                  </motion.div>
                </Box>
                <Collapse in={openIndex === index}>
                  <Box sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                    <Typography sx={{ color: '#94A3B8', lineHeight: 1.7 }}>{faq.a}</Typography>
                  </Box>
                </Collapse>
              </GlassCard>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
