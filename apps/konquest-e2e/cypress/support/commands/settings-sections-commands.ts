/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';
import * as StatusCode from '../constants/status-code';
import SettingsElements from '../elements/settings-elements';
import SettingsSectionsElements from '../elements/settings-sections-elements';
import { SectionContentOptions, SectionOptions } from '../interfaces';
import { getDateTodayBR, getDateTomorrowBR } from '../commands';

Cypress.Commands.add('SettingsSectionsCreate', ({ option, temporary = false, name, description }) => {
  cy.intercept('POST', '**/custom-sections/sections').as('createSection');

  cy.GetMetaDataSelectorAndClick('button-create-new-section');
  SettingsSectionsElements.sectionCreateOption(option).click();
  SettingsSectionsElements.inputSectionName().type(name);
  SettingsSectionsElements.inputSectionDescription().type(description);

  if (temporary) {
    SettingsSectionsElements.buttonTemporary().click();
    SettingsSectionsElements.inputStartDate().clear().type(getDateTodayBR());
    SettingsSectionsElements.inputEndDate().clear().type(getDateTomorrowBR());
  }

  cy.GetMetaDataSelectorAndClick('button-save-section');
  return cy.wait('@createSection');
});

Cypress.Commands.add('SettingsSectionsTabAccess', (tab = 'highlights') => {
  cy.intercept('**/custom-sections/sections**').as('loadCustomSections');
  SettingsElements.buttonAdmin().click();
  SettingsElements.buttonSections().click();
  return cy.wait('@loadCustomSections').then(() => {
    if (tab != 'highlights') {
      cy.GetMetaDataSelectorAndClick(`custom-sections-tab-${tab}`);
      cy.wait('@loadCustomSections').its('response.statusCode').should('eq', StatusCode.OK);
    }
  });
});

Cypress.Commands.add('SettingsSectionsAddContent', ({ option, learningObject }) => {
  cy.intercept('PATCH', '**/custom-sections/sections/**').as('contentAdd');

  cy.GetMetaDataSelectorAndClick('sections-button-add-contents');

  if (option) {
    cy.GetMetaDataSelectorAndClick('section-tab-category');
  }
  SettingsSectionsElements.contentSearch().type(learningObject);
  cy.get('mat-progress-spinner').should('not.exist');

  SettingsSectionsElements.contentSelector(learningObject).should('be.visible').click();
  cy.GetMetaDataSelectorAndClick('add-content-to-section-button');
  return cy.wait('@contentAdd');
});

declare global {
  namespace Cypress {
    interface Chainable {
      SettingsSectionsCreate(options: SectionOptions): Chainable<Interception>;
      SettingsSectionsTabAccess(tab?: string): Chainable<Interception>;
      SettingsSectionsAddContent(options: SectionContentOptions): Chainable<Interception>;
    }
  }
}
