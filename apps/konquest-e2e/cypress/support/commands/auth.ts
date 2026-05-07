import * as util from '../constants/utils';
import WorkspaceElements from '../elements/companys-elements';

const credentials = {
  admin: { username: Cypress.env('admin_cy'), password: Cypress.env('pass') },
  admin2: { username: Cypress.env('admin_cy2'), password: Cypress.env('pass') },
  superAdmin: { username: Cypress.env('super_admin_cy'), password: Cypress.env('pass') },
  user: { username: Cypress.env('user_cy'), password: Cypress.env('pass') },
  instructor: { username: Cypress.env('instructor_cy'), password: Cypress.env('pass') },
};

Cypress.Commands.add('Login', (profile, workspace = 'Cypress Teste') => {
  const username = credentials[profile].username;
  const password = credentials[profile].password;

  // keycloak Login
  return cy
    .session(username, () => {
      cy.visit('/');
      cy.get('.login-pf-page-header').should('be.exist');
      cy.url().should('contain', '/keeps-dev/protocol/openid-connect');
      cy.get('#username').should('be.visible', { timeout: 12000 }).type(username);
      cy.get('#password').type(password, { log: false });
      cy.get('#kc-login').click();
    })
    .then(() => {
      // Select the workspace
      cy.visit('/');
      cy.intercept('GET', '**/myaccount-v2/api/workspaces**', saveLocalStorageData).as('workspaces_request');
      cy.intercept('GET', '**/application-services').as('services_request');
      cy.wait('@workspaces_request');
      WorkspaceElements.card(workspace).click();
      cy.wait('@services_request');
      localStorage.setItem('hideOnboardingTutorial', 'true');
    });
});

Cypress.Commands.add('keepsApi', (url: string, body: any, method = 'GET', headers = {}) => {
  return cy
    .getAllLocalStorage()
    .then(extractHeaders)
    .then((extractedHeaders) =>
      cy.request({
        url,
        headers: { ...extractedHeaders, ...headers },
        method,
        ...(!!body && { body }),
      }),
    );
});

Cypress.Commands.add('NavigateTo', (route = 'dashboard') => {
  cy.get(`.fuse-vertical-navigation-item[ng-reflect-router-link="/${route}"]`, { timeout: 20000 })
    .should('be.visible')
    .click({ force: true });
  cy.url().should('contain', util.WORKSPACE_DEFAULT);
});

function extractHeaders() {
  return {
    'x-client': localStorage.getItem('x-client'),
    Authorization: localStorage.getItem('auth-token').replace('Bearer ', ''),
  };
}

function saveLocalStorageData({ headers }) {
  cy?.window().then((win) => {
    // TODO: change the way to get de x-client
    // win?.localStorage.setItem('x-client', headers['x-client']);
    win?.localStorage.setItem('x-client', util.WORKSPACE_DEFAULT_UUID);
    win?.localStorage.setItem('auth-token', headers['authorization']);
  });
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login.
       * @example cy.login('admin')
       */
      Login(profile: string, workspace?: string): Cypress.Chainable<null>;

      /**
       * Custom to navigate to route.
       * @example cy.login('dashboard')
       */
      NavigateTo(route: string): Cypress.Chainable<null>;

      /**
       * Call keeps apis.
       * @example cy.keepsApi('dsadasd')
       */
      keepsApi(url: string, body: any, method: string, headers?): Cypress.Chainable<any>;
    }
  }
}
