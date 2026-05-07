/// <reference types="cypress" />

import { getRandomName, getRandomNumber } from '../../support/commands';
import UsersElements from '../../support/elements/users-elements';

let userCreated;
let userToDelete;

describe('User Edit', () => {
  beforeEach(() => {
    cy.FixturesUser().then((userDefault) => {
      cy.Login('admin');
      cy.APIUserCreate(userDefault).then((response) => {
        const createdUser = response.body[0];
        expect(response.status).to.equal(201);
        userCreated = createdUser;
        userToDelete = createdUser.id;
      });
    });
  });
  it('As an Admin, I should be able to Edit a user', () => {
    cy.UserAccess();
    cy.UserSearch(userCreated.name);
    const userEdit = {
      name: getRandomName(),
      email: `${getRandomName()}@cypress.com.br`,
      number: getRandomNumber(),
      tag: getRandomName(),
    };
    cy.UserEdit(userEdit);
    cy.reload();
    cy.UserSearch(userEdit.name);
    UsersElements.userListSelector().contains(userEdit.name);
    UsersElements.userListSelector().contains(userEdit.email);
    UsersElements.userListSelector().contains(userEdit.number);
    UsersElements.userListSelector().contains(userEdit.tag);
  });

  afterEach(() => {
    if (userToDelete) {
      cy.APIUserDelete(userToDelete);
    }
  });
});
