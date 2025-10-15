# Free APIs for Stock Time Machine

The Stock Time Machine now uses multiple free APIs to provide real-time data without requiring API keys!

## 🚀 **Free Stock Data APIs**

### 1. **Yahoo Finance** (Primary)
- **Cost**: Completely free
- **Rate Limit**: No official limit
- **Data**: Real-time prices, historical data
- **Coverage**: Global stocks, ETFs, cryptocurrencies
- **Usage**: Direct API calls through our proxy

### 2. **Finnhub** (Secondary)
- **Cost**: Free tier available
- **Rate Limit**: 60 calls/minute (free tier)
- **Data**: Real-time quotes, company profiles
- **Coverage**: US stocks, forex, crypto
- **Usage**: Demo token for testing

### 3. **IEX Cloud** (Tertiary)
- **Cost**: Free tier available
- **Rate Limit**: 50,000 calls/month (free tier)
- **Data**: Real-time and historical data
- **Coverage**: US stocks, ETFs
- **Usage**: Test token for development

## 📰 **Free News APIs**

### 1. **RSS Feeds** (Primary)
- **Yahoo Finance RSS**: Market headlines
- **MarketWatch RSS**: Financial news
- **Bloomberg RSS**: Market updates
- **Cost**: Completely free
- **Usage**: RSS2JSON proxy service

### 2. **Reddit API** (Secondary)
- **Subreddits**: r/stocks, r/investing, r/SecurityAnalysis
- **Cost**: Completely free
- **Rate Limit**: No official limit
- **Data**: Community discussions and news
- **Usage**: Direct JSON API calls

### 3. **Hacker News API** (Tertiary)
- **Cost**: Completely free
- **Rate Limit**: No official limit
- **Data**: Tech and startup news
- **Usage**: Firebase API

## 🔧 **Technical Implementation**

### CORS Proxy
- **Purpose**: Bypass CORS restrictions
- **Location**: `/api/proxy` endpoint
- **Usage**: All external API calls go through proxy
- **Security**: URL validation and error handling

### Fallback Strategy
1. **Try Yahoo Finance** → Real-time data
2. **Try Finnhub** → Alternative data source
3. **Try IEX Cloud** → Backup option
4. **Fallback to Mock Data** → Development mode

### Error Handling
- **Graceful degradation** when APIs fail
- **User notifications** about data source
- **Mock data fallback** for development
- **Rate limiting protection**

## 🎯 **Benefits**

✅ **No API keys required** for basic functionality  
✅ **Real-time data** from multiple sources  
✅ **Free news** from RSS, Reddit, Hacker News  
✅ **Automatic fallbacks** when services are down  
✅ **CORS-free** implementation  
✅ **Rate limit protection**  

## 📊 **Data Sources Summary**

| Service | Type | Cost | Rate Limit | Coverage |
|---------|------|------|------------|----------|
| Yahoo Finance | Stock Data | Free | None | Global |
| Finnhub | Stock Data | Free Tier | 60/min | US |
| IEX Cloud | Stock Data | Free Tier | 50k/month | US |
| RSS Feeds | News | Free | None | Global |
| Reddit | News | Free | None | Community |
| Hacker News | News | Free | None | Tech |

## 🚀 **Getting Started**

The app works out of the box with free APIs! No setup required:

1. **Start the app**: `npm run dev`
2. **Select a stock**: Try AAPL, GOOGL, MSFT
3. **View live data**: Real-time prices and news
4. **Toggle dark mode**: Click the sun/moon icon
5. **Simulate trades**: Use the trading interface

## 🔧 **Optional: Premium APIs**

For production use, you can still add API keys for:
- **Alpha Vantage**: More reliable stock data
- **News API**: Professional news aggregation
- **Polygon.io**: Real-time market data

Just add them to `.env.local`:
```env
ALPHA_VANTAGE_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
```

The app will automatically use premium APIs when available and fall back to free sources when needed!
