# 🕰️ Stock Time Machine

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **A powerful web application that allows users to travel back in time and explore historical stock data, news, and simulate "what if" trades from any point in history.**

## ✨ Features

### 🎯 Core Functionality
- **⏰ Time Travel**: Jump to any historical date and time to explore stock data
- **📊 Stock Explorer**: Interactive charts and historical price data
- **📰 News Integration**: View relevant news and events from any historical date
- **💰 Trading Simulator**: Simulate trades and track portfolio performance
- **📈 Real-time Data**: Live stock prices with multiple free APIs

### 🚀 Key Features
- **🌙 Dark Mode**: Complete dark/light theme support
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI**: Built with Tailwind CSS and Framer Motion
- **🔒 Type Safety**: Full TypeScript implementation
- **🧪 Testing**: Comprehensive test suite with Jest and Cypress
- **⚡ Performance**: Optimized for fast loading and smooth interactions
- **🆓 Free APIs**: No API keys required for basic functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Testing**: Jest, React Testing Library, Cypress
- **APIs**: Yahoo Finance, Finnhub, IEX Cloud, Alpha Vantage, Polygon.io

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Alpha Vantage API key
- News API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-time-machine
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   ```

4. **Get API Keys**
   - [Alpha Vantage](https://www.alphavantage.co/support/#api-key) - Free tier available
   - [News API](https://newsapi.org/register) - Free tier available

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Time Machine Controls
1. **Select Date**: Choose any historical date using the date picker
2. **Select Time**: Set the specific time of day (default: 9:30 AM)
3. **Choose Stock**: Search and select a stock symbol (e.g., AAPL, GOOGL, MSFT)
4. **Play/Pause**: Control the time machine simulation

### Stock Explorer
- View interactive price charts with historical data
- Analyze price movements, volume, and trends
- Hover over data points for detailed information

### News & Events
- Read relevant news articles from the selected date
- Understand market context and events
- Click through to original sources

### Trading Simulator
- **Execute Trades**: Buy or sell stocks at historical prices
- **Portfolio Tracking**: Monitor your simulated portfolio performance
- **P&L Analysis**: Track profits and losses
- **Trade History**: Review all executed trades

## API Integration

### Alpha Vantage
- **Stock Search**: Find stocks by company name or symbol
- **Current Data**: Real-time stock prices and market data
- **Historical Data**: Daily and intraday price history
- **Rate Limits**: 5 calls per minute, 500 calls per day (free tier)

### News API
- **Historical News**: News articles from specific dates
- **Stock-specific News**: Filtered news for selected stocks
- **Rate Limits**: 1000 requests per day (free tier)

## Testing

### Unit Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Tests
```bash
npm run cypress:open
```

### Type Checking
```bash
npm run type-check
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── TimeMachineControls.tsx
│   ├── StockChart.tsx
│   ├── NewsFeed.tsx
│   └── TradingSimulator.tsx
├── hooks/                 # Custom React hooks
│   └── useTimeMachine.ts
├── lib/                   # Utility libraries
│   └── api.ts            # API service layer
├── types/                # TypeScript type definitions
│   └── index.ts
└── __tests__/            # Test files
    ├── components/
    ├── hooks/
    └── lib/
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with Next.js
- **AWS**: Use AWS Amplify or custom deployment
- **Docker**: Use the included Dockerfile

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | Yes |
| `NEWS_API_KEY` | News API key | Yes |
| `YAHOO_FINANCE_API_KEY` | Yahoo Finance API key (optional) | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write tests for new features

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Add comprehensive prop validation
- Include accessibility attributes

### Testing Guidelines
- Write unit tests for all utilities and hooks
- Add component tests for UI components
- Include E2E tests for critical user flows
- Maintain test coverage above 70%

## Performance Optimization

### Bundle Size
- Use dynamic imports for large components
- Optimize images with Next.js Image component
- Implement code splitting

### API Optimization
- Cache API responses when appropriate
- Implement request debouncing
- Use efficient data structures

### User Experience
- Implement loading states
- Add error boundaries
- Provide meaningful feedback

## Troubleshooting

### Common Issues

**API Rate Limits**
- Alpha Vantage: 5 calls/minute, 500 calls/day
- News API: 1000 requests/day
- Solution: Implement caching and request optimization

**Build Errors**
- Check TypeScript types
- Verify all imports are correct
- Run `npm run type-check`

**Test Failures**
- Ensure all mocks are properly configured
- Check test environment setup
- Verify API responses match expected format

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for financial data
- [News API](https://newsapi.org/) for news data
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for chart components

## Support

For support, email support@stocktimemachine.com or create an issue in the GitHub repository.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
