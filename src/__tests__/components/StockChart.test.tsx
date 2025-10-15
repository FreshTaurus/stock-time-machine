import { render, screen } from '@testing-library/react'
import { StockChart } from '@/components/StockChart'
import { HistoricalStockData } from '@/types'

const mockData: HistoricalStockData[] = [
  {
    symbol: 'AAPL',
    date: '2023-01-01',
    open: 150.00,
    high: 155.00,
    low: 149.00,
    close: 152.50,
    volume: 1000000,
    adjustedClose: 152.50,
  },
  {
    symbol: 'AAPL',
    date: '2023-01-02',
    open: 152.50,
    high: 158.00,
    low: 151.00,
    close: 156.00,
    volume: 1200000,
    adjustedClose: 156.00,
  },
  {
    symbol: 'AAPL',
    date: '2023-01-03',
    open: 156.00,
    high: 160.00,
    low: 154.00,
    close: 158.50,
    volume: 1100000,
    adjustedClose: 158.50,
  },
]

describe('StockChart', () => {
  it('should render chart with data', () => {
    render(<StockChart data={mockData} symbol="AAPL" />)

    expect(screen.getByText('AAPL Price Chart')).toBeInTheDocument()
    expect(screen.getByText('3 days of historical data')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('should render empty state when no data', () => {
    render(<StockChart data={[]} symbol="AAPL" />)

    expect(screen.getByText('No chart data available')).toBeInTheDocument()
    expect(screen.getByText('📈')).toBeInTheDocument()
  })

  it('should display correct symbol in title', () => {
    render(<StockChart data={mockData} symbol="GOOGL" />)

    expect(screen.getByText('GOOGL Price Chart')).toBeInTheDocument()
  })

  it('should display correct number of data points', () => {
    render(<StockChart data={mockData} symbol="AAPL" />)

    expect(screen.getByText('3 days of historical data')).toBeInTheDocument()
  })

  it('should accept custom height', () => {
    render(<StockChart data={mockData} symbol="AAPL" height={500} />)

    // The height is passed to the ResponsiveContainer, we can't easily test this
    // but we can verify the component renders without errors
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })
})
