#!/bin/bash

# Stock Time Machine Setup Script
echo "🚀 Setting up Stock Time Machine..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local and add your API keys:"
    echo "   - ALPHA_VANTAGE_API_KEY (get from https://www.alphavantage.co/support/#api-key)"
    echo "   - NEWS_API_KEY (get from https://newsapi.org/register)"
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Run tests
echo "🧪 Running tests..."
npm test

# Build the project
echo "🏗️  Building project..."
npm run build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your API keys"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For production deployment:"
echo "- Vercel: Connect your GitHub repo to Vercel"
echo "- Docker: Run 'docker-compose up'"
echo "- Manual: Run 'npm start'"
