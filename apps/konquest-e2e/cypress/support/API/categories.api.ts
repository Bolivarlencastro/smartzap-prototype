import { CypressResponse } from '../interfaces';
import { CUSTOM_CATEGORIES } from '../constants/utils';

const baseUrlChannel = `${Cypress.env('url_api')}/categories`;
const CATEGORY_IMAGE = 'admin';

Cypress.Commands.add('APICategoryDelete', (id) => cy.keepsApi(`${baseUrlChannel}/${id}`, null, 'DELETE'));

Cypress.Commands.add('APICategoryCreate', (categoryName) => {
  cy.keepsApi(
    baseUrlChannel,
    {
      image: CATEGORY_IMAGE,
      name: categoryName,
    },
    'POST',
  );
});

Cypress.Commands.add('APICategoryGetAll', () => cy.keepsApi(baseUrlChannel, null, 'GET'));

Cypress.Commands.add('APICategoryDeleteAll', () => {
  cy.APICategoryGetAll().then((request: any) => {
    const listResults = request.body.results ? request.body.results : [];

    listResults
      .filter((result) => !CUSTOM_CATEGORIES.includes(result.name.toLowerCase()))
      .forEach((result) => cy.APICategoryDelete(result.id));
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      APICategoryDelete(id: string): Chainable<CypressResponse>;
      APICategoryCreate(categoryName: string): Chainable<CypressResponse>;
      APICategoryGetAll(): Chainable<CypressResponse>;
      APICategoryDeleteAll(): Chainable<CypressResponse>;
    }
  }
}
