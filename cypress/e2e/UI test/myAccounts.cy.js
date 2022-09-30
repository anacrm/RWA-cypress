/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('User settings', () => {

    const EDIT_PASSWORD = Cypress.env('EDIT_PASSWORD');
    const EDIT_USERNAME = Cypress.env('EDIT_USERNAME');

    describe('Update user settings', () => {

        let firstName = utils.randomString();
        let lastName = utils.randomString();
        let randomString = utils.randomString();
        let randomNumber = utils.randomNumber()

        beforeEach(() => {
            cy.visit('/signin')
            cy.signIn(EDIT_USERNAME, EDIT_PASSWORD);
        })

        it('Successful update', () => {

            cy.get('.MuiTypography-root').contains('My Account').click()
            cy.get('#user-settings-firstName-input').clear().type(firstName)
            cy.get('#user-settings-lastName-input').clear().type(lastName)
            cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
            cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)
            cy.get('.MuiButton-label').contains('Save').click()
            cy.get('h6[data-test*="sidenav-user-full-name"]').should('contain.text', firstName)
        })
        it('Can not save without required fields', () => {

            cy.get('.MuiTypography-root').contains('My Account').click()
            cy.get('#user-settings-firstName-input').clear()
            cy.get('#user-settings-lastName-input').clear().type(lastName)
            cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
            cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)
            cy.get('.MuiButton-label').contains('Save').should('not.be.enabled')
            cy.get('#user-settings-firstName-input-helper-text').should('contain.text', 'Enter a first name')

            cy.get('#user-settings-firstName-input').type(firstName)
            cy.get('#user-settings-lastName-input').clear()
            cy.get('#user-settings-lastName-input-helper-text').should('contain.text', 'Enter a last name')

            cy.get('#user-settings-lastName-input').type(lastName)
            cy.get('#user-settings-email-input').clear()
            cy.get('#user-settings-email-input-helper-text').should('contain.text', 'Enter an email address')


            cy.get('#user-settings-email-input').type(`${randomString}@gmail.com`)
            cy.get('#user-settings-phoneNumber-input').clear()
            cy.get('#user-settings-phoneNumber-input-helper-text').should('contain.text', 'Enter a phone number')

        })

        it('Invalid email format', () => {

            cy.get('.MuiTypography-root').contains('My Account').click()
            cy.get('#user-settings-firstName-input').clear().type(firstName)
            cy.get('#user-settings-lastName-input').clear().type(lastName)
            cy.get('#user-settings-email-input').clear().type(`${randomString}`)
            cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)
            cy.get('#user-settings-email-input-helper-text').should('contain.text', 'Must contain a valid email address')
        })

        it('Invalid Phone number format', () => {

            cy.get('.MuiTypography-root').contains('My Account').click()
            cy.get('#user-settings-firstName-input').clear().type(firstName)
            cy.get('#user-settings-lastName-input').clear().type(lastName)
            cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
            cy.get('#user-settings-phoneNumber-input').clear().type(randomString)
            cy.get('#user-settings-phoneNumber-input-helper-text').should('contain.text', 'Phone number is not valid')
        })
    })
})