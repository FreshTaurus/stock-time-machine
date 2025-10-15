import { useState, useEffect, useCallback } from 'react'
import { TimeMachineState, HistoricalStockData, NewsArticle, Trade, Portfolio } from '@/types'
import { StockApiService } from '@/lib/api'
import toast from 'react-hot-toast'

const initialPortfolio: Portfolio = {
  cash: 100000, // Start with $100,000
  positions: {},
  totalValue: 100000,
  totalPnL: 0,
}

export function useTimeMachine() {
  const [state, setState] = useState<TimeMachineState>({
    selectedDate: new Date('2020-01-01'),
    selectedTime: '09:30',
    selectedSymbol: 'AAPL',
    isPlaying: false,
    currentPrice: undefined,
    historicalData: [],
    news: [],
    portfolio: initialPortfolio,
    trades: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load historical data for the selected date and symbol
  const loadHistoricalData = useCallback(async () => {
    if (!state.selectedSymbol) return

    setLoading(true)
    setError(null)

    try {
      const startDate = new Date(state.selectedDate)
      startDate.setDate(startDate.getDate() - 30) // Get 30 days of data
      const endDate = new Date(state.selectedDate)

      const [historicalData, news] = await Promise.all([
        StockApiService.getHistoricalData(
          state.selectedSymbol,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        ).catch(() => []), // Fallback to empty array if historical data fails
        StockApiService.getNewsForDate(
          state.selectedDate.toISOString().split('T')[0],
          state.selectedSymbol
        ),
      ])

      setState(prev => ({
        ...prev,
        historicalData,
        news,
        currentPrice: historicalData[historicalData.length - 1]?.close,
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
      // Silent error handling
    } finally {
      setLoading(false)
    }
  }, [state.selectedDate, state.selectedSymbol])

  // Update selected date
  const setSelectedDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }))
  }, [])

  // Update selected time
  const setSelectedTime = useCallback((time: string) => {
    setState(prev => ({ ...prev, selectedTime: time }))
  }, [])

  // Update selected symbol
  const setSelectedSymbol = useCallback((symbol: string) => {
    setState(prev => ({ ...prev, selectedSymbol: symbol }))
  }, [])

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [])

  // Execute a trade
  const executeTrade = useCallback((trade: Omit<Trade, 'id' | 'timestamp'>) => {
    const newTrade: Trade = {
      ...trade,
      id: `trade-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }

    setState(prev => {
      const newTrades = [...prev.trades, newTrade]
      const newPortfolio = calculatePortfolioValue(prev.portfolio, newTrades, prev.currentPrice || 0)
      
      return {
        ...prev,
        trades: newTrades,
        portfolio: newPortfolio,
      }
    })

    // Trade executed silently
  }, [])

  // Reset portfolio
  const resetPortfolio = useCallback(() => {
    setState(prev => ({
      ...prev,
      portfolio: initialPortfolio,
      trades: [],
    }))
    // Portfolio reset silently
  }, [])

  // Load data when dependencies change
  useEffect(() => {
    loadHistoricalData()
  }, [loadHistoricalData])

  return {
    state,
    loading,
    error,
    setSelectedDate,
    setSelectedTime,
    setSelectedSymbol,
    togglePlayPause,
    executeTrade,
    resetPortfolio,
    loadHistoricalData,
  }
}

// Helper function to calculate portfolio value
function calculatePortfolioValue(
  portfolio: Portfolio,
  trades: Trade[],
  currentPrice: number
): Portfolio {
  let cash = portfolio.cash
  const positions: { [symbol: string]: any } = {}

  // Process all trades
  trades.forEach(trade => {
    if (trade.type === 'buy') {
      const cost = trade.quantity * trade.price
      if (cash >= cost) {
        cash -= cost
        if (!positions[trade.symbol]) {
          positions[trade.symbol] = {
            quantity: 0,
            averagePrice: 0,
            totalCost: 0,
          }
        }
        const position = positions[trade.symbol]
        const newQuantity = position.quantity + trade.quantity
        const newTotalCost = position.totalCost + cost
        position.quantity = newQuantity
        position.averagePrice = newTotalCost / newQuantity
        position.totalCost = newTotalCost
      }
    } else if (trade.type === 'sell') {
      if (positions[trade.symbol] && positions[trade.symbol].quantity >= trade.quantity) {
        cash += trade.quantity * trade.price
        positions[trade.symbol].quantity -= trade.quantity
        if (positions[trade.symbol].quantity === 0) {
          delete positions[trade.symbol]
        }
      }
    }
  })

  // Calculate current values
  let totalValue = cash
  let totalPnL = 0

  Object.keys(positions).forEach(symbol => {
    const position = positions[symbol]
    const currentValue = position.quantity * currentPrice
    const unrealizedPnL = currentValue - (position.quantity * position.averagePrice)
    
    positions[symbol] = {
      ...position,
      currentPrice,
      totalValue: currentValue,
      unrealizedPnL,
    }
    
    totalValue += currentValue
    totalPnL += unrealizedPnL
  })

  return {
    cash,
    positions,
    totalValue,
    totalPnL,
  }
}
