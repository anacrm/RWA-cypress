/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('User sign up', () => {
    context('Given the user is giving all the valid information', () => {
        let firstName = utils.randomString();
        let lastName = utils.randomString();
        let password = utils.randomString();
        let userName = utils.randomString();
        context('When the user tries sign up', () => {
            beforeEach(() => {
                cy.visit('/signup')
            })

            it('Then successful sign up should happen', () => {
                cy.get('#firstName').type(firstName)
                cy.get('#lastName').type(lastName)
                cy.get('#username').type(userName)
                cy.get('#password').type(password)
                cy.get('#confirmPassword').type(password)
                cy.get('.MuiButton-label').contains('Sign Up').click()
                cy.url().should('contain', '/signin')
            })
        })
    })
    context('Given the user is using invalid or missing information', () => {
        let firstName = utils.randomString();
        let lastName = utils.randomString();
        let password = utils.randomString();
        let userName = utils.randomString();
        context('When the user tries to sign up', () => {
            beforeEach(() => {
                cy.visit('/signup')
            })
            it('Then it should show validation error for missing fields', () => {

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
            it('Then it should show validation error for minimum password length', () => {

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
            it('Then it should show validation error for mismatching password', () => {
                cy.get('#firstName').type(firstName)
                cy.get('#lastName').type(lastName)
                cy.get('#username').type(userName)
                cy.get('#password').type(password)
                cy.get('#confirmPassword').type('a')
                cy.get('#confirmPassword-helper-text').should('contain.text', 'Password does not match')
                cy.get('.MuiButton-label').contains('Sign Up').should('not.be.enabled')

            })
        })
    })

})