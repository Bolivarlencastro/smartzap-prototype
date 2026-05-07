/// <reference types="cypress" />
import SettingsElements from '../elements/settings-elements';
import * as StatusCode from '../constants/status-code';
import { Interception } from 'cypress/types/net-stubbing';

Cypress.Commands.add('SettingsAccess', () => {
  cy.intercept('**/application-services').as('loadSettings');
  SettingsElements.buttonAdmin().click();
  SettingsElements.buttonSettings().click();
  return cy.wait('@loadSettings');
});

Cypress.Commands.add('SettingsChangeWorkspacePerformance', (performance) => {
  cy.intercept('**/workspaces/**').as('performanceUpdate');
  SettingsElements.inputWorkspacePerformance().clear().type(performance);
  cy.GetMetaDataSelectorAndClick('button-save-workspace-performance');
  return cy.wait('@performanceUpdate').its('response.statusCode').should('eq', StatusCode.OK);
});
declare global {
  namespace Cypress {
    interface Chainable {
      SettingsAccess(): Chainable<Interception>;
      SettingsChangeWorkspacePerformance(performance: string): Chainable<Interception>;
    }
  }
}
