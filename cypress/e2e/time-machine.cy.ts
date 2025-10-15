describe('Stock Time Machine E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the main page', () => {
    cy.contains('Stock Time Machine').should('be.visible')
    cy.contains('Explore historical stock data').should('be.visible')
  })

  it('should display time machine controls', () => {
    cy.contains('Time Machine Controls').should('be.visible')
    cy.get('input[type="date"]').should('be.visible')
    cy.get('input[type="time"]').should('be.visible')
    cy.get('input[placeholder*="Search for a stock symbol"]').should('be.visible')
  })

  it('should allow changing the date', () => {
    cy.get('input[type="date"]').clear().type('2023-06-01')
    cy.get('input[type="date"]').should('have.value', '2023-06-01')
  })

  it('should allow changing the time', () => {
    cy.get('input[type="time"]').clear().type('14:30')
    cy.get('input[type="time"]').should('have.value', '14:30')
  })

  it('should display portfolio summary', () => {
    cy.contains('Portfolio Summary').should('be.visible')
    cy.contains('Total Value').should('be.visible')
    cy.contains('Cash').should('be.visible')
    cy.contains('P&L').should('be.visible')
  })

  it('should display trading form', () => {
    cy.contains('Execute Trade').should('be.visible')
    cy.get('select').should('be.visible')
    cy.get('input[type="number"]').should('be.visible')
  })

  it('should allow selecting trade type', () => {
    cy.get('select').select('sell')
    cy.get('select').should('have.value', 'sell')
  })

  it('should allow entering quantity', () => {
    cy.get('input[type="number"]').clear().type('10')
    cy.get('input[type="number"]').should('have.value', '10')
  })

  it('should display news section', () => {
    cy.contains('News & Events').should('be.visible')
  })

  it('should be responsive on mobile', () => {
    cy.viewport(375, 667)
    cy.contains('Stock Time Machine').should('be.visible')
    cy.get('input[type="date"]').should('be.visible')
  })

  it('should display footer', () => {
    cy.contains('Built with Next.js').should('be.visible')
    cy.contains('Data provided by Alpha Vantage').should('be.visible')
  })
})
