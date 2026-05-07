import { Interception } from 'cypress/types/net-stubbing';
import GlobalSearchElements from '../elements/global-search-elements';

Cypress.Commands.add('GlobalSearchAccess', () => {
  cy.intercept('**/search/v1/**').as('loadGlobalSearch');
  GlobalSearchElements.buttonGlobalSearch().click();
  return cy.wait('@loadGlobalSearch');
});

Cypress.Commands.add('GlobalSearch', (item) => {
  cy.intercept('GET', `**/search/v1/**search=${encodeURIComponent(item)}**`).as('loadGlobalSearchResults');

  cy.get('body').then(($body) => {
    const isGlobalSearchOpen = $body.find(
      '[data-test="tab-MISSIONS"], [data-test="tab-CHANNELS"], [data-test="tab-PULSES"], [data-test="tab-TRAILS"]',
    ).length;

    if (!isGlobalSearchOpen) {
      cy.GlobalSearchAccess();
    }
  });

  GlobalSearchElements.fieldSearchOnGlobalSearch().clear().type(`${item}{enter}`, { delay: 500, force: true });
  return cy.wait('@loadGlobalSearchResults');
});

Cypress.Commands.add('GlobalSearchPulseTab', () => {
  cy.intercept('**=pulses').as('loadPulseSearch');
  GlobalSearchElements.buttonPulseOnGlobalSearch().should('be.visible').click();
  return cy.wait('@loadPulseSearch');
});

declare global {
  namespace Cypress {
    interface Chainable {
      GlobalSearchAccess(): Chainable<Interception>;
      GlobalSearch(item: string): Chainable<Interception>;
      GlobalSearchPulseTab(): Chainable<Interception>;
    }
  }
}
