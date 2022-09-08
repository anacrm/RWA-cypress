/// <reference types="cypress" />
const utils = require('../../support/utils')

describe('Transaction Detail', () => {
    const DEFAULT_PASSWORD = Cypress.env('DEFAULT_PASSWORD');
    const DEFAULT_USERNAME = Cypress.env('DEFAULT_USERNAME');
    const ACCESSORY_PASSWORD = Cypress.env('ACCESSORY_PASSWORD');
    const ACCESSORY_USERNAME = Cypress.env('ACCESSORY_USERNAME');
    let paymentValue = utils.paymentValue()
    let randomString = utils.randomString();

    beforeEach(() => {
        cy.viewport(1920, 1080)

    })

    describe('Transaction Detail interface of payment', () => {

        it.only('like a transaction', () => {
            cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString)
            cy.get('.MuiTypography-root').contains('Home').click()
            cy.get('.MuiTab-wrapper').contains('Mine').click()
            cy.get('.MuiListItem-root.MuiListItem-alignItemsFlexStart').first().click()
            cy.get('div[data-test*="transaction-like-count"]').invoke('text').as('likeCount').then((count) => {
                cy.log(count)
            })

            cy.get('button[data-test*="transaction-like-button"]').click()
            cy.get('div[data-test*="transaction-like-count"]').invoke('text').as('likeCount').then((count2) => {
                cy.log(count2)
            })

        })
        it('comment a transaction', () => {
            cy.doPayment(DEFAULT_USERNAME, DEFAULT_PASSWORD, paymentValue, randomString)
            cy.get('.MuiTypography-root').contains('Home').click()
            cy.get('.MuiTab-wrapper').contains('Mine').click()
        })
    })
    describe('Transaction Detail interface of request', () => {
        beforeEach(() => {
            cy.viewport(1920, 1080)
        })
        it('', () => {

        })
    })

    describe('Transaction Detail interface of request for others', () => {
        beforeEach(() => {
            cy.viewport(1920, 1080)
        })
        it('', () => {

        })
    })
})
