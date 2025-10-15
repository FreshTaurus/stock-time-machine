// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for API calls to complete
Cypress.Commands.add('waitForApiCalls', () => {
  cy.intercept('GET', '**/alphavantage.co/**').as('alphaVantage')
  cy.intercept('GET', '**/newsapi.org/**').as('newsApi')
  
  // Wait for API calls to complete (if any)
  cy.wait('@alphaVantage', { timeout: 10000 }).then(() => {
    // API call completed
  }).catch(() => {
    // No API call made, continue
  })
})

// Custom command to mock API responses
Cypress.Commands.add('mockApiResponses', () => {
  cy.intercept('GET', '**/alphavantage.co/**', {
    fixture: 'stock-data.json'
  }).as('mockStockData')
  
  cy.intercept('GET', '**/newsapi.org/**', {
    fixture: 'news-data.json'
  }).as('mockNewsData')
})
