// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('signIn', (userName, password) => {
    cy.visit('/signin')
    cy.get('#username').type(userName)
    cy.get('#password').type(password)
    cy.get('.MuiButton-label').contains('Sign In').click()
})

Cypress.Commands.add('doPayment', (userName, password, paymentAmount, paymentCommment) => {


    cy.signIn(userName, password)
    cy.get('a[href*="/transaction/new"]').click()
    cy.get('li[data-test*="user-list-item"]').first().click()
    cy.get('#amount').type(paymentAmount)
    cy.get('#transaction-create-description-input').type(paymentCommment)
    cy.get('.MuiButton-label').contains('Pay').click()
})

Cypress.Commands.add('doPaymentOnly', (paymentAmount, paymentCommment) => {

    cy.get('a[href*="/transaction/new"]').click()
    cy.get('li[data-test*="user-list-item"]').first().click()
    cy.get('#amount').type(paymentAmount)
    cy.get('#transaction-create-description-input').type(paymentCommment)
    cy.get('.MuiButton-label').contains('Pay').click()
})

Cypress.Commands.add('doRequestOnly', (paymentAmount, paymentCommment) => {

    cy.get('a[href*="/transaction/new"]').click()
    cy.get('li[data-test*="user-list-item"]').first().click()
    cy.get('#amount').type(paymentAmount)
    cy.get('#transaction-create-description-input').type(paymentCommment)
    cy.get('.MuiButton-label').contains('Request').click()
})


Cypress.Commands.add('doRequest', (userName, password, paymentAmount, paymentCommment) => {


    cy.signIn(userName, password)
    cy.get('a[href*="/transaction/new"]').click()
    cy.get('li[data-test*="user-list-item"]').first().click()
    cy.get('#amount').type(paymentAmount)
    cy.get('#transaction-create-description-input').type(paymentCommment)

})



