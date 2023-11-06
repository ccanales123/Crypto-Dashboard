export type Currency = 'USD' | 'EUR' | 'BTC' | 'ETH';

export interface ICryptoPrice {
  USD: number;
  EUR: number;
  BTC?: number;
}

export interface ICryptoApiResponse {
  [key: string]: number;
}

export interface ICryptoData {
  BTC: ICryptoPrice;
  ETH: ICryptoPrice;
}
