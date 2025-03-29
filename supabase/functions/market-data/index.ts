
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const COINMARKETCAP_API_KEY = '1e734aaf-8f16-4b32-8acf-4f2bee25bc41';
const BASE_URL = 'https://pro-api.coinmarketcap.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint') || 'quotes';
    const symbol = url.searchParams.get('symbol');
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    let apiUrl;
    
    switch (endpoint) {
      case 'quotes':
        apiUrl = `${BASE_URL}/v2/cryptocurrency/quotes/latest?symbol=${symbol}`;
        break;
      case 'history':
        const interval = url.searchParams.get('interval') || '1h';
        const count = url.searchParams.get('count') || '24';
        apiUrl = `${BASE_URL}/v2/cryptocurrency/quotes/historical?symbol=${symbol}&interval=${interval}&count=${count}`;
        break;
      default:
        apiUrl = `${BASE_URL}/v2/cryptocurrency/quotes/latest?symbol=${symbol}`;
    }
    
    console.log(`Fetching data from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching market data:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch market data' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
