'use client'

import { useState } from 'react'
import { Calendar, Clock, Play, Pause, RotateCcw, Search } from 'lucide-react'
import { format } from 'date-fns'
import { useTimeMachine } from '@/hooks/useTimeMachine'
import { StockApiService } from '@/lib/api'
import toast from 'react-hot-toast'

export function TimeMachineControls() {
  const {
    state,
    setSelectedDate,
    setSelectedTime,
    setSelectedSymbol,
    togglePlayPause,
    resetPortfolio,
  } = useTimeMachine()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value)
  }

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSymbol(e.target.value.toUpperCase())
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await StockApiService.searchStocks(searchQuery)
      setSearchResults(results)
    } catch (error) {
      // Silent error handling
    } finally {
      setIsSearching(false)
    }
  }

  const selectSymbol = (symbol: string) => {
    setSelectedSymbol(symbol)
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary-600" />
        <h2 className="text-xl font-semibold">Time Machine Controls</h2>
      </div>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={format(state.selectedDate, 'yyyy-MM-dd')}
            onChange={handleDateChange}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="input w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <input
            type="time"
            value={state.selectedTime}
            onChange={handleTimeChange}
            className="input w-full"
          />
        </div>
      </div>

      {/* Symbol Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stock Symbol
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery || state.selectedSymbol}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (e.target.value === '') {
                setSearchResults([])
              }
            }}
            placeholder="Search for a stock symbol..."
            className="input w-full pr-10"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <Search className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-lg max-h-48 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => selectSymbol(result.symbol)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium">{result.symbol}</div>
                <div className="text-sm text-gray-600">{result.name}</div>
                <div className="text-xs text-gray-500">{result.region} • {result.currency}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Play/Pause Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlayPause}
          className={`btn ${state.isPlaying ? 'btn-danger' : 'btn-success'} flex items-center gap-2`}
        >
          {state.isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          )}
        </button>

        <button
          onClick={resetPortfolio}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Portfolio
        </button>
      </div>

      {/* Current Status */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Current Date:</span>
            <div className="font-medium dark:text-gray-100">
              {format(state.selectedDate, 'MMM dd, yyyy')}
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Current Time:</span>
            <div className="font-medium dark:text-gray-100">{state.selectedTime}</div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Symbol:</span>
            <div className="font-medium dark:text-gray-100">{state.selectedSymbol}</div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Price:</span>
            <div className="font-medium dark:text-gray-100">
              {state.currentPrice ? `$${state.currentPrice.toFixed(2)}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
