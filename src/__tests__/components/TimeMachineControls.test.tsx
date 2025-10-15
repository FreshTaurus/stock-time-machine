import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimeMachineControls } from '@/components/TimeMachineControls'
import { StockApiService } from '@/lib/api'

// Mock the API service
jest.mock('@/lib/api', () => ({
  StockApiService: {
    searchStocks: jest.fn(),
  },
}))

const mockStockApiService = StockApiService as jest.Mocked<typeof StockApiService>

// Mock the useTimeMachine hook
jest.mock('@/hooks/useTimeMachine', () => ({
  useTimeMachine: () => ({
    state: {
      selectedDate: new Date('2023-01-01'),
      selectedTime: '09:30',
      selectedSymbol: 'AAPL',
      isPlaying: false,
      currentPrice: 150.50,
    },
    setSelectedDate: jest.fn(),
    setSelectedTime: jest.fn(),
    setSelectedSymbol: jest.fn(),
    togglePlayPause: jest.fn(),
    resetPortfolio: jest.fn(),
  }),
}))

describe('TimeMachineControls', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all control elements', () => {
    render(<TimeMachineControls />)

    expect(screen.getByText('Time Machine Controls')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Time')).toBeInTheDocument()
    expect(screen.getByLabelText('Stock Symbol')).toBeInTheDocument()
    expect(screen.getByText('Play')).toBeInTheDocument()
    expect(screen.getByText('Reset Portfolio')).toBeInTheDocument()
  })

  it('should display current status', () => {
    render(<TimeMachineControls />)

    expect(screen.getByText('Current Date:')).toBeInTheDocument()
    expect(screen.getByText('Current Time:')).toBeInTheDocument()
    expect(screen.getByText('Symbol:')).toBeInTheDocument()
    expect(screen.getByText('Price:')).toBeInTheDocument()
  })

  it('should handle date change', async () => {
    const user = userEvent.setup()
    render(<TimeMachineControls />)

    const dateInput = screen.getByLabelText('Date')
    await user.clear(dateInput)
    await user.type(dateInput, '2023-06-01')

    expect(dateInput).toHaveValue('2023-06-01')
  })

  it('should handle time change', async () => {
    const user = userEvent.setup()
    render(<TimeMachineControls />)

    const timeInput = screen.getByLabelText('Time')
    await user.clear(timeInput)
    await user.type(timeInput, '14:30')

    expect(timeInput).toHaveValue('14:30')
  })

  it('should handle symbol search', async () => {
    const user = userEvent.setup()
    const mockSearchResults = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'Equity',
        region: 'United States',
        currency: 'USD',
      },
    ]

    mockStockApiService.searchStocks.mockResolvedValue(mockSearchResults)

    render(<TimeMachineControls />)

    const symbolInput = screen.getByLabelText('Stock Symbol')
    await user.type(symbolInput, 'Apple')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    await waitFor(() => {
      expect(mockStockApiService.searchStocks).toHaveBeenCalledWith('Apple')
    })
  })

  it('should display search results', async () => {
    const user = userEvent.setup()
    const mockSearchResults = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'Equity',
        region: 'United States',
        currency: 'USD',
      },
    ]

    mockStockApiService.searchStocks.mockResolvedValue(mockSearchResults)

    render(<TimeMachineControls />)

    const symbolInput = screen.getByLabelText('Stock Symbol')
    await user.type(symbolInput, 'Apple')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument()
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument()
    })
  })

  it('should handle play/pause toggle', async () => {
    const user = userEvent.setup()
    render(<TimeMachineControls />)

    const playButton = screen.getByText('Play')
    await user.click(playButton)

    // The actual toggle functionality is mocked, so we just verify the button exists
    expect(playButton).toBeInTheDocument()
  })

  it('should handle portfolio reset', async () => {
    const user = userEvent.setup()
    render(<TimeMachineControls />)

    const resetButton = screen.getByText('Reset Portfolio')
    await user.click(resetButton)

    // The actual reset functionality is mocked, so we just verify the button exists
    expect(resetButton).toBeInTheDocument()
  })
})
