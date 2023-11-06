import React, { useState, useEffect, ChangeEvent } from 'react';
import cryptoService, { MultiCryptoPriceResponse } from '../../services/cryptoService';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Grid,
  useTheme
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

type CurrencyType = 'BTC' | 'ETH';
type FiatCurrencyType = 'USD' | 'EUR';

const CurrencyCalculator: React.FC = () => {
  const [cryptoPrices, setCryptoPrices] = useState<MultiCryptoPriceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [inputCurrency, setInputCurrency] = useState<CurrencyType>('BTC');
  const [outputCurrency, setOutputCurrency] = useState<FiatCurrencyType>('USD');
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  const theme = useTheme();

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const prices = await cryptoService.fetchMultiCryptoPrice(['BTC', 'ETH']);
        setCryptoPrices(prices);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    if (cryptoPrices) {
      const rate = cryptoPrices[inputCurrency][outputCurrency];
      if (!isNaN(inputAmount)) {
        const calculatedAmount = inputAmount * rate;
        setConvertedAmount(calculatedAmount);
      }
    }
  }, [inputCurrency, outputCurrency, inputAmount, cryptoPrices]);

  const handleInputAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    if (amount.match(/^\d*\.?\d*$/)) {
      setInputAmount(parseFloat(amount) || 0);
    }
  };

  const handleOutputAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    if (amount.match(/^\d*\.?\d*$/) && cryptoPrices) {
      const rate = cryptoPrices[inputCurrency][outputCurrency];
      setInputAmount(parseFloat(amount) / rate || 0);
    }
  };

  const handleCurrencyChange = (event: SelectChangeEvent<CurrencyType>) => {
    setInputCurrency(event.target.value as CurrencyType);
  };

  const handleOutputCurrencyChange = (event: SelectChangeEvent<FiatCurrencyType>) => {
    setOutputCurrency(event.target.value as FiatCurrencyType);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{`Error: ${error}`}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: theme.spacing(4), maxWidth: 600, margin: 'auto', mt: theme.spacing(5) }}>
      <Typography variant="h5" gutterBottom component="div">
        Currency Calculator
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <TextField
              label="Enter Crypto Amount"
              type="text"
              value={inputAmount}
              onChange={handleInputAmountChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel id="input-currency-label">Crypto</InputLabel>
              <Select
                labelId="input-currency-label"
                value={inputCurrency}
                label="Crypto"
                onChange={handleCurrencyChange}
                startAdornment={<CurrencyBitcoinIcon />}
              >
                <MenuItem value="BTC">BTC</MenuItem>
                <MenuItem value="ETH">ETH</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <TextField
              label="Enter Fiat Amount"
              type="text"
              value={convertedAmount}
              onChange={handleOutputAmountChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel id="output-currency-label">Fiat</InputLabel>
              <Select
                labelId="output-currency-label"
                value={outputCurrency}
                label="Fiat"
                onChange={handleOutputCurrencyChange}
                startAdornment={<MonetizationOnIcon />}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant="body1" gutterBottom sx={{ mt: theme.spacing(2) }}>
            Converted Amount: <strong>{isNaN(convertedAmount) ? "0.00" : convertedAmount.toFixed(2)}</strong> <em>{outputCurrency}</em>
        </Typography>
      </Box>
    </Paper>
  );
};

export default CurrencyCalculator;
