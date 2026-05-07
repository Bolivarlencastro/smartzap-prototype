import { Interception } from 'cypress/types/net-stubbing';
import TransferManagementElements from '../elements/transfer-management-elements';
import SettingsElements from '../elements/settings-elements';

Cypress.Commands.add('TransferManagementAccess', () => {
  cy.intercept('**transactions**').as('loadTransferManagement');
  SettingsElements.buttonAdmin().click();
  TransferManagementElements.transferManagementAccess();
  return cy.wait('@loadTransferManagement');
});

Cypress.Commands.add('TransferManagementSearchMission', (missionName) => {
  cy.intercept('**transactions**').as('searchMission');
  TransferManagementElements.transferManagementSearchMission().type(missionName);
  return cy.wait('@searchMission');
});

declare global {
  namespace Cypress {
    interface Chainable {
      TransferManagementAccess(): Chainable<Interception>;
      TransferManagementSearchMission(missionName: string): Chainable<Interception>;
    }
  }
}
