/// <reference types="cypress" />
import { Interception } from 'cypress/types/net-stubbing';
import UserElements from '../elements/users-elements';
import * as StatusCode from '../constants/status-code';

Cypress.Commands.add('UsersAccess', () => {
  cy.intercept('**/users**').as('loadUsers');
  cy.get('[ng-reflect-router-link="/users"]', { timeout: 60000 }).click();
  cy.wait('@loadUsers');
});

Cypress.Commands.add('UsersWaitLoadProfile', () => {
  cy.intercept('**/users/**/workspaces').as('loadProfile');
  cy.intercept('**/applications/roles').as('loadRoles');
  cy.intercept('**/languages').as('loadLanguages');
  cy.visit('');
  cy.wait('@loadProfile');
  cy.wait('@loadRoles');
  cy.wait('@loadLanguages');
});

Cypress.Commands.add('UsersUploadFile', (file) => {
  UserElements.fieldUploadFile();
  return UserElements.buttonUploadFile().selectFile(file, { force: true });
});

Cypress.Commands.add('UsersImportConfirm', () => {
  return UserElements.buttonConfirm().click();
});

Cypress.Commands.add('UsersSelectPermissionInBatch', (role) => {
  UserElements.roleSelectorInKonquest().click();
  return UserElements.roleOption(role).click();
});

Cypress.Commands.add('UsersImport', (file, usersDefault = {}) => {
  cy.intercept('**/users/import').as('userImport');
  cy.GetMetaDataSelectorAndClick('button-open-dialog-import-users');
  cy.UsersUploadFile(file);
  cy.UsersImportConfirm();
  cy.UsersSelectPermissionInBatch(usersDefault.role);
  cy.UsersRolesImportConfirm()
    .wait('@userImport')
    .then((request: any) => {
      const createdUser = request.response.body.imported;
      expect(request.response.statusCode).to.equal(StatusCode.OK);
      cy.UsersStatusImport(usersDefault);
      return cy.wrap(createdUser);
    });
});

Cypress.Commands.add('UsersRolesImportConfirm', () => {
  return UserElements.buttonConfirm().click();
});

Cypress.Commands.add('UsersStatusImport', (usersDefault = {}) => {
  return UserElements.infoImportUser()
    .contains(usersDefault.successImportUser)
    .should('be.hidden')
    .should('contain', usersDefault.successImportUser);
});

Cypress.Commands.add('UsersSearch', (usersDefault: { name: string }) => {
  cy.intercept(`**/users?page=1&limit=25&search=${usersDefault.name}**`).as('searchUser');
  return UserElements.search().clear().type(usersDefault.name).wait('@searchUser');
});

Cypress.Commands.add('UsersVerifyName', (name: string) => {
  return UserElements.tableName().contains(name).should('be.visible');
});

Cypress.Commands.add('UsersSelectByName', (usersDefault: { name: string }) => {
  cy.intercept('**/user-roles/**').as('roleUser');
  cy.intercept('**/users/**').as('getUser');
  UserElements.tableName().contains(usersDefault.name).should('be.visible').click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
});

Cypress.Commands.add('UsersVerifyEmail', (email: string) => {
  return UserElements.tableEmail().contains(email).should('be.visible');
});

Cypress.Commands.add('UsersVerifyListFields', (usersDefault = {}) => {
  cy.UsersSearch(usersDefault);
  cy.UsersVerifyName(usersDefault.name);
  cy.UsersVerifyEmail(usersDefault.email);
});

Cypress.Commands.add('UsersButtonNew', () => {
  UserElements.buttonNewUser().click();
  return cy.url().should('contain', '/users/new');
});

Cypress.Commands.add('UsersFormFieldEmail', (email) => {
  return UserElements.formFieldEmail().should('be.visible').type(`${email}{enter}`, { force: true });
});

Cypress.Commands.add('UsersFormFieldName', (name) => {
  return UserElements.formFieldName().should('be.visible').type(`${name}{enter}`, { force: true });
});

Cypress.Commands.add('UsersFormFieldLanguage', () => {
  return UserElements.formFieldLanguage().should('be.visible').click();
});

Cypress.Commands.add('UsersOptionLanguage', (language) => {
  if (language == 'Português') {
    return UserElements.optionLanguage().contains(language).should('be.visible').click();
  }
});

Cypress.Commands.add('UsersSaveForm', () => {
  return UserElements.saveFormUser().click();
});

