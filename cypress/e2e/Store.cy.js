/// <reference types="Cypress" />

import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server
  const g = cy.get
  const gid = cy.getByTestId

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    cy.viewport('macbook-13')
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should display store', () => {
    server.createList('product', 10)
    cy.visit('/')

    g('body').contains('Brand')
    g('body').contains('Wrist Watch')
  })

  context('Store > Shopping Cart', () => {
    beforeEach(() => {
      server.createList('product', 10)
      cy.visit('/')
    })

    it('should not display shopping cart when page fist lodas', () => {
      gid('shopping-cart').should('have.class', 'hidden')
    })

    it('should toggle shopping cart visibility when button is clicked', () => {
      gid('toggle-button').as('toggleButton')
      gid('shopping-cart').as('shoppingCart')

      g('@toggleButton').click()
      g('@shoppingCart').should('not.have.class', 'hidden')

      gid('close-button').click()
      g('@shoppingCart').should('have.class', 'hidden')
    })

    it('should display "Cart is empty" message when there are no products', () => {
      gid('toggle-button').as('toggleButton')
      g('@toggleButton').click()
      gid('shopping-cart').contains('Cart is empty')
    })

    it('should open shopping cart when a product is added', () => {
      gid('product-card').first().find('button').click()
      gid('shopping-cart').should('not.have.class', 'hidden')
    })

    it('should add first product to the cart', () => {
      cy.addProductToCartByIndex([0])
      gid('cart-item').should('have.length', 1)
    })

    it('should add 3 product to the cart', () => {
      cy.addProductToCartByIndex([0, 1, 2])
      gid('cart-item').should('have.length', 3)
    })

    it('should add all (10) products to the cart', () => {
      cy.addProductToCartByIndex('all')
      gid('cart-item').should('have.length', 10)
    })

    it('should remove a product', () => {
      cy.addProductToCartByIndex([2])
      gid('cart-item').as('cartItems')

      g('@cartItems').should('have.length', 1)
      g('@cartItems').first().find('[data-testid="remove-button"]').click()
      g('@cartItems').should('have.length', 0)
    })

    it('should clear cart when "Clear cart" button is clicked', () => {
      cy.addProductToCartByIndex([0, 1, 2])
      gid('cart-item').as('cartItems')

      g('@cartItems').should('have.length', 3)
      gid('clear-cart-button').click()
      g('@cartItems').should('have.length', 0)
    })
  })

  context('Store > Product List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/')

      gid('product-card').should('have.length', 0)
      g('body').contains('0 Products')
    })

    it('should display "1 Product" when 1 product is returned', () => {
      server.createList('product', 1)
      cy.visit('/')

      gid('product-card').should('have.length', 1)
      g('body').contains('1 Product')
    })

    it('should display "10 Products" when 10 product is returned', () => {
      server.createList('product', 10)
      cy.visit('/')

      gid('product-card').should('have.length', 10)
      g('body').contains('10 Products')
    })
  })

  context('Store > Search for Products', () => {
    it('should type in the search field', () => {
      cy.visit('/')

      g('input[type="search"]')
        .type('Some text here')
        .should('have.value', 'Some text here')
    })

    it('should return 1 product when "Relógio TOP" is used as search term', () => {
      server.create('product', { title: 'Relógio TOP' })
      server.createList('product', 9)

      cy.visit('/')

      g('input[type="search"').type('Relógio TOP')
      gid('search-form').submit()

      gid('product-card').should('have.length', 1)
    })

    it('should not return any product', () => {
      server.createList('product', 10)

      cy.visit('/')

      g('input[type="search"').type('Relógio TOP')
      gid('search-form').submit()

      gid('product-card').should('have.length', 0)
      g('body').contains('0 Products')
    })
  })
})
