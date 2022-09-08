/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('Authentication', () => {

  const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
  const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');

  describe('Login', () => {

    beforeEach(() => {
      cy.visit('/signin')
    })

    it('Successful login', () => {

      cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD);

      cy.url().should('deep.equal', `${Cypress.config().baseUrl}/`)
      cy.get('.MuiTypography-root').contains('@').should('contain', DEFAULT_USERNAME)
    })

    it('Does not login user with wrong password', () => {

      cy.signIn(DEFAULT_USERNAME, '1234');

      cy.url().should('deep.equal', `${Cypress.config().baseUrl}/signin`)
      cy.get('.MuiAlert-message').should('contain.text', 'Username or password is invalid')
    })
  })

  describe('Sign up', () => {
    let firstName = utils.randomString();
    let lastName = utils.randomString();
    let password = utils.randomString();
    let userName = utils.randomString();

    beforeEach(() => {
      cy.visit('/signup')
    })

    it('Successful sign up', () => {
      cy.get('#firstName').type(firstName)
      cy.get('#lastName').type(lastName)
      cy.get('#username').type(userName)
      cy.get('#password').type(password)
      cy.get('#confirmPassword').type(password)
      cy.get('.MuiButton-label').contains('Sign Up').click()
      cy.url().should('contain', '/signin')
    })

    it('Cannot continue without all required fields', () => {

      cy.get('#lastName').type(lastName)
      cy.get('#username').type(userName)
      cy.get('#password').type(password)
      cy.get('#confirmPassword').type(password)
      cy.get('.MuiButton-label').contains('Sign Up').should('not.be.enabled')


      cy.get('#firstName').type(firstName)
      cy.get('#lastName').clear()
      cy.get('.MuiButton-label').contains('Sign Up').should('not.be.enabled')

      cy.get('#lastName').type(lastName)
      cy.get('#username').clear()
      cy.get('.MuiButton-label').contains('Sign Up').should('not.be.enabled')

      cy.get('#password').clear()
      cy.get('#username').type(userName)
      cy.get('.MuiButton-label').contains('Sign Up').should('not.be.enabled')


      cy.get('#confirmPassword').clear()
      cy.get('#password').type(password)
      cy.get('.MuiButton-label').contains('Sign Up').should('not.be.enabled')
    })

    it('Password minimum length', () => {

      cy.get('#firstName').type(firstName)
      cy.get('#lastName').type(lastName)
      cy.get('#username').type(userName)
      cy.get('#password').type('1')
      cy.get('#confirmPassword').type(password)
      cy.get('#password-helper-text').should('contain.text', 'Password must contain at least 4 characters')

      cy.get('#password').type('2')
      cy.get('#password-helper-text').should('contain.text', 'Password must contain at least 4 characters')

      cy.get('#password').type('3')
      cy.get('#password-helper-text').should('contain.text', 'Password must contain at least 4 characters')

    })

    it('Match confirm password ', () => {
      cy.get('#firstName').type(firstName)
      cy.get('#lastName').type(lastName)
      cy.get('#username').type(userName)
      cy.get('#password').type(password)
      cy.get('#confirmPassword').type('a')
      cy.get('#confirmPassword-helper-text').should('contain.text', 'Password does not match')
      cy.get('.MuiButton-label').contains('Sign Up').should('not.be.enabled')

    })
  })

  describe('Logout', () => {

    it('Successful logout', () => {
      cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
      cy.get('.MuiTypography-root').contains('Logout').click()
      cy.url().should('contain', '/signin')
    })
  })

})
