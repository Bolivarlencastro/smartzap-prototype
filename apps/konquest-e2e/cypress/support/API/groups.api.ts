import { Interception } from 'cypress/types/net-stubbing';
import { CypressResponse } from '../interfaces';

const baseUrlGroups = `${Cypress.env('url_api')}/groups`;

Cypress.Commands.add('APIGroupCreate', (groupName) => {
  return cy.keepsApi(baseUrlGroups, { name: groupName }, 'POST');
});

Cypress.Commands.add('APIGroupLinkMission', (groupID, data) => {
  cy.keepsApi(
    `${baseUrlGroups}/${groupID}/missions`,
    {
      missions: data.missions,
      enrollment_goal_date: data.enrollment_goal_date,
    },
    'POST',
  );
});

Cypress.Commands.add('APIGroupDelete', (UUID) => {
  return cy.keepsApi(`${baseUrlGroups}/${UUID}`, {}, 'DELETE');
});

Cypress.Commands.add('APIGetGroupByName', (name) => {
  return cy.keepsApi(`${baseUrlGroups}?page=1&per_page=10&search=${name}`, {}, 'GET');
});

Cypress.Commands.add('APIUserGroupDelete', (groupId, userId) => {
  return cy.keepsApi(`${baseUrlGroups}/${groupId}/users/${userId}`, {}, 'DELETE');
});

declare global {
  namespace Cypress {
    interface Chainable {
      APIGroupCreate(groupName: string): Chainable<CypressResponse>;
      APIGroupLinkMission(groupdID: string, data): Chainable<Interception>;
      APIGroupDelete(UUID: string): Chainable<Interception>;
      APIGetGroupByName(name: string): Chainable<Interception>;
      APIUserGroupDelete(groupId: string, userId: string): Chainable<Interception>;
    }
  }
}
