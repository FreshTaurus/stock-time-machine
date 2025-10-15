import { renderHook, act } from '@testing-library/react'
import { useTimeMachine } from '@/hooks/useTimeMachine'
import { StockApiService } from '@/lib/api'

// Mock the API service
jest.mock('@/lib/api', () => ({
  StockApiService: {
    getHistoricalData: jest.fn(),
    getNewsForDate: jest.fn(),
  },
}))

const mockStockApiService = StockApiService as jest.Mocked<typeof StockApiService>

describe('useTimeMachine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStockApiService.getHistoricalData.mockResolvedValue([])
    mockStockApiService.getNewsForDate.mockResolvedValue([])
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTimeMachine())

    expect(result.current.state.selectedSymbol).toBe('AAPL')
    expect(result.current.state.selectedDate).toBeInstanceOf(Date)
    expect(result.current.state.selectedTime).toBe('09:30')
    expect(result.current.state.isPlaying).toBe(false)
    expect(result.current.state.portfolio.cash).toBe(100000)
  })

  it('should update selected date', () => {
    const { result } = renderHook(() => useTimeMachine())
    const newDate = new Date('2023-06-01')

    act(() => {
      result.current.setSelectedDate(newDate)
    })

    expect(result.current.state.selectedDate).toBe(newDate)
  })

  it('should update selected time', () => {
    const { result } = renderHook(() => useTimeMachine())

    act(() => {
      result.current.setSelectedTime('14:30')
    })

    expect(result.current.state.selectedTime).toBe('14:30')
  })

  it('should update selected symbol', () => {
    const { result } = renderHook(() => useTimeMachine())

    act(() => {
      result.current.setSelectedSymbol('GOOGL')
    })

    expect(result.current.state.selectedSymbol).toBe('GOOGL')
  })

  it('should toggle play/pause', () => {
    const { result } = renderHook(() => useTimeMachine())

    expect(result.current.state.isPlaying).toBe(false)

    act(() => {
      result.current.togglePlayPause()
    })

    expect(result.current.state.isPlaying).toBe(true)

    act(() => {
      result.current.togglePlayPause()
    })

    expect(result.current.state.isPlaying).toBe(false)
  })

  it('should execute a buy trade', () => {
    const { result } = renderHook(() => useTimeMachine())

    act(() => {
      result.current.executeTrade({
        symbol: 'AAPL',
        type: 'buy',
        quantity: 10,
        price: 150,
        date: '2023-01-01',
      })
    })

    expect(result.current.state.trades).toHaveLength(1)
    expect(result.current.state.trades[0].symbol).toBe('AAPL')
    expect(result.current.state.trades[0].type).toBe('buy')
    expect(result.current.state.trades[0].quantity).toBe(10)
    expect(result.current.state.trades[0].price).toBe(150)
  })

  it('should execute a sell trade', () => {
    const { result } = renderHook(() => useTimeMachine())

    // First buy some shares
    act(() => {
      result.current.executeTrade({
        symbol: 'AAPL',
        type: 'buy',
        quantity: 10,
        price: 150,
        date: '2023-01-01',
      })
    })

    // Then sell some shares
    act(() => {
      result.current.executeTrade({
        symbol: 'AAPL',
        type: 'sell',
        quantity: 5,
        price: 160,
        date: '2023-01-02',
      })
    })

    expect(result.current.state.trades).toHaveLength(2)
    expect(result.current.state.portfolio.positions['AAPL'].quantity).toBe(5)
  })

  it('should reset portfolio', () => {
    const { result } = renderHook(() => useTimeMachine())

    // Execute some trades
    act(() => {
      result.current.executeTrade({
        symbol: 'AAPL',
        type: 'buy',
        quantity: 10,
        price: 150,
        date: '2023-01-01',
      })
    })

    expect(result.current.state.trades).toHaveLength(1)

    // Reset portfolio
    act(() => {
      result.current.resetPortfolio()
    })

    expect(result.current.state.trades).toHaveLength(0)
    expect(result.current.state.portfolio.cash).toBe(100000)
    expect(Object.keys(result.current.state.portfolio.positions)).toHaveLength(0)
  })

  it('should load historical data when dependencies change', async () => {
    const mockHistoricalData = [
      {
        symbol: 'AAPL',
        date: '2023-01-01',
        open: 150,
        high: 155,
        low: 149,
        close: 152.5,
        volume: 1000000,
        adjustedClose: 152.5,
      },
    ]

    const mockNews = [
      {
        id: 'news-1',
        title: 'Apple Stock News',
        description: 'Apple stock rises',
        url: 'https://example.com',
        publishedAt: '2023-01-01T10:00:00Z',
        source: 'Reuters',
      },
    ]

    mockStockApiService.getHistoricalData.mockResolvedValue(mockHistoricalData)
    mockStockApiService.getNewsForDate.mockResolvedValue(mockNews)

    const { result } = renderHook(() => useTimeMachine())

    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockStockApiService.getHistoricalData).toHaveBeenCalled()
    expect(mockStockApiService.getNewsForDate).toHaveBeenCalled()
  })
})
