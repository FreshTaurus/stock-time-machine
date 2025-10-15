export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  high: number
  low: number
  open: number
  previousClose: number
}

export interface HistoricalStockData {
  symbol: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjustedClose: number
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  urlToImage?: string
}

export interface Trade {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  date: string
  timestamp: string
}

export interface Portfolio {
  cash: number
  positions: {
    [symbol: string]: {
      quantity: number
      averagePrice: number
      currentPrice: number
      totalValue: number
      unrealizedPnL: number
    }
  }
  totalValue: number
  totalPnL: number
}

export interface TimeMachineState {
  selectedDate: Date
  selectedTime: string
  selectedSymbol: string
  isPlaying: boolean
  currentPrice?: number
  historicalData: HistoricalStockData[]
  news: NewsArticle[]
  portfolio: Portfolio
  trades: Trade[]
}

export interface ChartData {
  date: string
  price: number
  volume: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

export interface SearchResult {
  symbol: string
  name: string
  type: string
  region: string
  currency: string
}
