// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid="${selector}"]`)
})

Cypress.Commands.add('addProductToCartByIndex', (indexes) => {
  cy.get('[data-testid="product-card"]').as('productCards')

  const addByIndex = (i) => {
    cy.get('@productCards').eq(i).find('button').click()
  }

  const addByIndexes = (list) => {
    for (const i of list) {
      addByIndex(i)
    }
  }

  const addAll = () => {
    cy.get('@productCards')
      .find('button')
      .click({ multiple: true, force: true })
  }

  if (indexes && Array.isArray(indexes)) addByIndexes(indexes)
  else if (indexes && typeof indexes == 'string' && indexes === 'all') addAll()
  else throw new Error('Please provide a valid input for cy.addProductToCartByIndex(). Example: [0, 1, 2] or "all".')
})
