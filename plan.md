Below is the detailed, step‐by‐step plan for implementing the AI Forex Analysis Software. This plan covers backend API endpoints, frontend UI pages, new components, error handling, and integration with the OpenRouter API using the Claude Sonnet 4 model.

---

### 1. Overview of Features

- **Forex Data Fetching:**  
  - Create an API route that accepts a forex symbol and timeframe.  
  - Use either a free forex API (e.g., Alpha Vantage) or demo data if real-time keys are unavailable.  
  - Validate input and return a consistent JSON structure (e.g., an array of recent price candles).

- **AI Analysis via OpenRouter:**  
  - Create an API route that accepts forex price data, technical indicator info, and symbol details.  
  - Use the OpenRouter endpoint “https://openrouter.ai/api/v1/chat/completions” with model `anthropic/claude-sonnet-4`.  
  - Construct the prompt dynamically to request trends, support/resistance levels, entries, stops, risk, and trade signals.  
  - Implement robust error handling and log any API communication errors.

- **UI/UX for Forex Analysis:**  
  - Build a dedicated page (under `/forex`) with a modern form that lets users enter a forex pair and select a timeframe.  
  - Display a clean chart using the existing `src/components/ui/chart.tsx` component (or a similar layout) and show results in a card-like format.  
  - Use simple typography, spacing, and layout styling (without external icon libraries or image services) to ensure a sleek, modern interface.

---

### 2. Backend API Endpoints

#### A. Forex Data Endpoint  
- **File:** `src/app/api/forex/data/route.ts`  
- **Changes:**
  - Accept POST requests with required fields: `symbol` and optionally `timeframe`.
  - Validate input; if missing, return a 400 error JSON response.
  - Fetch demo price data or integrate with forex API; return a JSON object containing recent price candles.
  - Example error handling using try-catch and NextResponse with status codes.

#### B. Forex Analysis Endpoint  
- **File:** `src/app/api/forex/analyze/route.ts`  
- **Changes:**
  - Accept POST requests with JSON body containing `symbol`, `timeframe`, `priceData`, and optional `indicators`.
  - Validate inputs – return 400 error if required fields are missing.
  - Construct a prompt that includes a summary of the recent priceData and technical indicators.
  - Call the OpenRouter API with the prompt using the provided API key (from environment variables).
  - Parse the JSON response from OpenRouter and return a structured JSON response including keys: `trend`, `support`, `resistance`, `longEntry`, `shortEntry`, `stopLoss`, `takeProfit`, `riskScore`, `confidence`, `positionSize`, `analysis`, and `signals`.
  - Handle errors by catching exceptions and returning a 500 error response.

---

### 3. Frontend User Interface

#### A. Forex Analysis Page  
- **File:** `src/app/forex/page.tsx`  
- **Changes:**
  - Create a new Next.js page with a modern layout, using Tailwind CSS for spacing, typography, and color cues.
  - Include a header/title (e.g., “AI Forex Analysis”) and a brief description.
  - Build a form with:
    - A text input for the forex pair symbol (e.g., “EURUSD”).
    - A dropdown selector for timeframe (e.g., “1H”, “4H”, “Daily”).
    - A primary “Analyze” button.
  - On form submission:
    - Call the forex data API endpoint to fetch the latest price data.
    - Then, forward the fetched data along with user selections to the analyze endpoint.
    - Display a loader or disable the form until responses are received.
  - Use state management (useState, useEffect) to handle loading, error, and result states.
  - Display the resulting analysis using a card layout. Optionally, use a simple table or a dedicated component (see below).

#### B. Forex Analysis Results Component  
- **File:** `src/components/ForexAnalysisResults.tsx` (new)  
- **Changes:**
  - Create a React component that accepts the analysis result as a prop.
  - Display each parameter (trend, support/resistance levels, entry points, stop loss, take profit, risk score, and explanation) in a well-spaced card with headers and text.
  - Use consistent typography and spacing, adhering to the modern, minimalist design.
  - Optionally, if a chart image is insightful, use an `<img>` tag for a static fallback:
    ```html
    <img src="https://placehold.co/800x600?text=Detailed+line+chart+of+forex+price+action+with+annotated+trade+signals" alt="Line chart showcasing forex price trends, support/resistance levels, and analyzed trade signals" onerror="this.onerror=null;this.src='fallback.jpg'" />
    ```

---

### 4. Environment Variables and Configuration

- Add environment variables for API keys (if not present):
  - `OPENROUTER_API_KEY` for the OpenRouter access.
  - Optionally, a forex data API key (e.g., `FOREX_API_KEY`).
- Update `.env` (or appropriate configuration) to ensure these values load securely.

---

### 5. Error Handling and Best Practices

- **Backend:**  
  - Validate all incoming request data.  
  - Use try-catch blocks for API calls and return clear JSON error messages with proper HTTP status codes.  
  - Log errors for debugging (do not expose sensitive internal details).

- **Frontend:**  
  - Provide user-friendly error notifications if API requests fail.  
  - Disable buttons or show spinners during async operations.  
  - Ensure responsive design for various screen sizes using Tailwind CSS classes.

---

### 6. Testing

- **API Testing:**  
  - Use `curl` commands to POST sample JSON data to `/api/forex/data/route.ts` and `/api/forex/analyze/route.ts`.  
  - Verify that proper HTTP status codes and JSON responses are returned.
  
- **UI Testing:**  
  - Run the Next.js app and manually test the form flow, including cases with missing fields.
  - Ensure that error messages and analysis results render correctly.

---

### Summary

- Created two new backend endpoints: one for fetching forex price data and another for analyzing it via OpenRouter using `anthropic/claude-sonnet-4`.  
- Designed a modern, minimalist UI page (`src/app/forex/page.tsx`) with a user-friendly input form and clear analysis result display.  
- Added a dedicated results component (`src/components/ForexAnalysisResults.tsx`) for structured analysis output.  
- Implemented thorough error handling, input validation, and asynchronous operation management on both frontend and backend.  
- Integrated environment variable configuration for API keys, ensuring secure access.  
- Outlined detailed testing procedures using curl and manual UI verification, ensuring robustness.  
- The plan adheres to best practices and is designed to integrate seamlessly with the existing Next.js and Tailwind CSS codebase.
