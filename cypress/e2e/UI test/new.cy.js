/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('Given New interface', () => {

    const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
    const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');
    const ACCESSORY_USERNAME = Cypress.env('ACCESSORY_USERNAME')
    const ACCESSORY_PASSWORD = Cypress.env('ACCESSORY_PASSWORD')
    const DEFAULT_FULLNAME = Cypress.env('DEFAULT_FULLNAME')
    let paymentValue = utils.paymentValue()
    let randomString = utils.randomString();

    describe('When a payment is sent', () => {


        it('Then a successful payment is done and create another transaction button is clickable', () => {
            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay') //FIXME: don't need the alias

            cy.get('@balanceBeforePay')
                .then((balanceBeforePay) => {

                    balanceBefore = utils.toNumber(balanceBeforePay)
                    cy.doPaymentOnly(paymentValue, randomString, DEFAULT_FULLNAME)
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

        it('Then a successful payment is done and Return To Transactions button is clickable', () => {

            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay') //FIXME: don't need alias

            cy.get('@balanceBeforePay')
                .then((balanceBeforePay) => {

                    balanceBefore = utils.toNumber(balanceBeforePay)
                    cy.doPaymentOnly(paymentValue, randomString, DEFAULT_FULLNAME)
                    cy.wait('@checkAuth')
                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPay') //FIXME: don't need alias. i think the retur can be the cy.get.invoke part already
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

        it('Then a notification is sent after a payment happens', () => {
            let countBefore, countAfter

            cy.intercept({ method: 'GET', url: '/notifications', }).as('notifications') // FIXME: getNotifications
            cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
            cy.wait('@notifications')
            cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationCount') //FIXME: don't need the alias
            cy.get('@notificationCount')
                .then((notificationCount) => {
                    countBefore = parseInt(notificationCount)

                    cy.log(countBefore)
                    cy.get('.MuiTypography-root').contains('Logout').click()
                    cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
                    cy.doPaymentOnly(paymentValue, randomString, DEFAULT_FULLNAME)
                    cy.wait('@notifications')
                    cy.get('.MuiTypography-root').contains('Logout').click()
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                    cy.wait('@notifications')
                    cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationCountAfter')

                    return cy.get('@notificationCountAfter')
                })
                .then((notificationAfter) => {
                    countAfter = parseInt(notificationAfter)
                    cy.wrap(countAfter).should('deep.equal', (countBefore + 1))
                })





        })

    })

    describe('When a Request payment is sent', () => {


        it('Then a successful request is done and create another request button is clickable', () => {


            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay')

            cy.get('@balanceBeforePay')
                .then((balanceBeforePay) => {

                    balanceBefore = utils.toNumber(balanceBeforePay)
                    cy.log(balanceBefore)
                    cy.doRequestOnly(paymentValue, randomString, DEFAULT_FULLNAME)
                    cy.wait('@checkAuth')
                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterPay') //can return the cy.get.invoke already, without the alias
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

        it('Then a successful request is done and Return To Transactions button is clickable', () => {

            let balanceBefore, balanceAfter
            cy.intercept({ method: 'GET', url: '/checkAuth', }).as('checkAuth')

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforePay')

            cy.get('@balanceBeforePay')
                .then((balanceBeforePay) => {

                    balanceBefore = utils.toNumber(balanceBeforePay)
                    cy.doRequestOnly(paymentValue, randomString, DEFAULT_FULLNAME)
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

        it('Then a notification is sent after a request happens', () => {
            let countBefore, countAfter

            cy.intercept({ method: 'GET', url: '/notifications', }).as('notifications') //FIXME getNotifications
            cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
            cy.wait('@notifications')
            cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationCount') //FIXME
            cy.get('@notificationCount')
                .then((notificationCount) => {
                    countBefore = parseInt(notificationCount)

                    cy.log(countBefore)
                    cy.get('.MuiTypography-root').contains('Logout').click()
                    cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
                    cy.doRequestOnly(paymentValue, randomString, DEFAULT_FULLNAME)
                    cy.wait('@notifications')
                    cy.get('.MuiTypography-root').contains('Logout').click()
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                    cy.wait('@notifications')
                    cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationCountAfter') //FIXME

                    return cy.get('@notificationCountAfter')
                })
                .then((notificationAfter) => {
                    countAfter = parseInt(notificationAfter)
                    cy.wrap(countAfter).should('deep.equal', (countBefore + 1))
                })
        })
    })


})
