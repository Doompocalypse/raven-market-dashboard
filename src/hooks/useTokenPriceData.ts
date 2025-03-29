
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type PriceDataPoint = {
  timestamp: string;
  price: number;
  volume_24h?: number;
  market_cap?: number;
  percent_change_24h?: number;
};

export type TokenPriceData = {
  symbol: string;
  name: string;
  currentPrice: number;
  percentChange24h: number;
  marketCap: number;
  volume24h: number;
  priceHistory: PriceDataPoint[];
};

// Map our tokens to CoinMarketCap symbols
const TOKEN_SYMBOL_MAP: Record<string, string> = {
  SOL: 'SOL',
  USDC: 'USDC',
  DMC: 'DOOM', // Using a placeholder for DOOMCOIN as it may not exist on CMC
};

export const useTokenPriceData = (symbol: string) => {
  return useQuery({
    queryKey: ['tokenPrice', symbol],
    queryFn: async (): Promise<TokenPriceData | null> => {
      try {
        const cmcSymbol = TOKEN_SYMBOL_MAP[symbol];
        if (!cmcSymbol) {
          throw new Error(`No mapping found for symbol: ${symbol}`);
        }

        const { data: quoteData, error: quoteError } = await supabase.functions.invoke('market-data', {
          body: { symbol: cmcSymbol, endpoint: 'quotes' }
        });
        
        if (quoteError) throw new Error(quoteError.message);
        if (!quoteData?.data?.[cmcSymbol]) {
          console.error('Unexpected API response structure:', quoteData);
          throw new Error('Invalid API response');
        }
        
        const tokenData = quoteData.data[cmcSymbol][0];
        
        // Get historical data
        const { data: historyData, error: historyError } = await supabase.functions.invoke('market-data', {
          body: { symbol: cmcSymbol, endpoint: 'history', interval: '1d', count: '30' }
        });
        
        if (historyError) throw new Error(historyError.message);
        
        // Format historical data
        let priceHistory: PriceDataPoint[] = [];
        if (historyData?.data?.[cmcSymbol]) {
          priceHistory = historyData.data[cmcSymbol].map((point: any) => ({
            timestamp: point.timestamp,
            price: point.quote.USD.price,
            volume_24h: point.quote.USD.volume_24h,
            market_cap: point.quote.USD.market_cap,
            percent_change_24h: point.quote.USD.percent_change_24h,
          }));
        } else {
          // Fallback for when the API doesn't have historical data
          // Generate mock data based on current price
          const currentPrice = tokenData.quote.USD.price;
          priceHistory = Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            
            // Small random price fluctuation for demo purposes
            const variance = Math.random() * 0.1 - 0.05; // -5% to +5%
            const priceVariance = currentPrice * (1 + variance);
            
            return {
              timestamp: date.toISOString(),
              price: symbol === 'USDC' ? 1 : priceVariance, // USDC should stay close to 1 USD
            };
          });
        }
        
        return {
          symbol,
          name: tokenData.name,
          currentPrice: tokenData.quote.USD.price,
          percentChange24h: tokenData.quote.USD.percent_change_24h,
          marketCap: tokenData.quote.USD.market_cap,
          volume24h: tokenData.quote.USD.volume_24h,
          priceHistory,
        };
      } catch (error) {
        console.error('Error fetching token price data:', error);
        
        // Return mock data when API fails
        return generateMockPriceData(symbol);
      }
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

// Generate mock data for development or when API fails
const generateMockPriceData = (symbol: string): TokenPriceData => {
  const basePrice = symbol === 'SOL' ? 125 : symbol === 'USDC' ? 1 : 0.25;
  const priceHistory = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    // Add some random volatility to the price
    const variance = Math.random() * 0.1 - 0.05; // -5% to +5%
    const priceVariance = basePrice * (1 + variance);
    
    return {
      timestamp: date.toISOString(),
      price: symbol === 'USDC' ? 1 : priceVariance,
    };
  });
  
  return {
    symbol,
    name: symbol === 'SOL' ? 'Solana' : symbol === 'USDC' ? 'USD Coin' : 'DOOMCOIN',
    currentPrice: priceHistory[priceHistory.length - 1].price,
    percentChange24h: symbol === 'USDC' ? 0 : (Math.random() * 10) - 5,
    marketCap: symbol === 'SOL' ? 50000000000 : symbol === 'USDC' ? 25000000000 : 1000000,
    volume24h: symbol === 'SOL' ? 2000000000 : symbol === 'USDC' ? 1500000000 : 500000,
    priceHistory,
  };
};
