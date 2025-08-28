import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { symbol, timeframe, priceData, indicators } = await request.json();

    // Validate required fields
    if (!symbol || !priceData) {
      return NextResponse.json(
        { error: 'Symbol and price data are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Prepare data for analysis
    const recentPrices = priceData.slice(-10); // Last 10 candles
    const currentPrice = recentPrices[recentPrices.length - 1];
    
    const prompt = `You are an expert forex analyst with 20+ years of experience. Analyze the following ${symbol} forex data and provide precise trading recommendations.

MARKET DATA:
- Symbol: ${symbol}
- Timeframe: ${timeframe || '1H'}
- Current Price: ${currentPrice?.close}
- Price Change: ${indicators?.priceChange || 'N/A'}
- Price Change %: ${indicators?.priceChangePercent || 'N/A'}%

TECHNICAL INDICATORS:
- SMA 20: ${indicators?.sma20 || 'N/A'}
- SMA 50: ${indicators?.sma50 || 'N/A'}
- RSI: ${indicators?.rsi || 'N/A'}

RECENT PRICE ACTION (Last 10 candles):
${recentPrices.map((candle: any, i: number) => 
  `${i + 1}. Open: ${candle.open}, High: ${candle.high}, Low: ${candle.low}, Close: ${candle.close}`
).join('\n')}

ANALYSIS REQUIREMENTS:
Provide a comprehensive trading analysis with specific, actionable recommendations. Consider:
1. Current market trend and momentum
2. Key support and resistance levels
3. Entry points for both long and short positions
4. Risk management (stop loss and take profit levels)
5. Position sizing recommendations
6. Market sentiment and key factors

RESPONSE FORMAT:
Return your analysis as a valid JSON object with these exact keys:
{
  "trend": "bullish|bearish|neutral",
  "support": [array of support price levels],
  "resistance": [array of resistance price levels],
  "longEntry": price or null,
  "shortEntry": price or null,
  "stopLoss": price,
  "takeProfit": [array of take profit levels],
  "riskScore": 1-10 integer,
  "confidence": 1-100 integer,
  "positionSize": "percentage recommendation as string",
  "analysis": "detailed explanation string",
  "signals": ["buy", "sell", "hold"] array,
  "keyLevels": {
    "immediateSupport": price,
    "immediateResistance": price,
    "majorSupport": price,
    "majorResistance": price
  }
}

Provide specific price levels and actionable recommendations. Be precise with your analysis.`;

    // Generate demo analysis if no API key is available
    let analysis;
    
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      console.log('Using demo analysis (no API key provided)');
      
      // Generate demo analysis based on the provided data
      const price = currentPrice?.close || 1.0;
      const trend = indicators?.rsi > 50 ? 'bullish' : indicators?.rsi < 40 ? 'bearish' : 'neutral';
      const aboveSMA = price > (indicators?.sma20 || price);
      
      analysis = {
        trend: trend,
        support: [
          price * 0.995,
          price * 0.992,
          price * 0.99
        ],
        resistance: [
          price * 1.005,
          price * 1.008,
          price * 1.01
        ],
        longEntry: trend !== 'bearish' ? price * 1.0005 : null,
        shortEntry: trend !== 'bullish' ? price * 0.9995 : null,
        stopLoss: trend === 'bullish' ? price * 0.997 : price * 1.003,
        takeProfit: trend === 'bullish' 
          ? [price * 1.01, price * 1.015] 
          : [price * 0.99, price * 0.985],
        riskScore: trend === 'neutral' ? 5 : (trend === 'bullish' ? 3 : 7),
        confidence: trend === 'neutral' ? 50 : 75,
        positionSize: trend === 'neutral' ? '1-2%' : '2-3%',
        analysis: `${symbol} is currently showing a ${trend} trend on the ${timeframe} timeframe. ${
          aboveSMA ? 'Price is trading above the 20-period SMA, suggesting bullish momentum.' 
                  : 'Price is below the 20-period SMA, indicating bearish pressure.'
        } The RSI at ${indicators?.rsi || 'N/A'} ${
          indicators?.rsi > 70 ? 'suggests overbought conditions.' 
          : indicators?.rsi < 30 ? 'indicates oversold conditions.' 
          : 'is in neutral territory.'
        } ${
          trend === 'bullish' 
            ? 'Look for buying opportunities near support levels with a stop loss below the nearest support.' 
            : trend === 'bearish' 
              ? 'Consider selling opportunities near resistance with a stop above the nearest resistance level.' 
              : 'The market is showing mixed signals. Wait for clearer direction before entering a position.'
        }`,
        signals: trend === 'bullish' ? ['buy'] : trend === 'bearish' ? ['sell'] : ['hold'],
        keyLevels: {
          immediateSupport: price * 0.998,
          immediateResistance: price * 1.002,
          majorSupport: price * 0.995,
          majorResistance: price * 1.005
        }
      };
    } else {
      // Call OpenRouter API
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'anthropic/claude-sonnet-4',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1500,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const completion = await response.json();
        const analysisContent = completion.choices[0]?.message?.content;

        if (!analysisContent) {
          throw new Error('No analysis content received from AI');
        }

        // Parse the JSON response from AI
        try {
          // Extract JSON from the response (in case there's extra text)
          const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : analysisContent;
          analysis = JSON.parse(jsonString);
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          throw new Error('Failed to parse AI response');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // Fallback to demo analysis if API call fails
        const price = currentPrice?.close || 1.0;
        analysis = {
          trend: 'neutral',
          support: [price * 0.995, price * 0.99],
          resistance: [price * 1.005, price * 1.01],
          longEntry: null,
          shortEntry: null,
          stopLoss: price * 0.99,
          takeProfit: [price * 1.01],
          riskScore: 5,
          confidence: 50,
          positionSize: '1-2%',
          analysis: 'API error occurred. Using fallback analysis. The market appears to be in a consolidation phase. Consider waiting for a clearer trend to emerge before entering a position.',
          signals: ['hold'],
          keyLevels: {
            immediateSupport: price * 0.998,
            immediateResistance: price * 1.002,
            majorSupport: price * 0.995,
            majorResistance: price * 1.005
          }
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      symbol,
      timeframe,
      analysis,
      timestamp: new Date().toISOString(),
      aiModel: 'anthropic/claude-sonnet-4'
    });

  } catch (error) {
    console.error('Forex analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze forex data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Forex AI Analysis API',
    usage: 'POST with { symbol, timeframe, priceData, indicators }',
    model: 'anthropic/claude-sonnet-4',
    provider: 'OpenRouter'
  });
}
