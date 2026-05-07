/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';
import SettingsSectionsElements from '../elements/settings-sections-elements';
import { SectionCreatedOptions } from '../interfaces';
import MissionElements from '../elements/mission-elements';

Cypress.Commands.add('SectionsVerifyDetails', ({ name, description, learningObject }) => {
  SettingsSectionsElements.sectionsTitleElement().should('contain.text', name);
  SettingsSectionsElements.sectionsDescriptionElement().should('contain.text', description);
  MissionElements.ComponentNameCard().should('be.visible').contains(learningObject);
});

declare global {
  namespace Cypress {
    interface Chainable {
      SectionsVerifyDetails(data: SectionCreatedOptions): Chainable<Interception>;
    }
  }
}
