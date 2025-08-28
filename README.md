# AI Forex Analysis Software

An advanced forex trading analysis application that uses artificial intelligence to analyze forex charts and provide precise trading signals.

## Features

- **Real-time Forex Data**: Access demo forex data for major currency pairs
- **AI-Powered Analysis**: Leverage Claude Sonnet 4 via OpenRouter for advanced market analysis
- **Trading Signals**: Get precise entry points, stop loss, and take profit levels
- **Risk Assessment**: Receive risk scores and position sizing recommendations
- **Technical Analysis**: View support/resistance levels and trend identification
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes
- **AI**: OpenRouter API with Claude Sonnet 4 model
- **Styling**: Tailwind CSS with custom variables for theming

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun
- OpenRouter API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your API keys:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:8000

### Testing API Endpoints

Use the included test script to verify API functionality:

```bash
./test-api.sh
```

## Usage

1. Navigate to the application in your browser
2. Go to the Forex Analysis page
3. Enter a forex symbol (e.g., EURUSD, GBPUSD)
4. Select a timeframe (1H, 4H, 1D, 1W)
5. Click "Analyze Forex Pair"
6. View the comprehensive analysis results

## Project Structure

- `src/app/api/forex/data/route.ts`: Forex data API endpoint
- `src/app/api/forex/analyze/route.ts`: AI analysis API endpoint
- `src/app/page.tsx`: Home page
- `src/app/forex/page.tsx`: Forex analysis page
- `src/app/layout.tsx`: Root layout component
- `src/components/ui/`: UI components from shadcn/ui

## Disclaimer

This application is for educational purposes only. Trading forex involves significant risk. Always conduct your own research and consider consulting with a financial advisor before making trading decisions.

## License

MIT
