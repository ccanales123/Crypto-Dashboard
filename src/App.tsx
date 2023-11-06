import React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Box, Container, Grid, Paper, Typography, CssBaseline } from '@mui/material';
import LivePriceGraph from './components/LivePriceGraph';
import CurrencyCalculator from './components/CurrencyCalculator';
import PriceTable from './components/PriceTable';

const theme = createTheme({
  palette: {
    primary: {
      main: '#38357B',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const StyledHeaderPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1),
}));

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <StyledHeaderPaper square>
          <Container maxWidth="lg">
            <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
              <strong>Crypto Currency Dashboard</strong>
            </Typography>
          </Container>
        </StyledHeaderPaper>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <LivePriceGraph />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <CurrencyCalculator />
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ pt: 4 }}>
            <PriceTable />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
