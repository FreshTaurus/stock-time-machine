'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { HistoricalStockData } from '@/types'
import { format } from 'date-fns'

interface StockChartProps {
  data: HistoricalStockData[]
  symbol: string
  height?: number
}

export function StockChart({ data, symbol, height = 400 }: StockChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: format(new Date(item.date), 'MMM dd'),
      fullDate: item.date,
      price: item.close,
      open: item.open,
      high: item.high,
      low: item.low,
      volume: item.volume,
    }))
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Price:</span> ${data.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Open:</span> ${data.open.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">High:</span> ${data.high.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Low:</span> ${data.low.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Volume:</span> {data.volume.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  if (!data.length) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>No chart data available</p>
          </div>
        </div>
      </div>
    )
  }

  const minPrice = Math.min(...data.map(d => d.low))
  const maxPrice = Math.max(...data.map(d => d.high))
  const priceRange = maxPrice - minPrice
  const yAxisDomain = [minPrice - priceRange * 0.1, maxPrice + priceRange * 0.1]

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{symbol} Price Chart</h3>
        <p className="text-sm text-gray-600">
          {data.length} days of historical data
        </p>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              domain={yAxisDomain}
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#0ea5e9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
