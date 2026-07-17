import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = '#6366F1', trend }) {
  return (
    <GlassCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mb: 1 }}>{title}</Typography>
          <Typography sx={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
          {subtitle && (
            <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mt: 0.5 }}>{subtitle}</Typography>
          )}
          {trend && (
            <Typography sx={{ fontSize: '0.8rem', color: trend > 0 ? '#22C55E' : '#EF4444', mt: 0.5 }}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} color={color} />
        </Box>
      </Box>
    </GlassCard>
  );
}
