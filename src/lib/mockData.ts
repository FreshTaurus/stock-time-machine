import { HistoricalStockData, NewsArticle, StockData } from '@/types'

// Mock data for development when API keys are not available
export const mockStockData: StockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 175.50,
  change: 2.30,
  changePercent: 1.33,
  volume: 45000000,
  high: 176.20,
  low: 173.10,
  open: 174.00,
  previousClose: 173.20,
}

export const mockHistoricalData: HistoricalStockData[] = [
  {
    symbol: 'AAPL',
    date: '2023-01-01',
    open: 130.00,
    high: 135.00,
    low: 128.50,
    close: 133.20,
    volume: 50000000,
    adjustedClose: 133.20,
  },
  {
    symbol: 'AAPL',
    date: '2023-01-02',
    open: 133.20,
    high: 138.50,
    low: 132.00,
    close: 136.80,
    volume: 48000000,
    adjustedClose: 136.80,
  },
  {
    symbol: 'AAPL',
    date: '2023-01-03',
    open: 136.80,
    high: 142.00,
    low: 135.20,
    close: 140.50,
    volume: 52000000,
    adjustedClose: 140.50,
  },
  {
    symbol: 'AAPL',
    date: '2023-01-04',
    open: 140.50,
    high: 145.20,
    low: 139.80,
    close: 143.90,
    volume: 46000000,
    adjustedClose: 143.90,
  },
  {
    symbol: 'AAPL',
    date: '2023-01-05',
    open: 143.90,
    high: 148.50,
    low: 142.10,
    close: 147.20,
    volume: 55000000,
    adjustedClose: 147.20,
  },
]

export const mockNewsData: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Apple Reports Strong Q4 Earnings, Stock Rises 5%',
    description: 'Apple Inc. reported better-than-expected quarterly earnings, with revenue up 8% year-over-year, driving the stock price higher in after-hours trading.',
    url: 'https://example.com/apple-earnings',
    publishedAt: '2023-01-01T16:00:00Z',
    source: 'Reuters',
    urlToImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
  },
  {
    id: 'news-2',
    title: 'Tech Stocks Rally as Market Opens Higher',
    description: 'Technology stocks led the market higher as investors showed renewed confidence in the sector following positive earnings reports.',
    url: 'https://example.com/tech-rally',
    publishedAt: '2023-01-01T09:30:00Z',
    source: 'Bloomberg',
    urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
  },
  {
    id: 'news-3',
    title: 'Federal Reserve Signals Potential Rate Cut',
    description: 'The Federal Reserve hinted at a possible interest rate cut in the coming months, which could benefit growth stocks like Apple.',
    url: 'https://example.com/fed-rate-cut',
    publishedAt: '2023-01-01T14:00:00Z',
    source: 'Wall Street Journal',
    urlToImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
  },
]

// Generate mock live data points
export function generateMockLiveData(symbol: string, basePrice: number = 175.50): Array<{
  timestamp: string
  price: number
  volume: number
  time: string
}> {
  const data = []
  const now = new Date()
  
  for (let i = 19; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 30000)) // 30 seconds apart
    const priceVariation = (Math.random() - 0.5) * 2 // ±$1 variation
    const price = basePrice + priceVariation
    
    data.push({
      timestamp: time.toISOString(),
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      time: time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
    })
  }
  
  return data
}