Cypress.Commands.add('UsersCreate', (usersDefault) => {
  cy.intercept('**/users').as('successSaveUser');
  cy.UsersAccess();
  cy.UsersButtonNew();
  cy.UsersFormFieldName(usersDefault.name);
  cy.UsersFormFieldEmail(usersDefault.email);
  cy.UsersFormFieldLanguage();
  cy.UsersOptionLanguage(usersDefault.language);
  cy.UsersSaveForm();
  cy.wait('@successSaveUser').then((request) => {
    const createdUser = request.response.body;
    expect(request.response.statusCode).to.equal(StatusCode.Created);
    return cy.wrap(createdUser);
  });
});

Cypress.Commands.add('UsersSelectWorkspace', (usersDefault = {}) => {
  return UserElements.workspaceEditButton().should('be.visible').contains(usersDefault.workspace).click();
});

Cypress.Commands.add('UserSelectPermissionsManually', (usersDefault = {}) => {
  cy.intercept(`**/user-roles/**`).as('roleUser');
  cy.intercept('**/users/**').as('getUser');
  UserElements.roleTab().click();
  UserElements.roleSelectorInKonquest().click();
  UserElements.roleOption(usersDefault.role).click();
  UserElements.buttonConfirm().last().click();
  cy.wait('@roleUser').then((request) => {
    const roleUser = request.response.body;
    expect(request.response.statusCode).to.equal(StatusCode.OK);
    cy.wait('@getUser');
    return cy.wrap(roleUser);
  });
});

Cypress.Commands.add('UsersOpen', (usersDefault = {}) => {
  cy.UsersAccess();
  cy.UsersSearch(usersDefault);
  return cy.UsersSelectByName(usersDefault);
});

Cypress.Commands.add('UsersVerifyRole', (usersDefault = {}) => {
  UserElements.roleTab().click();
  UserElements.roleSelectorInKonquest().contains(usersDefault.roleName);
});

Cypress.Commands.add('PressEsc', () => {
  return cy.get('body').type('{esc}', { force: true });
});

Cypress.Commands.add('UsersRequestNewPassword', () => {
  cy.intercept('**/set-password').as('newPassword');
  UserElements.buttonNewPassword()
    .scrollIntoView()
    .should('be.visible')
    .click()
    .wait('@newPassword')
    .then((response) => {
      return response.request.body.password;
    });
});

Cypress.Commands.add('UsersChangeNewPassword', () => {
  return cy.UsersRequestNewPassword();
});

Cypress.Commands.add('UsersCloseProfile', () => {
  return UserElements.closeModal().click();
});
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      UsersImport(file: any, userDefault: any): Chainable<JQuery<any>>;
      UsersAccess(): Chainable<Window>;
      UsersWaitLoadProfile(): Chainable<Window>;
      UsersUploadFile(file: string): Chainable<JQuery<HTMLElement>>;
      UsersImportConfirm(): Chainable<JQuery<HTMLElement>>;
      UsersRolesImportConfirm(): Chainable<JQuery<HTMLElement>>;
      UsersStatusImport(usersDefault: any): Chainable<JQuery<HTMLElement>>;
      UsersSearch(usersDefault: { name: string }): Chainable<Interception>;
      UsersVerifyName(name: string): Chainable<JQuery<HTMLElement>>;
      UsersSelectByName(usersDefault: { name: string }): Chainable<JQuery<HTMLElement>>;
      UsersVerifyEmail(email: string): Chainable<any>;
      UsersVerifyListFields(usersDefault: any): Chainable<Window>;
      UsersButtonNew(): Chainable<string>;
      UsersFormFieldEmail(email: string): Chainable<JQuery<HTMLElement>>;
      UsersFormFieldName(name: string): Chainable<JQuery<HTMLElement>>;
      UsersFormFieldLanguage(): Chainable<JQuery<HTMLElement>>;
      UsersOptionLanguage(language: string): Chainable<any>;
      UsersSaveForm(): Chainable<JQuery<HTMLElement>>;
      UsersCreate(usersDefault: any): Chainable<JQuery<any>>;
      UsersSelectWorkspace(usersDefault: any): Chainable<JQuery<HTMLElement>>;
      UserSelectPermissionsManually(usersDefault: any): Chainable<JQuery<any>>;
      UsersSelectPermissionInBatch(role: string): Chainable<JQuery<HTMLElement>>;
      UsersOpen(usersDefault: any): Chainable<any>;
      UsersChangeNewPassword(): Chainable<any>;
      UsersRequestNewPassword(): Chainable<any>;
      UsersVerifyRole(usersDefault: any): Chainable<JQuery<HTMLElement>>;
      PressEsc(): Chainable<JQuery<HTMLElement>>;
      UsersCloseProfile(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
