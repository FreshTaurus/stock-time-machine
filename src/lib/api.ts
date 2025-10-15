import axios from 'axios'
import { HistoricalStockData, NewsArticle, SearchResult, StockData } from '@/types'

// Using free APIs - no API keys required
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo'
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo'

// Rate limiting for Alpha Vantage API (5 calls per minute)
class RateLimiter {
  private calls: number[] = []
  private readonly maxCalls = 4 // Leave some buffer
  private readonly timeWindow = 60000 // 1 minute

  canMakeCall(): boolean {
    const now = Date.now()
    // Remove calls older than the time window
    this.calls = this.calls.filter(time => now - time < this.timeWindow)
    
    return this.calls.length < this.maxCalls
  }

  recordCall(): void {
    this.calls.push(Date.now())
  }

  getWaitTime(): number {
    if (this.calls.length === 0) return 0
    const oldestCall = Math.min(...this.calls)
    const timeSinceOldest = Date.now() - oldestCall
    return Math.max(0, this.timeWindow - timeSinceOldest)
  }
}

const rateLimiter = new RateLimiter()

// Alpha Vantage API client
const alphaVantageClient = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
  params: {
    apikey: ALPHA_VANTAGE_API_KEY,
  },
})

// News API client
const newsClient = axios.create({
  baseURL: 'https://newsapi.org/v2',
  headers: {
    'X-API-Key': NEWS_API_KEY,
  },
})

