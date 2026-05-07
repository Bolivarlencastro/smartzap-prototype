import { WORKSPACE_ID } from '../constants/utils';
import { CypressResponse, userOptions } from '../interfaces';
const myAccountUrl = `${Cypress.env('my_account_url_api')}/workspaces/`;

Cypress.Commands.add('APIUserDelete', (id) => {
  cy.keepsApi(`${myAccountUrl}${WORKSPACE_ID}/users/${id}`, {}, 'DELETE');
});

Cypress.Commands.add('APIUserCreate', (data) => {
  cy.keepsApi(
    `${myAccountUrl}${data.workspaceID}/users`,
    {
      users: [
        {
          name: data.name,
          email: data.email,
          language: data.languageID,
        },
      ],
      permissions: [data.my_account_permission, data.smartzap_permission],
    },
    'POST',
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      APIUserDelete(id: string): Chainable<CypressResponse>;
      APIUserCreate(data: userOptions): Chainable<CypressResponse>;
    }
  }
}
