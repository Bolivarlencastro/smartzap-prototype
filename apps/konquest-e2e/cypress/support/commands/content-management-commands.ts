import SettingsElements from '../elements/settings-elements';
import ContentManagementElements from '../elements/content-management-elements';
import { Interception } from 'cypress/types/net-stubbing';
import * as StatusCode from '../constants/status-code';

Cypress.Commands.add('ContentManagementAccess', (tab = 'courses') => {
  cy.intercept('GET', '**/search/v1/**').as('loadLearningObjects');
  SettingsElements.buttonAdmin().click();
  ContentManagementElements.buttonContentManagement().click();
  ContentManagementElements.tabSelector(tab).click();
  return cy.wait('@loadLearningObjects');
});

Cypress.Commands.add('ContentManagementSearch', (content) => {
  cy.intercept(`GET', '**/search/v1/**${content}**`).as('loadLearningObjects');
  ContentManagementElements.inputContentSearch().type(content, { delay: 500 });
  return cy.wait('@loadLearningObjects');
});

Cypress.Commands.add('ContentManagementDelete', () => {
  cy.intercept(`DELETE`, '**/konquest/**').as('deleteRequest');
  ContentManagementElements.itemDeleteMenuSelector().click();
  ContentManagementElements.itemDeleteConfirmButtonSelector().click();
  return cy.wait('@deleteRequest').should((response) => {
    expect(response.response.statusCode).to.eq(StatusCode.NoContent);
  });
});

Cypress.Commands.add('ContentManagementPublish', (missionName) => {
  cy.intercept('PATCH', '**/missions/**').as('publishMission');
  cy.ContentManagementAccess();
  cy.ContentManagementSearch(missionName);
  ContentManagementElements.buttonOpenCourseMenu().click();
  cy.get('[data-test="content-management-menu-option-publish"]').click();
  return cy.wait('@publishMission').its('response.statusCode').should('eq', StatusCode.OK);
});

declare global {
  namespace Cypress {
    interface Chainable {
      ContentManagementAccess(tab?: string): Chainable<Interception>;
      ContentManagementSearch(content: string): Chainable<Interception>;
      ContentManagementDelete(): Chainable<Interception>;
      ContentManagementPublish(missionName: string): Chainable<Interception>;
    }
  }
}
