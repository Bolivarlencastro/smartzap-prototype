import { SettingsOptions, CypressResponse } from '../interfaces';
import { WORKSPACE_DEFAULT_UUID } from '../constants/utils';

const baseUrlSettings = `${Cypress.env('url_api_myaccount')}/workspaces/${WORKSPACE_DEFAULT_UUID}`;

Cypress.Commands.add('APIWorkspaceSettings', (payload) => {
  const token = localStorage.getItem('auth-token');

  return cy.keepsApi(baseUrlSettings, payload, 'PATCH', { Authorization: token });
});

declare global {
  namespace Cypress {
    interface Chainable {
      APIWorkspaceSettings(payload: SettingsOptions): Chainable<CypressResponse>;
    }
  }
}
