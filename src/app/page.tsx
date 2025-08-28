import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">
              AI-Powered Forex Analysis
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get precise trading signals, support/resistance levels, and risk assessments for major currency pairs using advanced AI analysis.
            </p>
            <div className="pt-4">
              <Link href="/forex">
                <Button size="lg" className="px-8">
                  Start Analyzing
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Analysis</CardTitle>
                <CardDescription>
                  Analyze forex charts with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Get instant AI-powered analysis of forex charts with technical indicators, trend identification, and pattern recognition.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Signals</CardTitle>
                <CardDescription>
                  Clear buy/sell recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Receive precise entry points, stop loss levels, and take profit targets based on comprehensive market analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
                <CardDescription>
                  Optimize your position sizing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Get risk assessments and position sizing recommendations to help manage your trading portfolio effectively.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
              <p className="text-lg text-slate-600 mt-2">
                Three simple steps to get AI-powered forex trading signals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold">Select Currency Pair</h3>
                <p className="text-slate-600">
                  Choose from major forex pairs like EURUSD, GBPUSD, USDJPY and more.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold">Choose Timeframe</h3>
                <p className="text-slate-600">
                  Select your preferred timeframe from 1-hour to weekly charts.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold">Get Analysis</h3>
                <p className="text-slate-600">
                  Receive comprehensive AI analysis with actionable trading recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6 py-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Ready to improve your forex trading?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start using AI-powered analysis to make more informed trading decisions today.
            </p>
            <div className="pt-4">
              <Link href="/forex">
                <Button size="lg" className="px-8">
                  Start Analyzing
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-16 pb-8 text-slate-500 text-sm">
            <p>
              This tool is for educational purposes only. Trading forex involves significant risk.
              Always conduct your own research and consider consulting with a financial advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
