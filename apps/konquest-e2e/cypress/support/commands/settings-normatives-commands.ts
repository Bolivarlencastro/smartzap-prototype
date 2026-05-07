/// <reference types="cypress" />
import { Interception } from 'cypress/types/net-stubbing';
import SettingsElements from '../elements/settings-elements';
import SettingsNormativesElements from '../elements/settings-normatives-elements';
import * as StatusCode from '../constants/status-code';
import { CypressResponse } from '../interfaces';
import * as util from '../constants/utils';

Cypress.Commands.add('SettingsNormativesAccess', () => {
  cy.intercept('**/enrollment-cycles**').as('loadNormatives');
  SettingsElements.buttonAdmin().click();
  SettingsNormativesElements.buttonNavNomatives().click();
  return cy.wait('@loadNormatives').then(() => {
    SettingsNormativesElements.tabCreation().click();
  });
});

Cypress.Commands.add('SettingsNormativesCreateNormative', (normativeName) => {
  cy.intercept('GET', '**/regulatory-compliance/api/compliances**').as('loadNormatives');
  cy.intercept('POST', '**/regulatory-compliance/api/compliances').as('createNormative');

  cy.GetMetaDataSelectorAndClick('button-new-normative');
  cy.wait('@loadNormatives').then(() => {
    SettingsNormativesElements.inputNomativeName().type(normativeName);
    cy.GetMetaDataSelectorAndClick('button-create-new-normative');

    cy.wait('@createNormative').then((response) => {
      expect(response.response.statusCode).to.eq(StatusCode.Created);
      return response.response;
    });
  });
});

Cypress.Commands.add(
  'SettingsNormativesCreateRegulatoryComplianceCycle',
  (normativeName, learningObject = '011ixs669tw9m') => {
    cy.intercept('**/regulatory-compliance/api/cycles').as('createCycle');
    cy.intercept(`**/compliances?search=${normativeName}`).as('searchNormative');
    cy.intercept(`**/learning-objects?search=${learningObject}`).as('searchLearningObject');

    cy.GetMetaDataSelectorAndClick('button-new-regulatory-compliance-cycle');
    SettingsNormativesElements.regulatoryComplianceInputNormative().type(normativeName);
    cy.wait('@searchNormative').its('response.statusCode').should('eq', StatusCode.OK);
    SettingsNormativesElements.regulatoryComplianceOptionSelector(normativeName).click();

    SettingsNormativesElements.regulatoryComplianceInputLearningObject().focus().type(learningObject);
    cy.wait('@searchLearningObject').its('response.statusCode').should('eq', StatusCode.OK);
    SettingsNormativesElements.regulatoryComplianceOptionSelector(learningObject).click();

    SettingsNormativesElements.regulatoryComplianceInputDuration().focus().type('1');
    SettingsNormativesElements.regulatoryCompliancePeriodTypeSelector().click();
    cy.GetMetaDataSelectorAndClick('input-regulatory-compliance-period-option-year');

    cy.GetMetaDataSelectorAndClick('button-create-new-regulatory-compliance-cycle');

    cy.wait('@createCycle').then((response) => {
      expect(response.response.statusCode).to.eq(StatusCode.Created);
      return response.response;
    });
  },
);

Cypress.Commands.add('SettingsNormativesCreationAccessDirectly', () => {
  cy.intercept('**/api/cycles?search=**').as('loadCycles');
  cy.intercept('**/gamification').as('listGamification');
  cy.visit(`/${util.WORKSPACE_DEFAULT}/regulatory-compliance/creation`);
  cy.wait('@loadCycles');
  cy.wait('@listGamification');
});

Cypress.Commands.add('SettingsNormativesSearch', (cycle) => {
  cy.intercept(`**search=${cycle}**`).as('searchCycles');
  SettingsNormativesElements.regulatoryComplianceSearchSelector().type(cycle);
  return cy.wait('@searchCycles').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('SettingsNormativesValidateCycle', (cycle) => {
  cy.SettingsNormativesCreationAccessDirectly();
  cy.SettingsNormativesSearch(cycle);
  SettingsNormativesElements.regulatoryComplianceListSelector().should('contain.text', cycle);
});

declare global {
  namespace Cypress {
    interface Chainable {
      SettingsNormativesAccess(): Chainable<Interception>;
      SettingsNormativesCreateNormative(nomativeName: string): Chainable<CypressResponse>;
      SettingsNormativesCreateRegulatoryComplianceCycle(
        normativeName: string,
        learningObject?: string,
      ): Chainable<CypressResponse>;
      SettingsNormativesCreationAccessDirectly(): Chainable<Interception>;
      SettingsNormativesValidateCycle(cycle: string): Chainable<Interception>;
      SettingsNormativesSearch(cycle: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
