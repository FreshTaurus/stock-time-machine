'use client'

import { useState } from 'react'
import { useTimeMachine } from '@/hooks/useTimeMachine'
import { Trade } from '@/types'
import { TrendingUp, TrendingDown, DollarSign, PieChart, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

export function TradingSimulator() {
  const { state, executeTrade, resetPortfolio } = useTimeMachine()
  const [tradeForm, setTradeForm] = useState({
    type: 'buy' as 'buy' | 'sell',
    quantity: 1,
  })

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!state.currentPrice) {
      toast.error('No current price available')
      return
    }

    if (tradeForm.quantity <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }

    const trade: Omit<Trade, 'id' | 'timestamp'> = {
      symbol: state.selectedSymbol,
      type: tradeForm.type,
      quantity: tradeForm.quantity,
      price: state.currentPrice,
      date: state.selectedDate.toISOString().split('T')[0],
    }

    executeTrade(trade)
    
    // Reset form
    setTradeForm({ type: 'buy', quantity: 1 })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold">Portfolio Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(state.portfolio.totalValue)}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(state.portfolio.cash)}
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${
            state.portfolio.totalPnL >= 0 
              ? 'bg-success-50 dark:bg-success-900/20' 
              : 'bg-danger-50 dark:bg-danger-900/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {state.portfolio.totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success-600 dark:text-success-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-danger-600 dark:text-danger-400" />
              )}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">P&L</span>
            </div>
            <div className={`text-2xl font-bold ${
              state.portfolio.totalPnL >= 0 
                ? 'text-success-600 dark:text-success-400' 
                : 'text-danger-600 dark:text-danger-400'
            }`}>
              {formatCurrency(state.portfolio.totalPnL)}
            </div>
          </div>
        </div>
      </div>

      {/* Trading Form */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Execute Trade</h3>
        
        <form onSubmit={handleTradeSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trade Type
              </label>
              <select
                value={tradeForm.type}
                onChange={(e) => setTradeForm(prev => ({ 
                  ...prev, 
                  type: e.target.value as 'buy' | 'sell' 
                }))}
                className="input w-full"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={tradeForm.quantity}
                onChange={(e) => setTradeForm(prev => ({ 
                  ...prev, 
                  quantity: parseInt(e.target.value) || 1 
                }))}
                className="input w-full"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Price</span>
              <span className="font-bold dark:text-gray-100">
                {state.currentPrice ? formatCurrency(state.currentPrice) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</span>
              <span className="font-bold dark:text-gray-100">
                {state.currentPrice ? formatCurrency(state.currentPrice * tradeForm.quantity) : 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              className={`btn flex-1 ${
                tradeForm.type === 'buy' ? 'btn-success' : 'btn-danger'
              }`}
              disabled={!state.currentPrice}
            >
              {tradeForm.type === 'buy' ? 'Buy' : 'Sell'} {tradeForm.quantity} {state.selectedSymbol}
            </button>
            
            <button
              type="button"
              onClick={resetPortfolio}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Positions */}
      {Object.keys(state.portfolio.positions).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Current Positions</h3>
          
          <div className="space-y-3">
            {Object.entries(state.portfolio.positions).map(([symbol, position]) => (
              <div key={symbol} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{symbol}</h4>
                    <p className="text-sm text-gray-600">
                      {position.quantity} shares @ {formatCurrency(position.averagePrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(position.totalValue)}</div>
                    <div className={`text-sm ${
                      position.unrealizedPnL >= 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {formatCurrency(position.unrealizedPnL)} ({formatPercent(
                        (position.unrealizedPnL / (position.quantity * position.averagePrice)) * 100
                      )})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade History */}
      {state.trades.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Trade History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {state.trades.slice(-10).reverse().map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-100">
                    <td className="py-2">{trade.date}</td>
                    <td className="py-2 font-medium">{trade.symbol}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        trade.type === 'buy' 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-danger-100 text-danger-700'
                      }`}>
                        {trade.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2">{trade.quantity}</td>
                    <td className="py-2">{formatCurrency(trade.price)}</td>
                    <td className="py-2 font-medium">
                      {formatCurrency(trade.quantity * trade.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
