import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/common/GlassCard';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard hover={false} sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h1" sx={{ fontWeight: 800, fontSize: '5rem', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
              404
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Page not found</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</Typography>
            <Button component={Link} to="/" variant="contained" size="large">Back to Home</Button>
          </GlassCard>
        </motion.div>
      </Container>
    </Box>
  );
}
