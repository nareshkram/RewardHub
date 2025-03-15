import { toast } from "@/hooks/use-toast";

interface ExchangeRates {
  [key: string]: number;
}

// Default rates (to be updated with real API)
const exchangeRates: ExchangeRates = {
  USD: 1,
  INR: 83.24,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.53,
};

const currencySymbols: { [key: string]: string } = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
};

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

async function detectUserCurrency(): Promise<CurrencyInfo> {
  try {
    // Get user's location from IP
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const currencyCode = data.currency || 'USD';
    return {
      code: currencyCode,
      symbol: currencySymbols[currencyCode] || '$',
      rate: exchangeRates[currencyCode] || 1
    };
  } catch (error) {
    console.error('Error detecting currency:', error);
    // Default to USD if detection fails
    return {
      code: 'USD',
      symbol: '$',
      rate: 1
    };
  }
}

function formatCurrency(amount: number, currencyInfo: CurrencyInfo): string {
  const convertedAmount = amount * currencyInfo.rate;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyInfo.code
  }).format(convertedAmount);
}

export const currencyService = {
  detectUserCurrency,
  formatCurrency,
};