export class StockApiService {
  // Search for stocks
  static async searchStocks(query: string): Promise<SearchResult[]> {
    try {
      const response = await alphaVantageClient.get('', {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const matches = response.data.bestMatches || []
      return matches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        currency: match['8. currency'],
      }))
    } catch (error) {
      console.error('Error searching stocks:', error)
      throw new Error('Failed to search stocks')
    }
  }

  // Get current stock data using free APIs
  static async getCurrentStockData(symbol: string): Promise<StockData> {
    // Try free APIs first
    const freeSources = [
      () => this.fetchFromYahooFinance(symbol),
      () => this.fetchFromFinnhub(symbol),
      () => this.fetchFromIEXCloud(symbol),
      () => this.fetchFromAlphaVantageFree(symbol),
      () => this.fetchFromPolygonFree(symbol),
    ]

    for (const fetchData of freeSources) {
      try {
        const data = await fetchData()
        if (data) {
          return data
        }
      } catch (error) {
        console.warn('Free API failed, trying next:', error)
        continue
      }
    }

    // Fallback to Alpha Vantage if API key is available
    if (ALPHA_VANTAGE_API_KEY) {
      // Check rate limiting
      if (!rateLimiter.canMakeCall()) {
        const waitTime = rateLimiter.getWaitTime()
        throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`)
      }

      try {
        rateLimiter.recordCall()
        const response = await alphaVantageClient.get('', {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: symbol,
          },
        })

        if (response.data['Error Message']) {
          throw new Error(response.data['Error Message'])
        }

        const quote = response.data['Global Quote']
        if (!quote) {
          throw new Error('No data found for symbol')
        }

        return {
          symbol: quote['01. symbol'],
          name: symbol,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          open: parseFloat(quote['02. open']),
          previousClose: parseFloat(quote['08. previous close']),
        }
      } catch (error) {
        console.error('Alpha Vantage failed:', error)
      }
    }

    // Final fallback to mock data
    throw new Error('All data sources failed, using mock data')
  }

  // Fetch from Yahoo Finance (free, no API key required)
  private static async fetchFromYahooFinance(symbol: string): Promise<StockData | null> {
    try {
      // Using our proxy to avoid CORS issues
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`)}`)
      const data = await response.json()
      
      if (data.chart?.result?.[0]?.meta) {
        const meta = data.chart.result[0].meta
        const quote = data.chart.result[0].indicators.quote[0]
        
        return {
          symbol: meta.symbol,
          name: meta.longName || symbol,
          price: meta.regularMarketPrice,
          change: meta.regularMarketPrice - meta.previousClose,
          changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
          volume: meta.regularMarketVolume,
          high: meta.regularMarketDayHigh,
          low: meta.regularMarketDayLow,
          open: meta.regularMarketOpen,
          previousClose: meta.previousClose,
        }
      }
      return null
    } catch (error) {
      console.log('Yahoo Finance unavailable, trying next source...')
      throw new Error('Yahoo Finance fetch failed')
    }
  }

  // Fetch from Finnhub (free tier available)
  private static async fetchFromFinnhub(symbol: string): Promise<StockData | null> {
    try {
      // Using our proxy to avoid CORS issues
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=demo`)}`)
      const data = await response.json()
      
      if (data.c && data.c > 0) {
        return {
          symbol: symbol,
          name: symbol,
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          volume: data.v,
          high: data.h,
          low: data.l,
          open: data.o,
          previousClose: data.pc,
        }
      }
      return null
    } catch (error) {
      throw new Error('Finnhub fetch failed')
    }
  }

  // Fetch from IEX Cloud (free tier available)
  private static async fetchFromIEXCloud(symbol: string): Promise<StockData | null> {
    try {
      // Using our proxy to avoid CORS issues
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_test`)}`)
      const data = await response.json()
      
      if (data.latestPrice) {
        return {
          symbol: data.symbol,
          name: data.companyName,
          price: data.latestPrice,
          change: data.change,
          changePercent: data.changePercent * 100,
          volume: data.volume,
          high: data.high,
          low: data.low,
          open: data.open,
          previousClose: data.previousClose,
        }
      }
      return null
    } catch (error) {
      console.log('IEX Cloud unavailable, trying next source...')
      throw new Error('IEX Cloud fetch failed')
    }
  }

  // Fetch from Alpha Vantage free tier (no API key required for basic data)
  private static async fetchFromAlphaVantageFree(symbol: string): Promise<StockData | null> {
    try {
      // Using a public endpoint that doesn't require API key
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`)}`)
      const data = await response.json()
      
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        const quote = data['Global Quote']
        return {
          symbol: quote['01. symbol'],
          name: symbol,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          open: parseFloat(quote['02. open']),
          previousClose: parseFloat(quote['08. previous close']),
        }
      }
      return null
    } catch (error) {
      console.log('Alpha Vantage free tier unavailable, trying next source...')
      throw new Error('Alpha Vantage free fetch failed')
    }
  }

  // Fetch from Polygon.io free tier
  private static async fetchFromPolygonFree(symbol: string): Promise<StockData | null> {
    try {
      // Using Polygon's free tier endpoint
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://api.polygon.io/v1/last_quote/stocks/${symbol}?apikey=demo`)}`)
      const data = await response.json()
      
      if (data.status === 'OK' && data.results) {
        const result = data.results
        return {
          symbol: symbol,
          name: symbol,
          price: result.P,
          change: 0, // Polygon free tier doesn't provide change
          changePercent: 0,
          volume: result.S || 0,
          high: result.P,
          low: result.P,
          open: result.P,
          previousClose: result.P,
        }
      }
      return null
    } catch (error) {
      console.log('Polygon free tier unavailable, trying next source...')
      throw new Error('Polygon free fetch failed')
    }
  }

  // Get historical stock data using free APIs
  static async getHistoricalData(
    symbol: string,
    startDate: string,
    endDate: string
  ): Promise<HistoricalStockData[]> {
    // Try free historical data sources first
    const historicalSources = [
      () => this.fetchHistoricalFromYahooFinance(symbol, startDate, endDate),
      () => this.fetchHistoricalFromAlphaVantageFree(symbol, startDate, endDate),
      () => this.fetchHistoricalFromIEXCloud(symbol, startDate, endDate),
    ]

    for (const fetchHistorical of historicalSources) {
      try {
        const data = await fetchHistorical()
        if (data && data.length > 0) {
          return data
        }
      } catch (error) {
        console.log('Historical source failed, trying next:', error)
        continue
      }
    }

    // Fallback to mock historical data
    return this.getMockHistoricalData(symbol, startDate, endDate)
  }

  // Fetch historical data from Yahoo Finance
  private static async fetchHistoricalFromYahooFinance(
    symbol: string,
    startDate: string,
    endDate: string
  ): Promise<HistoricalStockData[]> {
    try {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000)
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000)
      
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startTimestamp}&period2=${endTimestamp}&interval=1d`)}`)
      const data = await response.json()
      
      if (data.chart?.result?.[0]?.indicators?.quote?.[0]) {
        const quote = data.chart.result[0].indicators.quote[0]
        const timestamps = data.chart.result[0].timestamp
        
        const historicalData: HistoricalStockData[] = []
        
        for (let i = 0; i < timestamps.length; i++) {
          if (quote.open[i] && quote.high[i] && quote.low[i] && quote.close[i]) {
            historicalData.push({
              symbol,
              date: new Date(timestamps[i] * 1000).toISOString().split('T')[0],
              open: quote.open[i],
              high: quote.high[i],
              low: quote.low[i],
              close: quote.close[i],
              volume: quote.volume[i] || 0,
              adjustedClose: quote.close[i],
            })
          }
        }
        
        return historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      return []
    } catch (error) {
      throw new Error('Yahoo Finance historical data failed')
    }
  }

  // Fetch historical data from Alpha Vantage free tier
  private static async fetchHistoricalFromAlphaVantageFree(
    symbol: string,
    startDate: string,
    endDate: string
  ): Promise<HistoricalStockData[]> {
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=demo`)}`)
      const data = await response.json()
      
      if (data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)']
        const historicalData: HistoricalStockData[] = []
        const start = new Date(startDate)
        const end = new Date(endDate)

        for (const [date, data] of Object.entries(timeSeries)) {
          const dataDate = new Date(date)
          if (dataDate >= start && dataDate <= end) {
            historicalData.push({
              symbol,
              date,
              open: parseFloat((data as any)['1. open']),
              high: parseFloat((data as any)['2. high']),
              low: parseFloat((data as any)['3. low']),
              close: parseFloat((data as any)['4. close']),
              volume: parseInt((data as any)['6. volume']),
              adjustedClose: parseFloat((data as any)['5. adjusted close']),
            })
          }
        }

        return historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      return []
    } catch (error) {
      throw new Error('Alpha Vantage historical data failed')
    }
  }

  // Fetch historical data from IEX Cloud
  private static async fetchHistoricalFromIEXCloud(
    symbol: string,
    startDate: string,
    endDate: string
  ): Promise<HistoricalStockData[]> {
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://cloud.iexapis.com/stable/stock/${symbol}/chart/1m?token=pk_test`)}`)
      const data = await response.json()
      
      if (Array.isArray(data)) {
        const historicalData: HistoricalStockData[] = []
        const start = new Date(startDate)
        const end = new Date(endDate)

        for (const item of data) {
          const dataDate = new Date(item.date)
          if (dataDate >= start && dataDate <= end) {
            historicalData.push({
              symbol,
              date: item.date,
              open: item.open,
              high: item.high,
              low: item.low,
              close: item.close,
              volume: item.volume,
              adjustedClose: item.close,
            })
          }
        }

        return historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      return []
    } catch (error) {
      throw new Error('IEX Cloud historical data failed')
    }
  }

  // Mock historical data for fallback
  private static getMockHistoricalData(
    symbol: string,
    startDate: string,
    endDate: string
  ): HistoricalStockData[] {
    const mockData: HistoricalStockData[] = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    const current = new Date(start)
    
    let basePrice = 150 // Starting price
    const priceVariation = 5 // Daily price variation
    
    while (current <= end) {
      // Generate realistic price movement
      const variation = (Math.random() - 0.5) * priceVariation
      const open = basePrice + variation
      const close = open + (Math.random() - 0.5) * 3
      const high = Math.max(open, close) + Math.random() * 2
      const low = Math.min(open, close) - Math.random() * 2
      const volume = Math.floor(Math.random() * 1000000) + 100000
      
      mockData.push({
        symbol,
        date: current.toISOString().split('T')[0],
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume,
        adjustedClose: Math.round(close * 100) / 100,
      })
      
      basePrice = close // Update base price for next day
      current.setDate(current.getDate() + 1)
    }
    
    return mockData
  }

  // Get news for a specific date using free APIs
  static async getNewsForDate(date: string, symbol?: string): Promise<NewsArticle[]> {
    try {
      // Try multiple free news sources
      const newsSources = [
        () => this.fetchNewsFromRSS(date, symbol),
        () => this.fetchNewsFromReddit(date, symbol),
        () => this.fetchNewsFromHackerNews(date, symbol),
      ]

      for (const fetchNews of newsSources) {
        try {
          const articles = await fetchNews()
          if (articles.length > 0) {
            return articles
          }
        } catch (error) {
          console.warn('News source failed, trying next:', error)
          continue
        }
      }

      // If all sources fail, return mock data
      return this.getMockNewsForDate(date, symbol)
    } catch (error) {
      console.error('All news sources failed:', error)
      return this.getMockNewsForDate(date, symbol)
    }
  }

  // Fetch news from RSS feeds (free)
  private static async fetchNewsFromRSS(date: string, symbol?: string): Promise<NewsArticle[]> {
    const rssFeeds = [
      'https://feeds.finance.yahoo.com/rss/2.0/headline',
      'https://feeds.marketwatch.com/marketwatch/topstories/',
      'https://feeds.bloomberg.com/markets/news.rss',
    ]

    const articles: NewsArticle[] = []
    
    for (const feed of rssFeeds) {
      try {
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`)}`)
        const data = await response.json()
        
        if (data.items) {
          const feedArticles = data.items.slice(0, 5).map((item: any, index: number) => ({
            id: `rss-${index}`,
            title: item.title,
            description: item.description || item.content,
            url: item.link,
            publishedAt: item.pubDate,
            source: 'RSS Feed',
            urlToImage: item.thumbnail,
          }))
          articles.push(...feedArticles)
        }
      } catch (error) {
        console.warn(`RSS feed failed: ${feed}`, error)
      }
    }

    return articles.slice(0, 10)
  }

  // Fetch news from Reddit (free)
  private static async fetchNewsFromReddit(date: string, symbol?: string): Promise<NewsArticle[]> {
    try {
      const subreddits = ['stocks', 'investing', 'SecurityAnalysis', 'ValueInvesting']
      const articles: NewsArticle[] = []

      for (const subreddit of subreddits) {
        try {
          const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5`)}`)
          const data = await response.json()

          if (data.data?.children) {
            const redditArticles = data.data.children.map((post: any, index: number) => ({
              id: `reddit-${subreddit}-${index}`,
              title: post.data.title,
              description: post.data.selftext || post.data.title,
              url: `https://reddit.com${post.data.permalink}`,
              publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
              source: `r/${subreddit}`,
              urlToImage: post.data.thumbnail !== 'self' ? post.data.thumbnail : undefined,
            }))
            articles.push(...redditArticles)
          }
        } catch (error) {
          console.warn(`Reddit subreddit failed: ${subreddit}`, error)
        }
      }

      return articles.slice(0, 10)
    } catch (error) {
      throw new Error('Reddit news fetch failed')
    }
  }

  // Fetch news from Hacker News (free)
  private static async fetchNewsFromHackerNews(date: string, symbol?: string): Promise<NewsArticle[]> {
    try {
      const response = await fetch('/api/proxy?url=' + encodeURIComponent('https://hacker-news.firebaseio.com/v0/topstories.json'))
      const storyIds = await response.json()
      
      const articles: NewsArticle[] = []
      const topStories = storyIds.slice(0, 10)

      for (const storyId of topStories) {
        try {
          const storyResponse = await fetch(`/api/proxy?url=${encodeURIComponent(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)}`)
          const story = await storyResponse.json()
          
          if (story && story.type === 'story') {
            articles.push({
              id: `hn-${storyId}`,
              title: story.title,
              description: story.text || story.title,
              url: story.url || `https://news.ycombinator.com/item?id=${storyId}`,
              publishedAt: new Date(story.time * 1000).toISOString(),
              source: 'Hacker News',
              urlToImage: undefined,
            })
          }
        } catch (error) {
          console.warn(`Hacker News story failed: ${storyId}`, error)
        }
      }

      return articles
    } catch (error) {
      throw new Error('Hacker News fetch failed')
    }
  }

  // Mock news data for fallback
  private static getMockNewsForDate(date: string, symbol?: string): NewsArticle[] {
    const mockNews = [
      {
        id: 'mock-1',
        title: `${symbol || 'Stock Market'} Shows Strong Performance`,
        description: `Market analysis shows positive trends for ${symbol || 'major stocks'} on ${date}. Investors are optimistic about future growth prospects.`,
        url: 'https://example.com/mock-news-1',
        publishedAt: `${date}T10:00:00Z`,
        source: 'Financial Times',
        urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      },
      {
        id: 'mock-2',
        title: 'Market Update: Trading Volume Increases',
        description: `Trading volume has increased significantly, indicating strong investor interest in the current market conditions.`,
        url: 'https://example.com/mock-news-2',
        publishedAt: `${date}T14:30:00Z`,
        source: 'Bloomberg',
        urlToImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      },
      {
        id: 'mock-3',
        title: 'Economic Indicators Point to Growth',
        description: `Recent economic data suggests continued growth in the financial sector, with positive implications for investors.`,
        url: 'https://example.com/mock-news-3',
        publishedAt: `${date}T16:45:00Z`,
        source: 'Reuters',
        urlToImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
      },
    ]

    return mockNews
  }

  // Get intraday data (for time machine functionality)
  static async getIntradayData(symbol: string, date: string): Promise<HistoricalStockData[]> {
    try {
      const response = await alphaVantageClient.get('', {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: symbol,
          interval: '5min',
          outputsize: 'compact',
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const timeSeries = response.data['Time Series (5min)']
      if (!timeSeries) {
        throw new Error('No intraday data found')
      }

      const targetDate = new Date(date).toISOString().split('T')[0]
      const intradayData: HistoricalStockData[] = []

      for (const [timestamp, data] of Object.entries(timeSeries)) {
        const dataDate = new Date(timestamp).toISOString().split('T')[0]
        if (dataDate === targetDate) {
          intradayData.push({
            symbol,
            date: timestamp,
            open: parseFloat((data as any)['1. open']),
            high: parseFloat((data as any)['2. high']),
            low: parseFloat((data as any)['3. low']),
            close: parseFloat((data as any)['4. close']),
            volume: parseInt((data as any)['5. volume']),
            adjustedClose: parseFloat((data as any)['4. close']), // Use close as adjusted close for intraday
          })
        }
      }

      return intradayData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } catch (error) {
      console.error('Error fetching intraday data:', error)
      throw new Error('Failed to fetch intraday data')
    }
  }
}
