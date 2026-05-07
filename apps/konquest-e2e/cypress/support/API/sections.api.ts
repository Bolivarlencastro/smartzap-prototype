import { CypressResponse } from '../interfaces';
import { DEFAULT_SECTIONS_IDS } from '../constants/utils';

const baseUrl = `${Cypress.env('new_url_api')}/custom-sections/sections`;

Cypress.Commands.add('APISectionDelete', (id) =>
  cy.keepsApi(`${baseUrl}/${id}`, {}, 'DELETE', {
    Authorization: localStorage.getItem('auth-token'),
  }),
);

Cypress.Commands.add('APISectionGetAll', () =>
  cy.keepsApi(baseUrl, {}, 'GET', {
    Authorization: localStorage.getItem('auth-token'),
  }),
);

Cypress.Commands.add('APISectionDeleteAll', () => {
  cy.APISectionGetAll().then((request) => {
    const listResults = request.body ? request.body : [];

    listResults
      .filter((body) => !DEFAULT_SECTIONS_IDS.includes(body.id))
      .forEach((body) => cy.APISectionDelete(body.id));
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      APISectionDelete(id: string): Chainable<CypressResponse>;
      APISectionGetAll(): Chainable<CypressResponse>;
      APISectionDeleteAll(): Chainable<CypressResponse>;
    }
  }
}
