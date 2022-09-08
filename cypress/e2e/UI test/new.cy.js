/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('New interface', () => {

    const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
    const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');
    let paymentValue = utils.paymentValue()
    let randomString = utils.randomString();

    describe('Send payment', () => {

        beforeEach(() => {
            cy.viewport(1920, 1080)
        })

        it.only('Successful payment and create another', () => {
            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')
            cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay')
            cy.get('@balanceBeforePay').then((balanceBeforePay) => {
                cy.log(balanceBeforePay)
                balanceBefore = parseFloat(balanceBeforePay.substr(1))


            })
                .then(() => {

                    return cy.wait('@checkAuth').then(() => {
                        cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPay')
                        cy.get('@balanceAfterPay').then((balanceAfterPay) => {
                            cy.log(balanceAfterPay)
                            balanceAfter = parseFloat(balanceAfterPay.substr(1))

                        })
                    })
                }).then(() => {
                    cy.wrap(balanceAfter).should('deep.equal', (balanceBefore - parseFloat(paymentValue)))
                })

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

            cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString)
            cy.get('[data-test="alert-bar-success"]').should('be.visible')
            cy.get('.MuiButton-label').contains('Return To Transactions').click()
            cy.url().should('deep.equal', `${Cypress.config().baseUrl}/`)

        })

    })

    describe('Request payment', () => {

        beforeEach(() => {
            cy.viewport(1920, 1080)
        })

        it('Successful request and create anoter', () => {
            cy.doRequest(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString)
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

            cy.doRequest(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString)
            cy.get('[data-test="alert-bar-success"]').should('be.visible')
            cy.get('.MuiButton-label').contains('Return To Transactions').click()
            cy.url().should('deep.equal', `${Cypress.config().baseUrl}/`)

        })
    })


})
