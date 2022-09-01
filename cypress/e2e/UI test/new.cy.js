/// <reference types="cypress" />

const utils = require('../../support/utils')

describe('New interface', () => {

    const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
    const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');
    let randomNumber = utils.randomNumber()
    let randomString = utils.randomString();

    describe('Send payment', () => {

        beforeEach(() => {
            cy.viewport(1920, 1080)
        })

        it('Successful payment and create another', () => {

            cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, randomNumber, randomString)
            //cy.get('.MuiTypography-root.MuiTypography-h6').contains('Paid').should('contain.value', randomNumber)
            cy.get('[data-test="alert-bar-success"]').should('be.visible')
            cy.get('.MuiButton-label').contains('Create Another Transaction').click()
            cy.get('.MuiSvgIcon-root.MuiStepIcon-root').each(($el, index) => {

                if (index === 0) {
                    cy.wrap($el).should('have.class', 'MuiStepIcon-active')
                } else {
                    cy.wrap($el).should('not.have.class', 'MuiStepIcon-active')
                }
            })
        })
        it('Successful payment and Return To Transactions', () => {

            cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, randomNumber, randomString)
            cy.get('[data-test="alert-bar-success"]').should('be.visible')
            cy.get('.MuiButton-label').contains('Return To Transactions').click()
            cy.url().should('deep.equal', `${Cypress.config().baseUrl}/`)

        })

    })

    describe('Request payment and ', () => {

        beforeEach(() => {
            cy.viewport(1920, 1080)
        })

        it.only('Successful payment request', () => {
            cy.doRequest(DEFAULT_USERNAME, DEFAULT_PASSWORD, randomNumber, randomString)
        })

    })


})
