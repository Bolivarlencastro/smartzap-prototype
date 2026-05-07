/// <reference types="cypress" />

it('Should log in with admin user', () => {
  cy.Login('admin');
  cy.visit('/');
});
