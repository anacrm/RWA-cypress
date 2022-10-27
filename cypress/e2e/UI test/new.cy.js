/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('New interface', () => {
    context('Given the user has valid credentials and login it account', () => {
        const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
        const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');
        const DEFAULT_FULLNAME = Cypress.env('DEFAULT_FULLNAME')
        const ACCESSORY_USERNAME = Cypress.env('ACCESSORY_USERNAME')
        const ACCESSORY_PASSWORD = Cypress.env('ACCESSORY_PASSWORD')
        const RECIPIENT_FULLNAME = Cypress.env('ACCESSORY_FULLNAME')
        let paymentValue = utils.paymentValue()
        let randomString = utils.randomString();
        beforeEach(() => {
            cy.intercept({ method: 'GET', url: '/notifications', }).as('notifications')
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')
            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.wait('@notifications')
            cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationBeforeAsText')
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePayAsText')
        })
        context('When the user does a payment', () => {

            beforeEach(() => {
                cy.doPaymentOnly(paymentValue, randomString, RECIPIENT_FULLNAME)
                cy.wait('@checkAuth')
                cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPayAsText')
            })

            it('Then the account balance should be updated', () => {
                let balanceAfterRequest, balanceBeforeRequest
                cy.get('@balanceBeforePayAsText').then((balanceBeforePayAsText) => {
                    balanceBeforeRequest = utils.toNumber(balanceBeforePayAsText)
                    cy.get('@balanceAfterPayAsText').then((balanceAfterPay) => {
                        balanceAfterRequest = utils.toNumber(balanceAfterPay)
                        cy.wrap(balanceAfterRequest).should('deep.equal', (balanceBeforeRequest - paymentValue))

                    })
                })
            })
            it('Then the create another transaction button should be clickable ', () => {
                cy.get('.MuiButton-label').contains('Create Another Transaction').should('be.visible')
            })
            it('Then the return to transactions button should be clickable ', () => {
                cy.get('.MuiButton-label').contains('Return To Transactions').should('be.visible')
            })
        })
        context('When the user receives a payment', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('Logout').click()
                cy.doPayment(ACCESSORY_USERNAME, ACCESSORY_PASSWORD, paymentValue, randomString, DEFAULT_FULLNAME)
                cy.wait('@notifications')
                cy.get('.MuiTypography-root').contains('Logout').click()
                cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            })

            it('Then the user should receive a notification', () => {
                let notificationBefore, notificationAfter
                cy.wait('@notifications')
                cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationAfterAsText')
                cy.get('@notificationBeforeAsText').then((notificationBeforeAsText) => {
                    cy.get('@notificationAfterAsText').then((notificationAfterAsText) => {
                        notificationBefore = parseInt(notificationBeforeAsText)
                        notificationAfter = parseInt(notificationAfterAsText)
                        cy.wrap(notificationAfter).should('deep.equal', notificationBefore + 1)
                    })

                })

            })
        })
        context('When the user request a payment', () => {

            beforeEach(() => {
                cy.doRequestOnly(paymentValue, randomString, RECIPIENT_FULLNAME)
                cy.wait('@checkAuth')
                cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPayAsText')
            })

            it('Then the account balance should not be updated', () => {
                let balanceAfterRequest, balanceBeforeRequest
                cy.get('@balanceBeforePayAsText').then((balanceBeforePayAsText) => {
                    balanceBeforeRequest = utils.toNumber(balanceBeforePayAsText)
                    cy.get('@balanceAfterPayAsText').then((balanceAfterPay) => {
                        balanceAfterRequest = utils.toNumber(balanceAfterPay)
                        cy.wrap(balanceAfterRequest).should('deep.equal', (balanceBeforeRequest))

                    })
                })
            })
            it('Then the create another transaction button should be clickable ', () => {
                cy.get('.MuiButton-label').contains('Create Another Transaction').should('be.visible')
            })
            it('Then the return to transactions button should be clickable ', () => {
                cy.get('.MuiButton-label').contains('Return To Transactions').should('be.visible')
            })
        })
        context('When the user receives request of a payment', () => {
            beforeEach(() => {
                cy.get('.MuiTypography-root').contains('Logout').click()
                cy.doRequest(ACCESSORY_USERNAME, ACCESSORY_PASSWORD, paymentValue, randomString, DEFAULT_FULLNAME)
                cy.wait('@notifications')
                cy.get('.MuiTypography-root').contains('Logout').click()
                cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            })

            it('Then the user should receive a notification', () => {
                let notificationBefore, notificationAfter
                cy.wait('@notifications')
                cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationAfterAsText')
                cy.get('@notificationBeforeAsText').then((notificationBeforeAsText) => {
                    cy.get('@notificationAfterAsText').then((notificationAfterAsText) => {
                        notificationBefore = parseInt(notificationBeforeAsText)
                        notificationAfter = parseInt(notificationAfterAsText)
                        cy.wrap(notificationAfter).should('deep.equal', notificationBefore + 1)
                    })

                })
            })
        })
    })
})
