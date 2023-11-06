import axios from 'axios';

const API_BASE_URL = 'https://min-api.cryptocompare.com/data';

export interface CryptoPriceResponse {
  USD: number;
  EUR: number;
}

export interface MultiCryptoPriceResponse {
  BTC: CryptoPriceResponse;
  ETH: CryptoPriceResponse;
}

const cryptoService = {
  async fetchCryptoPrice(cryptoSymbol: string): Promise<CryptoPriceResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/price`, {
        params: {
          fsym: cryptoSymbol,
          tsyms: 'USD,EUR',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching crypto price');
    }
  },

  async fetchMultiCryptoPrice(cryptoSymbols: string[]): Promise<MultiCryptoPriceResponse> {
    try {
      const symbols = cryptoSymbols.join();
      const response = await axios.get(`${API_BASE_URL}/pricemulti`, {
        params: {
          fsyms: symbols,
          tsyms: 'USD,EUR',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching multi crypto prices');
    }
  },
};

export default cryptoService;
