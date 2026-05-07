/// <reference types="cypress" />

const fileSheetPath = `cypress/fixtures/${Cypress.env('ENVIRONMENT')}/users/cadastrar-ou-atualizar-usuarios.xlsx`;
const fileSheet200UsersPath = `cypress/fixtures/${Cypress.env('ENVIRONMENT')}/users/sheet-with-200-users.xlsx`;
const usersPath = `${Cypress.env('ENVIRONMENT')}/users/default.json`;
const filePath = `/imageJPG.jpg`;
let userToDelete = [];
let userCreatedBefore;
import { getRandomNumber } from '../support/commands';
import UsersElements from '../support/elements/users-elements';
import * as StatusCode from '../support/constants/status-code';

it('Should import user by sheet', () => {
  const fileImportUsers = fileSheetPath;
  cy.fixture(usersPath).then((usersDefault) => {
    cy.Login('admin');
    cy.UsersAccess();
    cy.UsersImport(fileImportUsers, usersDefault).then((createdUser: any) => {
      createdUser.forEach((createdUser) => {
        userToDelete.push(createdUser.id);
      });
    });
    cy.PressEsc();
    cy.UsersAccess();
    cy.UsersVerifyListFields(usersDefault);
    cy.UsersSelectByName(usersDefault);
    cy.UsersVerifyRole(usersDefault);
  });
});

it.skip('Should import 200 users by sheet', () => {
  const fileImportUsers = fileSheet200UsersPath;
  cy.fixture(usersPath).then((usersDefault) => {
    cy.Login('admin');
    cy.UsersImport(fileImportUsers, usersDefault).then((createdUser: any) => {
      createdUser.forEach((createdUser) => {
        userToDelete.push(createdUser.id);
      });
    });
  });
});

it('Should create user', () => {
  cy.fixture(usersPath).then((usersDefault) => {
    usersDefault.name = getRandomNumber();
    usersDefault.email = `${getRandomNumber()}@cypress.com.br`;

    cy.Login('admin');
    cy.UsersCreate(usersDefault).then((createdUser: any) => {
      userToDelete.push(createdUser.id);
    });
    cy.UserSelectPermissionsManually(usersDefault);
    cy.UsersCloseProfile();
    cy.UsersVerifyListFields(usersDefault);
    cy.UsersSelectByName(usersDefault);
    cy.UsersVerifyRole(usersDefault);
  });
});

describe('Should change roles one a one', () => {
  beforeEach(() => {
    cy.fixture(usersPath).then((usersDefault) => {
      usersDefault.name = String(getRandomNumber());
      usersDefault.email = `${getRandomNumber()}@cypress.com.br`;
      cy.Login('admin');
      cy.APIUserCreate(usersDefault).then((request: any) => {
        const createdUser = request.body;
        expect(request.status).to.equal(201);
        userToDelete.push(createdUser.id);
        userCreatedBefore = createdUser;
      });
      cy.UsersOpen(usersDefault);
    });
  });

  it('Should update profile image with admin user', () => {
    cy.fixture(filePath, 'binary').then((imageBinary) => {
      cy.APICreateAvatar(imageBinary).then(({ status, body }) => {
        expect(status).to.equal(StatusCode.Created);
        expect(body).to.have.property('url');

        cy.APIUpdateUserAvatar(userCreatedBefore.id, body.url).then(({ status: updateStatus, body: updateBody }) => {
          expect(updateStatus).to.equal(StatusCode.OK);
          expect(updateBody.avatar).to.equal(body.url);
        });
      });
    });
  });
  it('Should change role admin', () => {
    cy.fixture(usersPath).then((usersDefault) => {
      usersDefault.role = 'admin';
      usersDefault.roleName = 'Admin';
      usersDefault.name = userCreatedBefore.name;
      usersDefault.email = userCreatedBefore.email;
      cy.UserSelectPermissionsManually(usersDefault);
      cy.UsersCloseProfile();
      cy.UsersVerifyListFields(userCreatedBefore);
      cy.UsersSelectByName(usersDefault);
      cy.UsersVerifyRole(usersDefault);
    });
  });

  it('Should change role curator', () => {
    cy.fixture(usersPath).then((usersDefault) => {
      usersDefault.role = 'curator';
      usersDefault.roleName = 'Curador';
      usersDefault.name = userCreatedBefore.name;
      usersDefault.email = userCreatedBefore.email;
      cy.UserSelectPermissionsManually(usersDefault);
      cy.UsersCloseProfile();
      cy.UsersVerifyListFields(userCreatedBefore);
      cy.UsersSelectByName(usersDefault);
      cy.UsersVerifyRole(usersDefault);
    });
  });

  it('Should change role content', () => {
    cy.fixture(usersPath).then((usersDefault) => {
      usersDefault.role = 'content';
      usersDefault.roleName = 'Conteúdista';
      usersDefault.name = userCreatedBefore.name;
      usersDefault.email = userCreatedBefore.email;
      cy.UserSelectPermissionsManually(usersDefault);
      cy.UsersCloseProfile();
      cy.UsersVerifyListFields(userCreatedBefore);
      cy.UsersSelectByName(usersDefault);
      cy.UsersVerifyRole(usersDefault);
    });
  });

  it('Should change role super_admin', () => {
    cy.fixture(usersPath).then((usersDefault) => {
      usersDefault.role = 'super_admin';
      usersDefault.roleName = 'Super Admin';
      usersDefault.name = userCreatedBefore.name;
      usersDefault.email = userCreatedBefore.email;
      cy.UserSelectPermissionsManually(usersDefault);
      cy.UsersCloseProfile();
      cy.UsersVerifyListFields(userCreatedBefore);
      cy.UsersSelectByName(usersDefault);
      cy.UsersVerifyRole(usersDefault);
    });
  });

  it('Should change role instructor', () => {
    cy.fixture(usersPath).then((usersDefault) => {
      usersDefault.role = 'instructor';
      usersDefault.roleName = 'Instrutor';
      usersDefault.name = userCreatedBefore.name;
      usersDefault.email = userCreatedBefore.email;
      cy.UserSelectPermissionsManually(usersDefault);
      cy.UsersCloseProfile();
      cy.UsersVerifyListFields(userCreatedBefore);
      cy.UsersSelectByName(usersDefault);
      cy.UsersVerifyRole(usersDefault);
    });
  });

  it('Should change password and try to acess with new credentials', () => {
    cy.intercept('GET', '**/languages').as('languagesLoad');
    cy.intercept('GET', '**/users/info').as('userInfo');

    cy.fixture(usersPath)
      .then((usersDefault) => {
        usersDefault.role = 'user';
        cy.UserSelectPermissionsManually(usersDefault);
        cy.UsersChangeNewPassword();
      })
      .then((newPassword) => {
        cy.LoginWithNewPassword(userCreatedBefore, newPassword);
      });
    cy.visit('/');
    cy.wait('@languagesLoad');
    cy.wait('@userInfo').then((user) => {
      expect(user.response.statusCode).eq(StatusCode.OK);
      expect(user.response.body.email).eq(userCreatedBefore.email);
      expect(user.response.body.name).eq(userCreatedBefore.name);
    });
    UsersElements.userMenuButton().contains(userCreatedBefore.name);
  });
});

afterEach(() => {
  cy.Login('admin');
  userToDelete.forEach((userToDelete) => {
    cy.APIUserDelete(userToDelete);
  });
  userToDelete = [];
});
