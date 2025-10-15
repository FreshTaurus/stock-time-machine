'use client'

import { TimeMachineControls } from '@/components/TimeMachineControls'
import { StockChart } from '@/components/StockChart'
import { LivePriceChart } from '@/components/LivePriceChart'
import { ChartToggle } from '@/components/ChartToggle'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import { NewsFeed } from '@/components/NewsFeed'
import { TradingSimulator } from '@/components/TradingSimulator'
import { useTimeMachine } from '@/hooks/useTimeMachine'
import { Clock, TrendingUp, Newspaper, PieChart, Activity } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const { state, loading } = useTimeMachine()
  const [chartView, setChartView] = useState<'live' | 'historical'>('live')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Stock Time Machine</h1>
                <p className="text-sm text-gray-600">
                  Explore historical stock data and simulate trades from any point in time
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Live Prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Historical Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  <span>News & Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  <span>Portfolio Simulation</span>
                </div>
              </div>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="dark:text-gray-100">Loading historical data...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls and Charts */}
          <div className="lg:col-span-2 space-y-8">
            <TimeMachineControls />
            
            {/* Chart Toggle */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Price Charts</h2>
              <ChartToggle 
                activeView={chartView}
                onViewChange={setChartView}
              />
            </div>
            
            {/* Live Price Chart */}
            {chartView === 'live' && (
              <LivePriceChart 
                symbol={state.selectedSymbol}
                height={400}
              />
            )}
            
            {/* Historical Chart */}
            {chartView === 'historical' && state.historicalData.length > 0 && (
              <StockChart 
                data={state.historicalData} 
                symbol={state.selectedSymbol}
                height={400}
              />
            )}
            
            {chartView === 'historical' && state.historicalData.length === 0 && (
              <div className="card">
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <p>No historical data available</p>
                    <p className="text-sm mt-2">Try selecting a different date or stock symbol</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - News and Trading */}
          <div className="space-y-8">
            <NewsFeed 
              news={state.news} 
              date={state.selectedDate}
            />
            
            <TradingSimulator />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Stock Time Machine - Built with Next.js, TypeScript, and Tailwind CSS
            </p>
            <p className="mt-2">
              Data provided by Alpha Vantage and News API
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
