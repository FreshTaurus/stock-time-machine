import { StockApiService } from '@/lib/api'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('StockApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchStocks', () => {
    it('should return search results for valid query', async () => {
      const mockResponse = {
        data: {
          bestMatches: [
            {
              '1. symbol': 'AAPL',
              '2. name': 'Apple Inc.',
              '3. type': 'Equity',
              '4. region': 'United States',
              '8. currency': 'USD',
            },
          ],
        },
      }

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any)

      const result = await StockApiService.searchStocks('Apple')

      expect(result).toEqual([
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          type: 'Equity',
          region: 'United States',
          currency: 'USD',
        },
      ])
    })

    it('should throw error for API error response', async () => {
      const mockResponse = {
        data: {
          'Error Message': 'Invalid API call',
        },
      }

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any)

      await expect(StockApiService.searchStocks('Apple')).rejects.toThrow(
        'Failed to search stocks'
      )
    })
  })

  describe('getCurrentStockData', () => {
    it('should return current stock data', async () => {
      const mockResponse = {
        data: {
          'Global Quote': {
            '01. symbol': 'AAPL',
            '02. open': '150.00',
            '03. high': '155.00',
            '04. low': '149.00',
            '05. price': '152.50',
            '06. volume': '1000000',
            '08. previous close': '150.00',
            '09. change': '2.50',
            '10. change percent': '1.67%',
          },
        },
      }

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any)

      const result = await StockApiService.getCurrentStockData('AAPL')

      expect(result).toEqual({
        symbol: 'AAPL',
        name: 'AAPL',
        price: 152.5,
        change: 2.5,
        changePercent: 1.67,
        volume: 1000000,
        high: 155,
        low: 149,
        open: 150,
        previousClose: 150,
      })
    })
  })

  describe('getHistoricalData', () => {
    it('should return historical data for date range', async () => {
      const mockResponse = {
        data: {
          'Time Series (Daily)': {
            '2023-01-01': {
              '1. open': '150.00',
              '2. high': '155.00',
              '3. low': '149.00',
              '4. close': '152.50',
              '5. adjusted close': '152.50',
              '6. volume': '1000000',
            },
            '2023-01-02': {
              '1. open': '152.50',
              '2. high': '158.00',
              '3. low': '151.00',
              '4. close': '156.00',
              '5. adjusted close': '156.00',
              '6. volume': '1200000',
            },
          },
        },
      }

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any)

      const result = await StockApiService.getHistoricalData(
        'AAPL',
        '2023-01-01',
        '2023-01-02'
      )

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        symbol: 'AAPL',
        date: '2023-01-01',
        open: 150,
        high: 155,
        low: 149,
        close: 152.5,
        volume: 1000000,
        adjustedClose: 152.5,
      })
    })
  })

  describe('getNewsForDate', () => {
    it('should return news articles for date', async () => {
      const mockResponse = {
        data: {
          articles: [
            {
              title: 'Apple Stock Rises',
              description: 'Apple stock rises on strong earnings',
              url: 'https://example.com',
              publishedAt: '2023-01-01T10:00:00Z',
              source: { name: 'Reuters' },
              urlToImage: 'https://example.com/image.jpg',
            },
          ],
        },
      }

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any)

      const result = await StockApiService.getNewsForDate('2023-01-01', 'AAPL')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'news-0',
        title: 'Apple Stock Rises',
        description: 'Apple stock rises on strong earnings',
        url: 'https://example.com',
        publishedAt: '2023-01-01T10:00:00Z',
        source: 'Reuters',
        urlToImage: 'https://example.com/image.jpg',
      })
    })
  })
})
