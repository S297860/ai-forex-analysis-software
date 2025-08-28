#!/bin/bash

# Test script for Forex Analysis API endpoints
echo "Testing Forex Analysis API endpoints..."

# 1. Test the forex data endpoint
echo -e "\n\n=== Testing Forex Data API ==="
curl -X POST http://localhost:8000/api/forex/data \
  -H "Content-Type: application/json" \
  -d '{"symbol": "EURUSD", "timeframe": "1H"}' \
  -w "\nHTTP Status: %{http_code}\n" | jq '.'

# 2. Test the forex analysis endpoint with sample data
echo -e "\n\n=== Testing Forex Analysis API ==="
echo "Fetching sample data first..."

# Get sample data
SAMPLE_DATA=$(curl -s -X POST http://localhost:8000/api/forex/data \
  -H "Content-Type: application/json" \
  -d '{"symbol": "EURUSD", "timeframe": "1H"}')

# Extract just the data and indicators from the sample data
PRICE_DATA=$(echo $SAMPLE_DATA | jq '.data')
INDICATORS=$(echo $SAMPLE_DATA | jq '.indicators')

# Use the sample data to test the analysis endpoint
echo "Sending data to analysis endpoint..."
curl -X POST http://localhost:8000/api/forex/analyze \
  -H "Content-Type: application/json" \
  -d "{
    \"symbol\": \"EURUSD\",
    \"timeframe\": \"1H\",
    \"priceData\": $PRICE_DATA,
    \"indicators\": $INDICATORS
  }" \
  -w "\nHTTP Status: %{http_code}\n" | jq '.'

echo -e "\n\nAPI Testing completed!"
