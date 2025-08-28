import { NextRequest, NextResponse } from 'next/server';

// Demo forex data generator for testing
function generateDemoForexData(symbol: string, timeframe: string) {
  const basePrice = symbol === 'EURUSD' ? 1.0850 : 
                   symbol === 'GBPUSD' ? 1.2650 :
                   symbol === 'USDJPY' ? 149.50 : 1.0000;
  
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // 1 hour intervals
    const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
    const open = basePrice + variation;
    const high = open + Math.random() * 0.005;
    const low = open - Math.random() * 0.005;
    const close = low + Math.random() * (high - low);
    
    data.push({
      timestamp: timestamp.toISOString(),
      open: parseFloat(open.toFixed(5)),
      high: parseFloat(high.toFixed(5)),
      low: parseFloat(low.toFixed(5)),
      close: parseFloat(close.toFixed(5)),
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  
  return data;
}

// Calculate basic technical indicators
function calculateIndicators(data: any[]) {
  if (data.length < 20) return {};
  
  const closes = data.map(d => d.close);
  const sma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const sma50 = closes.length >= 50 ? closes.slice(-50).reduce((a, b) => a + b, 0) / 50 : null;
  
  // Simple RSI calculation (14 periods)
  let gains = 0, losses = 0;
  for (let i = 1; i < Math.min(15, closes.length); i++) {
    const change = closes[closes.length - i] - closes[closes.length - i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  const avgGain = gains / 14;
  const avgLoss = losses / 14;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return {
    sma20: parseFloat(sma20.toFixed(5)),
    sma50: sma50 ? parseFloat(sma50.toFixed(5)) : null,
    rsi: parseFloat(rsi.toFixed(2)),
    currentPrice: closes[closes.length - 1],
    priceChange: closes[closes.length - 1] - closes[closes.length - 2],
    priceChangePercent: ((closes[closes.length - 1] - closes[closes.length - 2]) / closes[closes.length - 2] * 100).toFixed(2)
  };
}

export async function POST(request: NextRequest) {
  try {
    const { symbol, timeframe } = await request.json();

    // Validate required fields
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Validate symbol format (basic validation)
    const validSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'];
    if (!validSymbols.includes(symbol.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid symbol. Supported symbols: ' + validSymbols.join(', ') },
        { status: 400 }
      );
    }

    const validTimeframes = ['1H', '4H', '1D', '1W'];
    const selectedTimeframe = timeframe || '1H';
    
    if (!validTimeframes.includes(selectedTimeframe)) {
      return NextResponse.json(
        { error: 'Invalid timeframe. Supported: ' + validTimeframes.join(', ') },
        { status: 400 }
      );
    }

    // Generate demo data (in production, this would fetch from a real forex API)
    const priceData = generateDemoForexData(symbol.toUpperCase(), selectedTimeframe);
    const indicators = calculateIndicators(priceData);

    return NextResponse.json({
      success: true,
      symbol: symbol.toUpperCase(),
      timeframe: selectedTimeframe,
      data: priceData,
      indicators,
      timestamp: new Date().toISOString(),
      dataSource: 'demo' // In production: 'live' or API provider name
    });

  } catch (error) {
    console.error('Forex data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forex data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Forex Data API',
    supportedSymbols: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'],
    supportedTimeframes: ['1H', '4H', '1D', '1W'],
    usage: 'POST with { symbol, timeframe }'
  });
}
