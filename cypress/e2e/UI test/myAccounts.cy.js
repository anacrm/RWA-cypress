/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('Given User try to use settings function', () => {

    const EDIT_PASSWORD = Cypress.env('EDIT_PASSWORD');
    const EDIT_USERNAME = Cypress.env('EDIT_USERNAME');

    describe('When Update user settings is accessed', () => {

        let firstName = utils.randomString();
        let lastName = utils.randomString();
        let randomString = utils.randomString();
        let randomNumber = utils.randomNumber()
        beforeEach(() => {
            cy.signIn(EDIT_USERNAME, EDIT_PASSWORD);
        })

        it('Then check that a successful user settings update is possible', () => {

            cy.get('.MuiTypography-root').contains('My Account').click()
            cy.get('#user-settings-firstName-input').clear().type(firstName)
            cy.get('#user-settings-lastName-input').clear().type(lastName)
            cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
            cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)
            cy.get('.MuiButton-label').contains('Save').click()
            cy.get('h6[data-test*="sidenav-user-full-name"]').should('contain.text', firstName)
        })
        it('Then check that is not possible save user settings without all the required fields are filled', () => {

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

        it('Then check the requirement of a valid email format', () => {

            cy.get('.MuiTypography-root').contains('My Account').click()
            cy.get('#user-settings-firstName-input').clear().type(firstName)
            cy.get('#user-settings-lastName-input').clear().type(lastName)
            cy.get('#user-settings-email-input').clear().type(`${randomString}`)
            cy.get('#user-settings-phoneNumber-input').clear().type(randomNumber)
            cy.get('#user-settings-email-input-helper-text').should('contain.text', 'Must contain a valid email address')
        })

        it('Then check the requirement of a valid Phone number format', () => {

            cy.get('.MuiTypography-root').contains('My Account').click()
            cy.get('#user-settings-firstName-input').clear().type(firstName)
            cy.get('#user-settings-lastName-input').clear().type(lastName)
            cy.get('#user-settings-email-input').clear().type(`${randomString}@gmail.com`)
            cy.get('#user-settings-phoneNumber-input').clear().type(randomString)
            cy.get('#user-settings-phoneNumber-input-helper-text').should('contain.text', 'Phone number is not valid')
        })
    })
})