/// <reference types="cypress"/>
const utils = require('../../support/utils')

describe('Transaction Detail', () => {
    const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
    const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');
    // FIXME:  these variables names are very confusing for me
    // I can't tell what USER_NAME, ACCESSORY_USERNAME and USER_NAME_ACCESSORY are used for
    const ACCESSORY_PASSWORD = Cypress.env('ACCESSORY_PASSWORD');
    const ACCESSORY_USERNAME = Cypress.env('ACCESSORY_USERNAME');
    const USER_NAME = Cypress.env('USER_NAME')
    const USER_NAME_ACCESSORY = Cypress.env('USER_NAME_ACCESSORY')
    let paymentValue = utils.paymentValue()
    let randomString = utils.randomString();

    describe('Transaction Detail interface of payment', () => {


        it('like transaction and check notification', () => {
            let likeBefore, likeAfter, countBefore, countAfter //FIXME: count of what?

            cy.intercept({ method: 'GET', url: '/notifications', }).as('getNotifications')
            cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
            cy.wait('@getNotifications')

            cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text')

                .then((notificationCount) => {
                    countBefore = parseInt(notificationCount)
                    cy.get('.MuiTypography-root').contains('Logout').click()
                })

            cy.intercept({ method: 'POST', url: '/likes/**', }).as('postLike')
            cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString, USER_NAME)
            cy.get('.MuiTypography-root').contains('Home').click()
            cy.get('.MuiTab-wrapper').contains('Mine').click()
            cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
            cy.get('div[data-test*="transaction-like-count"]').invoke('text')
                .then((likeCountBefore) => {
                    likeBefore = parseInt(likeCountBefore)
                    cy.get('button[data-test*="transaction-like-button"]').click()
                    cy.wait('@postLike')
                    return cy.get('div[data-test*="transaction-like-count"]').invoke('text').as('likeCountAfter')
                })
                .then((likeCountAfter) => {
                    likeAfter = parseInt(likeCountAfter)
                    cy.wrap(likeAfter).should('deep.equal', (likeBefore + 1))
                    cy.get('.MuiTypography-root').contains('Logout').click()
                })

            cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
            cy.wait('@getNotifications')
            cy.wait('@getNotifications')
            cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text')

                .then((notificationCountAfter) => {
                    countAfter = parseInt(notificationCountAfter)
                    cy.wrap(countAfter).should('deep.equal', (countBefore + 2))
                })

        })

        it('Comment transaction and check notification', () => {

            let countBefore, countAfter
            cy.intercept({ method: 'GET', url: '/notifications', }).as('getNotifications')
            cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
            cy.wait('@getNotifications')
            cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text')

                .then((notificationCount) => {
                    countBefore = parseInt(notificationCount)
                    cy.get('.MuiTypography-root').contains('Logout').click()
                })

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.doPaymentOnly(paymentValue, randomString, USER_NAME)
            cy.get('.MuiTypography-root').contains('Home').click()
            cy.get('.MuiTab-wrapper').contains('Mine').click()
            cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
            cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
            cy.get('.MuiTypography-root').contains('Logout').click()

            cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
            cy.wait('@getNotifications')
            cy.wait('@getNotifications')
            cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text')

                .then((notificationCountAfter) => {
                    countAfter = parseInt(notificationCountAfter)
                    cy.log('countAfter:' + countAfter)
                    cy.wrap(countAfter).should('deep.equal', (countBefore + 2))
                })
        })

        it('Comment transaction and check comment section', () => {

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.doPaymentOnly(paymentValue, randomString, USER_NAME)
            cy.get('.MuiTypography-root').contains('Home').click()
            cy.get('.MuiTab-wrapper').contains('Mine').click()
            cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
            cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
            cy.wait(1000)
            cy.get('ul[data-test^="comments-list"]').children().should('have.length', 1)
            cy.get('input[placeholder^="Write a comment"]').type(' ').type('{enter}')
            cy.wait(1000)
            //this test will break. I assume that it would not be possible to send an empty comment
            cy.get('ul[data-test^="comments-list"]').children().should('have.length', 1)

        })
    })

    describe('Transaction Detail interface of request', () => {


        it('Accept transaction request and check value update', () => {
            let balanceBefore, balanceAfter

            cy.intercept({ method: 'GET', url: '/transactions/**', }).as('getTransations')
            cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
            cy.doRequestOnly(paymentValue, randomString, USER_NAME_ACCESSORY)
            cy.get('.MuiTypography-root').contains('Logout').click()

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text')

                .then((balanceBeforeRequest) => {
                    balanceBefore = utils.toNumber(balanceBeforeRequest)
                })

            cy.get('[data-test="nav-personal-tab"]').click()
            cy.get('li[data-test*="transaction-item"]').first().click()
            cy.get('.MuiButton-label').contains('Accept Request').click()
            cy.wait('@getTransations')
            cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterRequest')
            cy.get('@balanceAfterRequest')
                .then((balanceAfterRequest) => {
                    balanceAfter = utils.toNumber(balanceAfterRequest)
                })
                .then(() => {
                    //this test will fail. I am supposing that after payment request accepted, the value has to be removed immediately without it need logout
                    cy.wrap(balanceAfter).should('deep.equal', (balanceBefore - paymentValue))
                })

        })

        it('Deny transaction request and check the value does not update', () => {
            let balanceBefore, balanceAfter

            cy.intercept({ method: 'GET', url: '/transactions/**', }).as('getTransations')
            cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
            cy.doRequestOnly(paymentValue, randomString, USER_NAME_ACCESSORY)
            cy.get('.MuiTypography-root').contains('Logout').click()

            cy.signIn(DEFAULT_USERNAME, DEFAULT_PASSWORD)
            cy.get('[data-test="sidenav-user-balance"]').invoke('text')
                .then((balanceBeforeRequest) => {
                    balanceBefore = utils.toNumber(balanceBeforeRequest)
                    cy.log(balanceBefore)
                })
            cy.get('[data-test="nav-personal-tab"]').click()
            cy.get('li[data-test*="transaction-item"]').first().click()
            cy.get('.MuiButton-label').contains('Reject Request').click()
            cy.wait('@getTransations')
            cy.get('[data-test="sidenav-user-balance"]').invoke('text')
                .then((balanceAfterRequest) => {
                    balanceAfter = utils.toNumber(balanceAfterRequest)
                    cy.log(balanceAfter)
                })
                .then(() => {
                    cy.wrap(balanceAfter).should('deep.equal', balanceBefore)
                })
        })
    })

})

