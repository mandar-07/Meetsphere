import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { HiOutlineVideoCamera, HiOutlineClock } from 'react-icons/hi2';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date();

export default function CalendarWidget() {
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <GlassCard>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Calendar
      </Typography>
      <Typography sx={{ fontSize: '0.9rem', color: '#94A3B8', mb: 2 }}>{currentMonth}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 2 }}>
        {days.map((d) => (
          <Typography key={d} sx={{ fontSize: '0.7rem', color: '#64748B', textAlign: 'center', py: 0.5 }}>
            {d}
          </Typography>
        ))}
        {cells.map((day, i) => (
          <Box
            key={i}
            sx={{
              aspectRatio: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              fontSize: '0.8rem',
              bgcolor: day === today.getDate() ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              color: day === today.getDate() ? '#F8FAFC' : day ? '#94A3B8' : 'transparent',
              fontWeight: day === today.getDate() ? 600 : 400,
            }}
          >
            {day}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '10px', bgcolor: 'rgba(99, 102, 241, 0.1)' }}>
        <HiOutlineVideoCamera size={18} color="#6366F1" />
        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Team Standup</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>Today, 10:00 AM</Typography>
        </Box>
      </Box>
    </GlassCard>
  );
}
