/// <reference types="cypress" />

import * as StatusCode from '../../support/constants/status-code';
import { COUNTRY } from '../constants/utils';
import UsersElements from '../elements/users-elements';
import { userOptions } from '../interfaces';

Cypress.Commands.add('UserAccess', () => {
  cy.intercept('**/user**').as('userAccess');
  UsersElements.userAccessButton().click();
  cy.wait('@userAccess').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('UserSearch', (userName) => {
  cy.intercept('**/user**').as('userSearch');
  UsersElements.userSearch().type(userName, { delay: 300 }).type('{enter}');
  return cy.wait('@userSearch').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('UserDelete', () => {
  cy.intercept('DELETE', '**/user/**').as('userDelete');
  UsersElements.buttonDeleteUser().click();
  UsersElements.confirmButton().click();
  return cy.wait('@userDelete').its('response.statusCode').should('eq', StatusCode.NoContent);
});

Cypress.Commands.add('UserEdit', (user) => {
  cy.intercept('PATCH', '**/user/**').as('userUpdate');
  UsersElements.buttonEditUser().click();
  UsersElements.userCountrySelector().click();
  UsersElements.userCountryOptionSelector().contains(COUNTRY).click();
  UsersElements.inputUserNumber().clear().type(user.number);
  UsersElements.inputUserName().clear().type(user.name);
  UsersElements.inputUserEmail().clear().type(user.email);
  UsersElements.inputUserTag().clear().type(user.tag);
  UsersElements.editUserConfirmButton().click();
  return cy.wait('@userUpdate').its('response.statusCode').should('eq', StatusCode.NoContent);
});

declare global {
  namespace Cypress {
    interface Chainable {
      UserAccess(): Chainable<JQuery<HTMLElement>>;
      UserSearch(userName: string): Chainable<JQuery<HTMLElement>>;
      UserDelete(): Chainable<JQuery<HTMLElement>>;
      UserEdit(user: userOptions): Chainable<userOptions>;
    }
  }
}
