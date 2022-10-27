/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('User Sign In', () => {
  context('Given that the user is using valid credentials', () => {
    const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
    const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');

    context('When the user tries to login', () => {
      beforeEach(() => {
        cy.visit('/signin')
      })

      it('Then successful login should happen and user is redirected to frontpage', () => {
        cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD);
        cy.url().should('deep.equal', `${Cypress.config().baseUrl}/`)
        cy.get('.MuiTypography-root').contains('@').should('contain', DEFAULT_USERNAME)
      })
    })
  })

  context('Given that the user is using invalid credentials', () => {
    const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
    const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');
    const INVALID_PASSWORD = "invalid123"
    const INVALID_USERNAME = "invalidUsername"

    context('When the user tries to login', () => {
      beforeEach(() => {
        cy.visit('/signin')
      })

      it('Then login does not happen with wrong password', () => {
        cy.signIn(DEFAULT_USERNAME, INVALID_PASSWORD);
        cy.url().should('deep.equal', `${Cypress.config().baseUrl}/signin`)
        cy.get('.MuiAlert-message').should('contain.text', 'Username or password is invalid')
      })
      it('Then login does not happen with wrong username', () => {
        cy.signIn(INVALID_USERNAME, DEFAULT_PASSWORD);
        cy.url().should('deep.equal', `${Cypress.config().baseUrl}/signin`)
        cy.get('.MuiAlert-message').should('contain.text', 'Username or password is invalid')
      })

    })
  })

  context('Given that the user is already signed in', () => {
    const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
    const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');

    beforeEach(() => {
      cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
    })

    context('When the user tries to logout', () => {
      it('Then successfull logout should happen', () => {
        cy.get('.MuiTypography-root').contains('Logout').click()
        cy.url().should('contain', '/signin')
      })
    })
  })

})
