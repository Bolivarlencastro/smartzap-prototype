/// <reference types="cypress" />

import { NO_RESULTS_FOUND } from '../../support/constants/utils';
import UsersElements from '../../support/elements/users-elements';

let userToDelete;

describe('User delete', () => {
  beforeEach(() => {
    cy.FixturesUser().then((userDefault) => {
      cy.Login('admin');
      cy.APIUserCreate(userDefault).then((response) => {
        const createdUser = response.body[0];
        expect(response.status).to.equal(201);
        userToDelete = createdUser;
      });
    });
  });
  it('As an Admin, I should be able to delete a user', () => {
    cy.UserAccess();
    cy.UserSearch(userToDelete.name);
    cy.UserDelete();
    cy.reload();
    cy.UserSearch(userToDelete.name);
    UsersElements.userSelectors().contains(NO_RESULTS_FOUND);
  });
});
