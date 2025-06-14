import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import { WalletProvider } from '../contexts/WalletContext'
import App from '../App'
// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    getSystemInfo: vi.fn().mockResolvedValue({
      system_name: 'Binoma DIS',
      version: '1.0.0',
      status: 'operational'
    }),
    login: vi.fn(),
    register: vi.fn(),
    getWalletBalance: vi.fn(),
    createWallet: vi.fn(),
    getTransactionHistory: vi.fn()
  }
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <WalletProvider>
        {component}
      </WalletProvider>
    </BrowserRouter>
  )
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    renderWithProviders(<App />)
    expect(screen.getByText(/Binoma/i)).toBeInTheDocument()
  })

  it('displays navigation menu', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('handles routing correctly', async () => {
    renderWithProviders(<App />)
    
    // Test navigation to different pages
    const dashboardLink = screen.getByText(/Dashboard/i)
    fireEvent.click(dashboardLink)
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })

  test('contains navigation menu', () => {
    renderWithProviders(<App />)
    
    // Check for navigation items
    expect(screen.getByText('Wallet')).toBeInTheDocument()
    expect(screen.getByText('Transactions')).toBeInTheDocument()
    expect(screen.getByText('Purchase')).toBeInTheDocument()
    expect(screen.getByText('Withdraw')).toBeInTheDocument()
    expect(screen.getByText('Stats')).toBeInTheDocument()
  })

  test('displays BINOMENA branding', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('BINOMENA')).toBeInTheDocument()
  })
})

describe('Authentication Flow', () => {
  it('shows login form when not authenticated', () => {
    renderWithProviders(<App />)
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
  })

  it('handles login form submission', async () => {
    renderWithProviders(<App />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    // Verify API call was made
    await waitFor(() => {
      expect(vi.mocked(require('../services/api').apiService.login)).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('handles registration form submission', async () => {
    renderWithProviders(<App />)
    
    // Navigate to registration
    const registerLink = screen.getByText(/Register/i)
    fireEvent.click(registerLink)

    const fullNameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const idNumberInput = screen.getByLabelText(/id number/i)
    const registerButton = screen.getByRole('button', { name: /register/i })

    fireEvent.change(fullNameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(idNumberInput, { target: { value: 'TEST001' } })
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(vi.mocked(require('../services/api').apiService.register)).toHaveBeenCalledWith({
        full_name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        id_number: 'TEST001'
      })
    })
  })
})

describe('Wallet Operations', () => {
  it('displays wallet balance', async () => {
    vi.mocked(require('../services/api').apiService.getWalletBalance).mockResolvedValue({
      balance: 1000.50,
      currency: 'DUSD'
    })

    renderWithProviders(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/1000.50/)).toBeInTheDocument()
      expect(screen.getByText(/DUSD/)).toBeInTheDocument()
    })
  })

  it('handles wallet creation', async () => {
    vi.mocked(require('../services/api').apiService.createWallet).mockResolvedValue({
      address: 'BINOMA_WALLET_123456789',
      balance: 0
    })

    renderWithProviders(<App />)
    
    const createWalletButton = screen.getByRole('button', { name: /create wallet/i })
    fireEvent.click(createWalletButton)

    await waitFor(() => {
      expect(vi.mocked(require('../services/api').apiService.createWallet)).toHaveBeenCalled()
    })
  })
})

describe('Transaction History', () => {
  it('displays transaction history', async () => {
    const mockTransactions = [
      {
        id: 'tx-001',
        from_address: 'WALLET_001',
        to_address: 'WALLET_002',
        amount: 100.00,
        status: 'completed',
        created_at: '2024-01-01T00:00:00Z'
      }
    ]

    vi.mocked(require('../services/api').apiService.getTransactionHistory).mockResolvedValue({
      transactions: mockTransactions,
      total: 1
    })

    renderWithProviders(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/tx-001/)).toBeInTheDocument()
      expect(screen.getByText(/100.00/)).toBeInTheDocument()
      expect(screen.getByText(/completed/i)).toBeInTheDocument()
    })
  })
})

describe('Error Handling', () => {
  it('displays error messages for failed API calls', async () => {
    vi.mocked(require('../services/api').apiService.login).mockRejectedValue(
      new Error('Invalid credentials')
    )

    renderWithProviders(<App />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('handles network errors gracefully', async () => {
    vi.mocked(require('../services/api').apiService.getSystemInfo).mockRejectedValue(
      new Error('Network error')
    )

    renderWithProviders(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })
})

describe('Responsive Design', () => {
  it('adapts to mobile viewport', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    renderWithProviders(<App />)
    
    // Check for mobile-specific elements or classes
    expect(document.querySelector('.mobile-menu')).toBeInTheDocument()
  })

  it('displays desktop layout on larger screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    renderWithProviders(<App />)
    
    // Check for desktop-specific elements
    expect(document.querySelector('.desktop-nav')).toBeInTheDocument()
  })
})

describe('Accessibility', () => {
  it('has proper ARIA labels', () => {
    renderWithProviders(<App />)
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('supports keyboard navigation', () => {
    renderWithProviders(<App />)
    
    const firstButton = screen.getAllByRole('button')[0]
    firstButton.focus()
    
    expect(document.activeElement).toBe(firstButton)
  })
})

describe('Performance', () => {
  it('loads components efficiently', async () => {
    const startTime = performance.now()
    
    renderWithProviders(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/Binoma/i)).toBeInTheDocument()
    })
    
    const endTime = performance.now()
    const loadTime = endTime - startTime
    
    // Should load within reasonable time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(1000)
  })
}) 