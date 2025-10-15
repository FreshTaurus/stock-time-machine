'use client'

import { useState } from 'react'
import { Activity, TrendingUp } from 'lucide-react'

interface ChartToggleProps {
  activeView: 'live' | 'historical'
  onViewChange: (view: 'live' | 'historical') => void
}

export function ChartToggle({ activeView, onViewChange }: ChartToggleProps) {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => onViewChange('live')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeView === 'live'
            ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        <Activity className="h-4 w-4" />
        Live Prices
      </button>
      <button
        onClick={() => onViewChange('historical')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeView === 'historical'
            ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        <TrendingUp className="h-4 w-4" />
        Historical
      </button>
    </div>
  )
}
