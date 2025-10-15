'use client'

import { useState, useEffect, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StockData, HistoricalStockData } from '@/types'
import { StockApiService } from '@/lib/api'
import { mockStockData, generateMockLiveData } from '@/lib/mockData'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

interface LivePriceChartProps {
  symbol: string
  height?: number
}

interface LiveDataPoint {
  timestamp: string
  price: number
  volume: number
  time: string
}

export function LivePriceChart({ symbol, height = 300 }: LivePriceChartProps) {
  const [liveData, setLiveData] = useState<LiveDataPoint[]>([])
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Fetch current stock data
  const fetchCurrentPrice = useCallback(async () => {
    if (!symbol) return

    setIsLoading(true)
    try {
      // Try to get real data from free APIs first
      let stockData: StockData
      try {
        stockData = await StockApiService.getCurrentStockData(symbol)
        // Silent success - no popup
      } catch (error) {
        // Fallback to mock data if all APIs fail
        stockData = { ...mockStockData, symbol }
        // Silent fallback - no popup
      }
      
      const now = new Date()
      const timestamp = now.toISOString()
      
      const newDataPoint: LiveDataPoint = {
        timestamp,
        price: stockData.price,
        volume: stockData.volume,
        time: now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
      }

      setCurrentPrice(stockData.price)
      setPriceChange(stockData.change)
      
      setLiveData(prev => {
        const updated = [...prev, newDataPoint]
        // Keep only last 20 data points for performance
        return updated.slice(-20)
      })
      
      setLastUpdate(now)
    } catch (error) {
      console.error('Error fetching live price:', error)
      
      // Fallback to mock data on error
      const mockData = { ...mockStockData, symbol }
      const now = new Date()
      const newDataPoint: LiveDataPoint = {
        timestamp: now.toISOString(),
        price: mockData.price,
        volume: mockData.volume,
        time: now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
      }
      
      setCurrentPrice(mockData.price)
      setPriceChange(mockData.change)
      
      setLiveData(prev => {
        const updated = [...prev, newDataPoint]
        return updated.slice(-20)
      })
      
      setLastUpdate(now)
      // Silent error handling - no popup
    } finally {
      setIsLoading(false)
    }
  }, [symbol])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!symbol) return

    // Initial fetch
    fetchCurrentPrice()

    // Set up interval for live updates
    const interval = setInterval(fetchCurrentPrice, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [symbol, fetchCurrentPrice])

  // Initialize with mock data immediately for development
  useEffect(() => {
    if (!symbol) return
    
    // Always initialize with mock data for now
    const mockData = { ...mockStockData, symbol }
    const mockLiveData = generateMockLiveData(symbol, mockData.price)
    
    // Silent initialization
    
    setCurrentPrice(mockData.price)
    setPriceChange(mockData.change)
    setLiveData(mockLiveData)
    setLastUpdate(new Date())
  }, [symbol])

  // Manual refresh
  const handleRefresh = () => {
    fetchCurrentPrice()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium dark:text-gray-100">{data.time}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Price:</span> ${data.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Volume:</span> {data.volume.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  if (!symbol) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Select a stock symbol to view live price chart</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{symbol} Live Price</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              {currentPrice && (
                <span className="text-2xl font-bold">
                  ${currentPrice.toFixed(2)}
                </span>
              )}
              {priceChange !== 0 && (
                <span className={`flex items-center gap-1 text-sm ${
                  priceChange >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {priceChange >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
                </span>
              )}
            </div>
            {lastUpdate && (
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {liveData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="animate-pulse text-4xl mb-2">📈</div>
            <p>Loading live price data...</p>
          </div>
        </div>
      ) : (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Live data updates every 30 seconds
      </div>
    </div>
  )
}
