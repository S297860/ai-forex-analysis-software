"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ForexData {
  success: boolean;
  symbol: string;
  timeframe: string;
  data: any[];
  indicators: any;
  timestamp: string;
  dataSource: string;
}

interface AnalysisResult {
  success: boolean;
  symbol: string;
  timeframe: string;
  analysis: {
    trend: string;
    support: number[];
    resistance: number[];
    longEntry: number | null;
    shortEntry: number | null;
    stopLoss: number;
    takeProfit: number[];
    riskScore: number;
    confidence: number;
    positionSize: string;
    analysis: string;
    signals: string[];
    keyLevels: {
      immediateSupport: number;
      immediateResistance: number;
      majorSupport: number;
      majorResistance: number;
    };
  };
  timestamp: string;
  aiModel: string;
}

export default function ForexAnalysisPage() {
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('1H');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forexData, setForexData] = useState<ForexData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const supportedSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'];
  const supportedTimeframes = ['1H', '4H', '1D', '1W'];

  const handleAnalyze = async () => {
    if (!symbol.trim()) {
      setError('Please enter a forex symbol');
      return;
    }

    setLoading(true);
    setError('');
    setForexData(null);
    setAnalysisResult(null);

    try {
      // Step 1: Fetch forex data
      const dataResponse = await fetch('/api/forex/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          timeframe,
        }),
      });

      if (!dataResponse.ok) {
        const errorData = await dataResponse.json();
        throw new Error(errorData.error || 'Failed to fetch forex data');
      }

      const forexDataResult: ForexData = await dataResponse.json();
      setForexData(forexDataResult);

      // Step 2: Analyze the data with AI
      const analysisResponse = await fetch('/api/forex/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: forexDataResult.symbol,
          timeframe: forexDataResult.timeframe,
          priceData: forexDataResult.data,
          indicators: forexDataResult.indicators,
        }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || 'Failed to analyze forex data');
      }

      const analysisData: AnalysisResult = await analysisResponse.json();
      setAnalysisResult(analysisData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900">
            AI Forex Analysis
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Advanced forex chart analysis powered by artificial intelligence. Get precise trading signals, 
            support/resistance levels, and risk assessments for major currency pairs.
          </p>
        </div>

        {/* Analysis Form */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Forex Pair Analysis</CardTitle>
            <CardDescription>
              Enter a forex symbol and select timeframe for AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Forex Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., EURUSD"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">
                  Supported: {supportedSymbols.join(', ')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedTimeframes.map((tf) => (
                      <SelectItem key={tf} value={tf}>
                        {tf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !symbol.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? 'Analyzing...' : 'Analyze Forex Pair'}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && forexData && !loading && (
          <div className="space-y-8">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="signals">Trade Signals</TabsTrigger>
                <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
              </TabsList>
              
              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Analysis: {analysisResult.symbol}</CardTitle>
                    <CardDescription>
                      {timeframe} Timeframe • {new Date(analysisResult.timestamp).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">Market Trend</h3>
                          <p className={`text-xl font-bold ${
                            analysisResult.analysis.trend === 'bullish' ? 'text-green-600' : 
                            analysisResult.analysis.trend === 'bearish' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {analysisResult.analysis.trend.toUpperCase()}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold">Risk Score</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">{analysisResult.analysis.riskScore}/10</span>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  analysisResult.analysis.riskScore <= 3 ? 'bg-green-600' : 
                                  analysisResult.analysis.riskScore <= 7 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${analysisResult.analysis.riskScore * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold">Confidence</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">{analysisResult.analysis.confidence}%</span>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${analysisResult.analysis.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">Key Levels</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Major Resistance:</span>
                              <span className="font-semibold">{analysisResult.analysis.keyLevels.majorResistance}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Immediate Resistance:</span>
                              <span className="font-semibold">{analysisResult.analysis.keyLevels.immediateResistance}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Immediate Support:</span>
                              <span className="font-semibold">{analysisResult.analysis.keyLevels.immediateSupport}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Major Support:</span>
                              <span className="font-semibold">{analysisResult.analysis.keyLevels.majorSupport}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold">Recommended Position Size</h3>
                          <p className="text-xl font-bold">{analysisResult.analysis.positionSize}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                  <img 
                    src={`https://placehold.co/800x400?text=Forex+Chart+${analysisResult.symbol}+${timeframe}+Timeframe`}
                    alt={`Forex chart for ${analysisResult.symbol} on ${timeframe} timeframe showing price action and key levels`}
                    className="mx-auto rounded-lg shadow-md"
                  />
                </div>
              </TabsContent>
              
              {/* Trade Signals Tab */}
              <TabsContent value="signals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Trade Signals</CardTitle>
                    <CardDescription>
                      Entry points, stop loss, and take profit levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Long Position */}
                      <Card className={`border-l-4 ${analysisResult.analysis.longEntry ? 'border-l-green-500' : 'border-l-slate-300'}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Long Position (Buy)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Entry Point:</span>
                            <span className="font-semibold">
                              {analysisResult.analysis.longEntry ? 
                                analysisResult.analysis.longEntry : 'Not Recommended'}
                            </span>
                          </div>
                          {analysisResult.analysis.longEntry && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Stop Loss:</span>
                                <span className="font-semibold text-red-600">{analysisResult.analysis.stopLoss}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Take Profit:</span>
                                <span className="font-semibold text-green-600">
                                  {analysisResult.analysis.takeProfit[0]}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Risk/Reward:</span>
                                <span className="font-semibold">
                                  {((analysisResult.analysis.takeProfit[0] - analysisResult.analysis.longEntry) / 
                                    (analysisResult.analysis.longEntry - analysisResult.analysis.stopLoss)).toFixed(2)}
                                </span>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Short Position */}
                      <Card className={`border-l-4 ${analysisResult.analysis.shortEntry ? 'border-l-red-500' : 'border-l-slate-300'}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Short Position (Sell)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Entry Point:</span>
                            <span className="font-semibold">
                              {analysisResult.analysis.shortEntry ? 
                                analysisResult.analysis.shortEntry : 'Not Recommended'}
                            </span>
                          </div>
                          {analysisResult.analysis.shortEntry && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Stop Loss:</span>
                                <span className="font-semibold text-red-600">{analysisResult.analysis.stopLoss}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Take Profit:</span>
                                <span className="font-semibold text-green-600">
                                  {analysisResult.analysis.takeProfit[0]}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Risk/Reward:</span>
                                <span className="font-semibold">
                                  {((analysisResult.analysis.shortEntry - analysisResult.analysis.takeProfit[0]) / 
                                    (analysisResult.analysis.stopLoss - analysisResult.analysis.shortEntry)).toFixed(2)}
                                </span>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-semibold mb-2">Signal Summary</h3>
                      <div className="flex gap-2">
                        {analysisResult.analysis.signals.map((signal, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              signal === 'buy' ? 'bg-green-100 text-green-800' : 
                              signal === 'sell' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {signal.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Detailed Analysis Tab */}
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Analysis</CardTitle>
                    <CardDescription>
                      Comprehensive market analysis and trading rationale
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Support & Resistance Levels</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-slate-600 mb-1">Resistance Levels</h4>
                            <ul className="space-y-1">
                              {analysisResult.analysis.resistance.map((level, index) => (
                                <li key={index} className="font-mono">{level}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-slate-600 mb-1">Support Levels</h4>
                            <ul className="space-y-1">
                              {analysisResult.analysis.support.map((level, index) => (
                                <li key={index} className="font-mono">{level}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Analysis Explanation</h3>
                        <div className="prose prose-slate max-w-none">
                          <p className="whitespace-pre-line">{analysisResult.analysis.analysis}</p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-slate-500 mt-4">
                        <p>Analysis generated by {analysisResult.aiModel} at {new Date(analysisResult.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-slate-500 text-sm">
          <p>
            This analysis is for educational purposes only. Always conduct your own research 
            and consider consulting with a financial advisor before making trading decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
