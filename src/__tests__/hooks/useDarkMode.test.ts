import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from '@/hooks/useDarkMode'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('useDarkMode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with light mode by default', () => {
    const { result } = renderHook(() => useDarkMode())
    
    expect(result.current.isDarkMode).toBe(false)
  })

  it('should initialize with dark mode if saved in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    
    const { result } = renderHook(() => useDarkMode())
    
    expect(result.current.isDarkMode).toBe(true)
  })

  it('should toggle dark mode', () => {
    const { result } = renderHook(() => useDarkMode())
    
    expect(result.current.isDarkMode).toBe(false)
    
    act(() => {
      result.current.toggleDarkMode()
    })
    
    expect(result.current.isDarkMode).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should save theme preference to localStorage', () => {
    const { result } = renderHook(() => useDarkMode())
    
    act(() => {
      result.current.toggleDarkMode()
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
    
    act(() => {
      result.current.toggleDarkMode()
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
  })
})
