declare namespace Cypress {
  interface Chainable<Subject> {
    getByTestId(): Chainable<any>
    addProductToCartByIndex(): Chainable<any>
  }
}
