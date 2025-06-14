export {}; // Make this file a module

describe('Digital Infrastructure System', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    // Reset test database state before each test
    cy.request('POST', 'http://localhost:8080/api/test/reset')
  })

  describe('Authentication', () => {
    it('should allow user registration', () => {
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
      // Verify user was created in database
      cy.request('GET', 'http://localhost:8080/api/users/test@example.com')
        .its('body')
        .should('have.property', 'email', 'test@example.com')
    })

    it('should allow user login', () => {
      // First register the user
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
      
      // Then test login
      cy.get('[data-testid="login-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
      cy.get('[data-testid="dashboard"]').should('be.visible')
    })
  })

  describe('Wallet Management', () => {
    beforeEach(() => {
      // Register and login before each test
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
      cy.get('[data-testid="login-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
    })

    it('should display wallet balance', () => {
      cy.get('[data-testid="wallet-balance"]').should('be.visible')
      // Verify balance matches database
      cy.request('GET', 'http://localhost:8080/api/wallets/test@example.com')
        .its('body')
        .should('have.property', 'balance')
    })

    it('should show transaction history', () => {
      cy.get('[data-testid="transaction-history"]').should('be.visible')
      cy.get('[data-testid="transaction-list"]').should('exist')
      // Verify transactions match database
      cy.request('GET', 'http://localhost:8080/api/transactions/test@example.com')
        .its('body')
        .should('be.an', 'array')
    })
  })

  describe('Transactions', () => {
    beforeEach(() => {
      // Register and login before each test
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
      cy.get('[data-testid="login-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
    })

    it('should allow sending tokens', () => {
      // First mint some tokens to the sender
      cy.request('POST', 'http://localhost:8080/api/test/mint', {
        address: 'test@example.com',
        amount: 100
      })
      
      cy.get('[data-testid="send-tokens-button"]').click()
      cy.get('[data-testid="recipient-address"]').type('recipient123')
      cy.get('[data-testid="amount-input"]').type('10')
      cy.get('[data-testid="send-button"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
      
      // Verify transaction in database
      cy.request('GET', 'http://localhost:8080/api/transactions/test@example.com')
        .its('body')
        .should('have.length.at.least', 1)
        .and('deep.include', {
          from: 'test@example.com',
          to: 'recipient123',
          amount: 10
        })
    })

    it('should show transaction confirmation', () => {
      // Create a test transaction
      cy.request('POST', 'http://localhost:8080/api/test/transaction', {
        from: 'test@example.com',
        to: 'recipient123',
        amount: 10
      })
      
      cy.get('[data-testid="transaction-history"]').click()
      cy.get('[data-testid="transaction-list"]').should('contain', '10')
    })
  })

  describe('Staking', () => {
    beforeEach(() => {
      // Register and login before each test
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
      cy.get('[data-testid="login-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
      
      // Mint tokens for staking
      cy.request('POST', 'http://localhost:8080/api/test/mint', {
        address: 'test@example.com',
        amount: 1000
      })
    })

    it('should allow staking tokens', () => {
      cy.get('[data-testid="staking-button"]').click()
      cy.get('[data-testid="stake-amount"]').type('100')
      cy.get('[data-testid="stake-submit"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
      
      // Verify stake in database
      cy.request('GET', 'http://localhost:8080/api/stakes/test@example.com')
        .its('body')
        .should('have.property', 'amount', 100)
    })

    it('should show staking rewards', () => {
      // Create a test stake
      cy.request('POST', 'http://localhost:8080/api/test/stake', {
        address: 'test@example.com',
        amount: 100
      })
      
      cy.get('[data-testid="staking-rewards"]').should('be.visible')
      cy.get('[data-testid="rewards-amount"]').should('exist')
    })
  })

  describe('Governance', () => {
    beforeEach(() => {
      // Register and login before each test
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
      cy.get('[data-testid="login-button"]').click()
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="submit-button"]').click()
    })

    it('should show active proposals', () => {
      // Create a test proposal
      cy.request('POST', 'http://localhost:8080/api/test/proposal', {
        title: 'Test Proposal',
        description: 'Test Description'
      })
      
      cy.get('[data-testid="governance-button"]').click()
      cy.get('[data-testid="proposals-list"]').should('be.visible')
      cy.get('[data-testid="proposal-title"]').should('contain', 'Test Proposal')
    })

    it('should allow voting on proposals', () => {
      // Create a test proposal
      cy.request('POST', 'http://localhost:8080/api/test/proposal', {
        title: 'Test Proposal',
        description: 'Test Description'
      })
      
      cy.get('[data-testid="governance-button"]').click()
      cy.get('[data-testid="vote-button"]').first().click()
      cy.get('[data-testid="vote-confirm"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
      
      // Verify vote in database
      cy.request('GET', 'http://localhost:8080/api/votes/test@example.com')
        .its('body')
        .should('have.length.at.least', 1)
    })
  })

  describe('System Health', () => {
    it('should show system status', () => {
      cy.get('[data-testid="system-status"]').should('be.visible')
      // Verify backend health
      cy.request('GET', 'http://localhost:8080/health')
        .its('body')
        .should('have.property', 'status', 'healthy')
    })

    it('should display network metrics', () => {
      cy.get('[data-testid="metrics-button"]').click()
      cy.get('[data-testid="network-metrics"]').should('be.visible')
      // Verify metrics from backend
      cy.request('GET', 'http://localhost:8080/api/metrics')
        .its('body')
        .should('have.property', 'total_transactions')
    })
  })
}) 