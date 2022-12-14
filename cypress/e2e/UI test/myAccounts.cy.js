/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('My account interface', () => {
    context('Given the user has valid credentials and login it account', () => {
        const EDIT_PASSWORD = Cypress.env('EDIT_PASSWORD');
        const EDIT_USERNAME = Cypress.env('EDIT_USERNAME');
        let firstName = utils.randomString();
        let lastName = utils.randomString();
        let randomString = utils.randomString();
        let randomNumber = utils.randomNumber()
        beforeEach(() => {
            cy.signIn(EDIT_USERNAME, EDIT_PASSWORD);
        })
        context('When the user updates settings', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('My Account').click()
                cy.get('#user-settings-firstName-input').clear().type(firstName)
                cy.get('#user-settings-lastName-input').clear().type(lastName)
                cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
                cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)
                cy.get('.MuiButton-label').contains('Save').click()
            })
            it('Then the account name should be updated', () => {

                cy.get('h6[data-test*="sidenav-user-full-name"]').should('contain.text', firstName)

            })
        })
        context('When the user tries update settings missing first name', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('My Account').click()
                cy.get('#user-settings-firstName-input').clear()
                cy.get('#user-settings-lastName-input').clear().type(lastName)
                cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
                cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)

            })
            it('Then the save button should not be available and it should shows a warning message', () => {
                cy.get('.MuiButton-label').contains('Save').should('not.be.enabled')
                cy.get('#user-settings-firstName-input-helper-text').should('contain.text', 'Enter a first name')
            })

        })
        context('When the user tries update settings missing last name', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('My Account').click()
                cy.get('#user-settings-firstName-input').clear().type(firstName)
                cy.get('#user-settings-lastName-input').clear()
                cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
                cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)

            })
            it('Then the save button should not be available and it should shows a warning message', () => {
                cy.get('.MuiButton-label').contains('Save').should('not.be.enabled')
                cy.get('#user-settings-lastName-input-helper-text').should('contain.text', 'Enter a last name')
            })

        })
        context('When the user tries update settings missing email address', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('My Account').click()
                cy.get('#user-settings-firstName-input').clear().type(firstName)
                cy.get('#user-settings-lastName-input').clear().type(lastName)
                cy.get('#user-settings-email-input').clear()
                cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)

            })
            it('Then the save button should not be available and it should shows a warning message', () => {
                cy.get('.MuiButton-label').contains('Save').should('not.be.enabled')
                cy.get('#user-settings-email-input-helper-text').should('contain.text', 'Enter an email address')
            })

        })
        context('When the user tries update settings missing phone numbe', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('My Account').click()
                cy.get('#user-settings-firstName-input').clear().type(firstName)
                cy.get('#user-settings-lastName-input').clear().type(lastName)
                cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
                cy.get('#user-settings-phoneNumber-input').clear()

            })
            it('Then the save button should not be available and it should shows a warning message', () => {
                cy.get('.MuiButton-label').contains('Save').should('not.be.enabled')
                cy.get('#user-settings-phoneNumber-input-helper-text').should('contain.text', 'Enter a phone number')
            })

        })
        context('When the user tries update settings using invalid email format', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('My Account').click()
                cy.get('#user-settings-firstName-input').clear().type(firstName)
                cy.get('#user-settings-lastName-input').clear().type(lastName)
                cy.get('#user-settings-email-input').clear().type(`${randomString}`)
                cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)

            })
            it('Then the save button should not be available and it should shows a warning message', () => {
                cy.get('.MuiButton-label').contains('Save').should('not.be.enabled')
                cy.get('#user-settings-email-input-helper-text').should('contain.text', 'Must contain a valid email address')
            })

        })
        context('When the user tries update settings using invalid phone number', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('My Account').click()
                cy.get('#user-settings-firstName-input').clear().type(firstName)
                cy.get('#user-settings-lastName-input').clear().type(lastName)
                cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
                cy.get('#user-settings-phoneNumber-input').clear().type(randomString)
            })
            it('Then the save button should not be available and it should shows a warning message', () => {
                cy.get('.MuiButton-label').contains('Save').should('not.be.enabled')
                cy.get('#user-settings-phoneNumber-input-helper-text').should('contain.text', 'Phone number is not valid')
            })

        })
    })
})