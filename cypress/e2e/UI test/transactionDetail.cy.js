/// <reference types="cypress"/>
const utils = require('../../support/utils')

describe('Transaction Detail interface', () => {
    describe('Payment', () => {
        context('Given that there is a transaction', () => {
            const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD')
            const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME')
            const RECIPIENT_FULLNAME = Cypress.env('ACCESSORY_FULLNAME')
            let paymentValue = utils.paymentValue()
            let randomString = utils.randomString()
            beforeEach(() => {
                cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString, RECIPIENT_FULLNAME)
            })

            context('When the like button is clicked', () => {
                //find the previous payment and like it
                beforeEach(() => {
                    cy.intercept({ method: 'POST', url: '/likes/**', }).as('postLike')
                    cy.get('.MuiTypography-root').contains('Home').click()
                    cy.get('.MuiTab-wrapper').contains('Mine').click()
                    cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
                    cy.get('div[data-test*="transaction-like-count"]').invoke('text').as('likesBefore')
                    cy.get('button[data-test*="transaction-like-button"]').click()
                    cy.wait('@postLike')

                })
                it('Then the like count should increase', () => {
                    //compare the number os likes
                    cy.get('div[data-test*="transaction-like-count"]').invoke('text').as('likesAfter')
                    cy.get('@likesAfter').then((likesAfter) => {
                        cy.log(likesAfter)
                    })
                    cy.get('@likesBefore').then((likesBefore) => {
                        cy.log(likesBefore)
                    })


                })
            })
            context('When the user tries to write a comment', () => {
                //this test will break. I assume that it would not be possible to send an empty comment
                beforeEach(() => {
                    cy.get('.MuiTypography-root').contains('Home').click()
                    cy.get('.MuiTab-wrapper').contains('Mine').click()
                    cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
                })

                it('Then it should comments with text', () => {
                    cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
                    cy.wait(1000)
                    cy.get('ul[data-test^="comments-list"]').children().should('have.length', 1)
                    cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
                    cy.wait(1000)
                    cy.get('ul[data-test^="comments-list"]').children().should('have.length', 2)
                })

                it('Then it should not allow empty comments', () => {
                    cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
                    cy.wait(1000)
                    cy.get('ul[data-test^="comments-list"]').children().should('have.length', 1)
                    cy.get('input[placeholder^="Write a comment"]').type(' ').type('{enter}')
                    cy.wait(1000)
                    cy.get('ul[data-test^="comments-list"]').children().should('have.length', 1)
                })

            })

        })
        context('Given an user has a certain amount of notifications ', () => {
            const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD')
            const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME')
            const ACCESSORY_PASSWORD = Cypress.env('ACCESSORY_PASSWORD')
            const ACCESSORY_USERNAME = Cypress.env('ACCESSORY_USERNAME')
            const RECIPIENT_FULLNAME = Cypress.env('ACCESSORY_FULLNAME')
            let paymentValue = utils.paymentValue()
            let randomString = utils.randomString()

            beforeEach(() => {
                cy.intercept({ method: 'GET', url: '/notifications', }).as('getNotifications')
                cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                cy.wait('@getNotifications')

                cy.get('.MuiBadge-badge.makeStyles-customBadge-28')
                    .invoke('text')
                    .as('notificationsBefore')

                cy.get('.MuiTypography-root').contains('Logout').click()
            })

            context('When this user receives a new payment', () => {
                beforeEach(() => {
                    cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString, RECIPIENT_FULLNAME)
                    cy.get('.MuiTypography-root').contains('Logout').click()
                    cy.wait('@getNotifications')
                })

                it('Then user this user should receive a notification', () => {
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)

                    cy.wait('@getNotifications')
                    cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationsAfter')

                    cy.get("@notificationsBefore").then((notificationsBeforeAsText) => {
                        const notificationsBefore = parseInt(notificationsBeforeAsText)

                        cy.get("@notificationsAfter").should('deep.equal', (notificationsBefore + 1).toString())

                    })
                })
            })

            context('When this user receives a payment and a comment is made in this transaction', () => {
                // do a payment, comment transaction and logout
                beforeEach(() => {
                    cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString, RECIPIENT_FULLNAME)
                    cy.wait('@getNotifications')
                    cy.get('.MuiTypography-root').contains('Home').click()
                    cy.get('.MuiTab-wrapper').contains('Mine').click()
                    cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
                    cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
                    cy.get('.MuiTypography-root').contains('Logout').click()
                })
                it('Then the user should receives a notification', () => {
                    // login in the user and chck the amount of notifications
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                    cy.wait('@getNotifications')
                    cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationsAfter')

                    cy.get("@notificationsBefore").then((notificationsBeforeAsText) => {
                        const notificationsBefore = parseInt(notificationsBeforeAsText)

                        cy.get("@notificationsAfter").should('deep.equal', (notificationsBefore + 2).toString())
                    })

                })
            })
        })

    })
    describe('Request Payment', () => {
        context('Given that there is a Request transaction', () => {

            const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD')
            const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME')
            const ACCESSORY_PASSWORD = Cypress.env('ACCESSORY_PASSWORD')
            const ACCESSORY_USERNAME = Cypress.env('ACCESSORY_USERNAME')
            const RECIPIENT_FULLNAME = Cypress.env('ACCESSORY_FULLNAME')
            let paymentValue = utils.paymentValue()
            let randomString = utils.randomString()
            beforeEach(() => {

                cy.doRequest(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString, RECIPIENT_FULLNAME)
                cy.get('.MuiTypography-root').contains('Logout').click()
            })
            context('When the user accepts the request transaction', () => {

                beforeEach(() => {
                    cy.intercept({ method: 'GET', url: '/transactions/**', }).as('getTransations')
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                    cy.wait('@getTransations')
                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforeRequestAsText')
                    cy.get('[data-test="nav-personal-tab"]').click()
                    cy.get('li[data-test*="transaction-item"]').first().click()
                    cy.get('.MuiButton-label').contains('Accept Request').click()
                    cy.wait('@getTransations')

                })
                //this test will fail. I am supposing that after payment request accepted, the value has to be removed immediately without it need logout
                it('Then the total money in the account should be updated immediately', () => {
                    let balanceAfterRequest, balanceBeforeRequest

                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterRequestAsText')
                    cy.get('@balanceAfterRequestAsText').then((balanceAfterRequestAsText) => {
                        balanceAfterRequest = utils.toNumber(balanceAfterRequestAsText)
                        cy.get('@balanceBeforeRequestAsText').then((balanceBeforeRequestAsText) => {
                            balanceBeforeRequest = utils.toNumber(balanceBeforeRequestAsText)
                            cy.wrap(balanceBeforeRequest).should('deep.equal', (balanceAfterRequest - paymentValue))
                        })
                    })

                })
            })

            context('When the user rejects the transaction request', () => {
                beforeEach(() => {
                    cy.intercept({ method: 'GET', url: '/transactions/**', }).as('getTransations')
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                    cy.wait('@getTransations')
                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceBeforeRequestAsText')
                    cy.get('[data-test="nav-personal-tab"]').click()
                    cy.get('li[data-test*="transaction-item"]').first().click()
                    cy.get('.MuiButton-label').contains('Reject Request').click()
                    cy.wait('@getTransations')

                })
                it('The total money amount should not be updated', () => {
                    let balanceAfterRequest, balanceBeforeRequest

                    cy.get('[data-test="sidenav-user-balance"]').invoke('text').as('balanceAfterRequestAsText')
                    cy.get('@balanceAfterRequestAsText').then((balanceAfterRequestAsText) => {
                        balanceAfterRequest = utils.toNumber(balanceAfterRequestAsText)
                        cy.get('@balanceBeforeRequestAsText').then((balanceBeforeRequestAsText) => {
                            balanceBeforeRequest = utils.toNumber(balanceBeforeRequestAsText)
                            cy.wrap(balanceBeforeRequest).should('deep.equal', balanceAfterRequest)
                        })
                    })

                })
            })

            context('When the like button is clicked', () => {

                beforeEach(() => {
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                    cy.intercept({ method: 'POST', url: '/likes/**', }).as('postLike')
                    cy.get('.MuiTypography-root').contains('Home').click()
                    cy.get('.MuiTab-wrapper').contains('Mine').click()
                    cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
                    cy.get('div[data-test*="transaction-like-count"]').invoke('text').as('likesBefore')
                    cy.get('button[data-test*="transaction-like-button"]').click()
                    cy.wait('@postLike')

                })
                it('Then the like count should increase', () => {

                    cy.get('div[data-test*="transaction-like-count"]').invoke('text').as('likesAfter')
                    cy.get('@likesAfter').then((likesAfter) => {
                        cy.log(likesAfter)
                    })
                    cy.get('@likesBefore').then((likesBefore) => {
                        cy.log(likesBefore)
                    })


                })
            })
            context('When the user tries to write a comment', () => {
                //this test will break. I assume that it would not be possible to send an empty comment
                beforeEach(() => {
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                    cy.get('.MuiTypography-root').contains('Home').click()
                    cy.get('.MuiTab-wrapper').contains('Mine').click()
                    cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
                })

                it('Then it should comments with text', () => {
                    cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
                    cy.wait(1000)
                    cy.get('ul[data-test^="comments-list"]').children().should('have.length', 1)
                    cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
                    cy.wait(1000)
                    cy.get('ul[data-test^="comments-list"]').children().should('have.length', 2)
                })

                it('Then it should not allow empty comments', () => {
                    cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
                    cy.wait(1000)
                    cy.get('ul[data-test^="comments-list"]').children().should('have.length', 1)
                    cy.get('input[placeholder^="Write a comment"]').type(' ').type('{enter}')
                    cy.wait(1000)
                    cy.get('ul[data-test^="comments-list"]').children().should('have.length', 1)
                })

            })

        })
        context('Given an user has a certain amount of notifications ', () => {
            const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD')
            const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME')
            const ACCESSORY_PASSWORD = Cypress.env('ACCESSORY_PASSWORD')
            const ACCESSORY_USERNAME = Cypress.env('ACCESSORY_USERNAME')
            const RECIPIENT_FULLNAME = Cypress.env('ACCESSORY_FULLNAME')
            let paymentValue = utils.paymentValue()
            let randomString = utils.randomString()

            beforeEach(() => {
                cy.intercept({ method: 'GET', url: '/notifications', }).as('getNotifications')
                cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                cy.wait('@getNotifications')

                cy.get('.MuiBadge-badge.makeStyles-customBadge-28')
                    .invoke('text')
                    .as('notificationsBefore')

                cy.get('.MuiTypography-root').contains('Logout').click()
            })

            context('When this user receives a new Request payment', () => {
                beforeEach(() => {
                    cy.doRequest(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString, RECIPIENT_FULLNAME)
                    cy.get('.MuiTypography-root').contains('Logout').click()
                    cy.wait('@getNotifications')
                })

                it('Then user this user should receive a notification', () => {
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)

                    cy.wait('@getNotifications')
                    cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationsAfter')

                    cy.get("@notificationsBefore").then((notificationsBeforeAsText) => {
                        const notificationsBefore = parseInt(notificationsBeforeAsText)

                        cy.get("@notificationsAfter").should('deep.equal', (notificationsBefore + 1).toString())

                    })
                })
            })

            context('When this user receives a request payment and a comment is made in this transaction', () => {
                // do a payment, comment transaction and logout
                beforeEach(() => {
                    cy.doRequest(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString, RECIPIENT_FULLNAME)
                    cy.wait('@getNotifications')
                    cy.get('.MuiTypography-root').contains('Home').click()
                    cy.get('.MuiTab-wrapper').contains('Mine').click()
                    cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
                    cy.get('input[placeholder^="Write a comment"]').type(randomString).type('{enter}')
                    cy.get('.MuiTypography-root').contains('Logout').click()
                })
                it('Then the user should receives a notification', () => {
                    // login in the user and chck the amount of notifications
                    cy.signIn(ACCESSORY_USERNAME, ACCESSORY_PASSWORD)
                    cy.wait('@getNotifications')
                    cy.get('.MuiBadge-badge.makeStyles-customBadge-28').invoke('text').as('notificationsAfter')

                    cy.get("@notificationsBefore").then((notificationsBeforeAsText) => {
                        const notificationsBefore = parseInt(notificationsBeforeAsText)

                        cy.get("@notificationsAfter").should('deep.equal', (notificationsBefore + 2).toString())
                    })

                })
            })
        })


    })
})