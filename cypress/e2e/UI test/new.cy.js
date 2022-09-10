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

        it('Successful payment and create another', () => {
            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay')

            cy.get('@balanceBeforePay')
                .then((balanceBeforePay) => {

                    balanceBefore = utils.toNumber(balanceBeforePay)
                    cy.doPaymentOnly(paymentValue, randomString)
                    cy.wait('@checkAuth')
                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPay')
                    return cy.get('@balanceAfterPay')
                })
                .then((balanceAfterPay) => {
                    balanceAfter = utils.toNumber(balanceAfterPay)
                })
                .then(() => {
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

            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay')

            cy.get('@balanceBeforePay')
                .then((balanceBeforePay) => {

                    balanceBefore = utils.toNumber(balanceBeforePay)
                    cy.doPaymentOnly(paymentValue, randomString)
                    cy.wait('@checkAuth')
                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPay')
                    return cy.get('@balanceAfterPay')
                })
                .then((balanceAfterPay) => {

                    balanceAfter = utils.toNumber(balanceAfterPay)

                })
                .then(() => {

                    cy.wrap(balanceAfter).should('deep.equal', (balanceBefore - parseFloat(paymentValue)))
                })

            cy.get('[data-test="alert-bar-success"]').should('be.visible')
            cy.get('.MuiButton-label').contains('Return To Transactions').click()
            cy.url().should('deep.equal', `${Cypress.config().baseUrl}/`)

        })

        it('Do a payment and verify notification', () => {

        })

    })

    describe('Request payment', () => {

        beforeEach(() => {
            cy.viewport(1920, 1080)
        })

        it('Successful request and create anoter', () => {
            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay')

            cy.get('@balanceBeforePay')
                .then((balanceBeforePay) => {

                    balanceBefore = utils.toNumber(balanceBeforePay)
                    cy.log(balanceBefore)
                    cy.doRequestOnly(paymentValue, randomString)
                    cy.wait('@checkAuth')
                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPay')
                    return cy.get('@balanceAfterPay')
                })
                .then((balanceAfterPay) => {

                    balanceAfter = utils.toNumber(balanceAfterPay)
                    cy.log(balanceAfter)

                })
                .then(() => {
                    cy.wrap(balanceAfter).should('deep.equal', balanceBefore)
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

        it('Successful request and Return To Transactions', () => {

            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay')

            cy.get('@balanceBeforePay')
                .then((balanceBeforePay) => {

                    balanceBefore = utils.toNumber(balanceBeforePay)
                    cy.doRequestOnly(paymentValue, randomString)
                    cy.wait('@checkAuth')
                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPay')
                    return cy.get('@balanceAfterPay')
                })
                .then((balanceAfterPay) => {
                    balanceAfter = utils.toNumber(balanceAfterPay)
                })
                .then(() => {
                    cy.wrap(balanceAfter).should('deep.equal', balanceBefore)
                })
            cy.get('[data-test="alert-bar-success"]').should('be.visible')
            cy.get('.MuiButton-label').contains('Return To Transactions').click()
            cy.url().should('deep.equal', `${Cypress.config().baseUrl}/`)

        })

        it('Do a request and verify notification', () => {

        })
    })


})
