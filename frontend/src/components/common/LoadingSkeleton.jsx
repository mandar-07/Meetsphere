import { Box, Skeleton } from '@mui/material';

export function CardSkeleton() {
  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
      <Skeleton variant="text" sx={{ mt: 1, bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
      <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
    </Box>
  );
}

export function MeetingCardSkeleton() {
  return (
    <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
      <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
      <Skeleton variant="text" width="70%" sx={{ mt: 1, bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
      <Skeleton variant="rounded" height={36} sx={{ mt: 2, bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
    </Box>
  );
}

export function DashboardSkeleton() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
      {[1, 2, 3, 4].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </Box>
  );
}
