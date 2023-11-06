import React, { useState, useEffect } from 'react';
import cryptoService from '../../services/cryptoService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Grid
} from '@mui/material';

interface PriceInfo {
  time: string;
  USD: number;
  EUR: number;
  BTC?: number;
}

const PriceTable: React.FC = () => {
  const [btcPrices, setBtcPrices] = useState<PriceInfo[]>([]);
  const [ethPrices, setEthPrices] = useState<PriceInfo[]>([]);

  const fetchLatestPrices = async () => {
    try {
      const btcPrice = await cryptoService.fetchCryptoPrice('BTC');
      const ethPrice = await cryptoService.fetchCryptoPrice('ETH');
      
      setBtcPrices(prevPrices => [...prevPrices, {
        time: new Date().toISOString(),
        USD: btcPrice.USD,
        EUR: btcPrice.EUR
      }].slice(-10));

      setEthPrices(prevPrices => [...prevPrices, {
        time: new Date().toISOString(),
        USD: ethPrice.USD,
        EUR: ethPrice.EUR,
        BTC: ethPrice.USD / btcPrice.USD
      }].slice(-10));
    } catch (error) {
      console.error('Failed to fetch latest prices:', error);
    }
  };

  useEffect(() => {
    fetchLatestPrices();
    const interval = setInterval(fetchLatestPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderTable = (prices: PriceInfo[], showBtcColumn: boolean) => (
    <TableContainer component={Paper} elevation={3} sx={{ my: 2 }}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell align="right">USD</TableCell>
            <TableCell align="right">EUR</TableCell>
            {showBtcColumn && <TableCell align="right">BTC</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {prices.slice().reverse().map((price, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {new Date(price.time).toLocaleTimeString()}
              </TableCell>
              <TableCell align="right">{price.USD.toFixed(2)}</TableCell>
              <TableCell align="right">{price.EUR.toFixed(2)}</TableCell>
              {showBtcColumn && <TableCell align="right">{price.BTC?.toFixed(5)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Bitcoin - BTC
            </Typography>
            <img src="img/btc.png" alt="Bitcoin" style={{ width: '25px', height: '26px' }} />
          </Box>
          {renderTable(btcPrices, false)}
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Ethereum - ETH
            </Typography>
            <img src="img/eth.png" alt="Ethereum" style={{ width: '25px', height: '26px' }} />
          </Box>
          {renderTable(ethPrices, true)}
        </Box>
      </Grid>
    </Grid>
  );
};

export default PriceTable;
