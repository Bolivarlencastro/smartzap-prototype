import { Interception } from 'cypress/types/net-stubbing';
import { CypressResponse } from '../interfaces';

const baseUrlNotification = `${Cypress.env('url_api')}/notifications`;

Cypress.Commands.add('APINotificationGetAll', () => {
  cy.keepsApi(
    baseUrlNotification,
    {
      ordering: 'updated_date',
      read: 'false',
    },
    'GET',
  );
});

Cypress.Commands.add('APINotificationsDeleteAll', () => {
  cy.APINotificationGetAll().then((response) => {
    const listResults = response.body.results ? response.body.results : [];

    listResults.forEach((result) => {
      cy.log(result);
      cy.APINotificationDelete(result.id);
    });
  });
});

Cypress.Commands.add('APINotificationDelete', (UUID) => {
  cy.keepsApi(`${baseUrlNotification}/${UUID}`, {}, 'DELETE');
});

declare global {
  namespace Cypress {
    interface Chainable {
      APINotificationGetAll(): Chainable<CypressResponse<any>>;
      APINotificationsDeleteAll(): Chainable<Interception>;
      APINotificationDelete(UUID: string): Chainable<Interception>;
    }
  }
}
