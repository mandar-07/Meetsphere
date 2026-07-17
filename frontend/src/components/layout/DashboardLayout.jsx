import { Box, Container } from '@mui/material';
import AppNavbar from './AppNavbar';

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppNavbar />
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}>
        {children}
      </Container>
    </Box>
  );
}
