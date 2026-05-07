import WorkspaceElements from '../elements/workspace-elements';

const workspace = 'Cypress Teste';
const credentials = {
  admin: { username: Cypress.env('admin_cy'), password: Cypress.env('pass') },
  admin2: { username: Cypress.env('admin_cy2'), password: Cypress.env('pass') },
  superAdmin: { username: Cypress.env('super_admin_cy'), password: Cypress.env('pass') },
  user: { username: Cypress.env('user_cy'), password: Cypress.env('pass') },
  user2: { username: Cypress.env('user_cy_2'), password: Cypress.env('pass') },
};

Cypress.Commands.add('Login', (profile) => {
  const username = credentials[profile].username;
  const password = credentials[profile].password;

  // keycloak Login
  return cy
    .session(username, () => {
      cy.visit('/');
      cy.get('.login-pf-page-header').should('be.exist');
      cy.url().should('contain', '/keeps-dev/protocol/openid-connect');
      cy.get('#username').type(username);
      cy.get('#password').type(password, { log: false });
      cy.get('#kc-login').click();
    })
    .then(() => {
      // Select the workspace
      cy.visit('/');
      cy.intercept('**/workspaces?**', saveLocalStorageData).as('workspaces_request');
      cy.wait('@workspaces_request');
      WorkspaceElements.card(workspace).click();
    });
  /* .then(() => {
      // Store local storage data
      cy.intercept('https://learning-platform-api-stage.keepsdev.com/myaccount/users/**', saveLocalStorageData).as(
        'users_request'
      );
      cy.wait('@users_request');
    }) */
});

Cypress.Commands.add('LoginWithNewPassword', (usersDefault, newPassword) => {
  const username = usersDefault.email;
  const password = newPassword;

  // keycloak Login
  return cy.session(username, () => {
    cy.visit('/');
    cy.get('.login-pf-page-header').should('be.exist');
    cy.url().should('contain', '/keeps-dev/protocol/openid-connect');
    cy.get('#username').type(username);
    cy.get('#password').type(password, { log: false });
    cy.get('#kc-login').click();
    cy.get('#kc-accept').click();
    cy.get('#password-new').type(Cypress.env('pass'));
    cy.get('#password-confirm').type(Cypress.env('pass'));
    cy.get('#kc-form-buttons [value="Ok"]').click();
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

function extractHeaders() {
  return { 'x-client': localStorage.getItem('x-client'), Authorization: localStorage.getItem('auth-token') };
}

function saveLocalStorageData({ headers }) {
  cy?.window().then((win) => {
    // TODO: change the way to get de x-client
    // win?.localStorage.setItem('x-client', headers['x-client']);
    win?.localStorage.setItem('x-client', '7b2c5110-14d8-4a55-b984-be4eb3b3fdbf');
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
       * @example cy.NavigateTo('dashboard')
       */
      NavigateTo(route: string): Cypress.Chainable<null>;

      /**
       * Call keeps apis.
       * @example cy.keepsApi('dsadasd')
       */
      keepsApi(url: string, body: any, method: string, headers?): Cypress.Chainable<any>;

      LoginWithNewPassword(usersDefault: { email: string }, newPassword: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
