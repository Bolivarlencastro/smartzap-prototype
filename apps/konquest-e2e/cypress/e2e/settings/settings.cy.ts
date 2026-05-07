/// <reference types="cypress" />

import MissionElements from '../../support/elements/mission-elements';
import { getRandomName } from '../../support/commands';

let missionToDelete;

it('Change workspace performance', () => {
  cy.Login('admin');
  cy.FixturesMission()
    .then((fixture) => ({ ...fixture, name: getRandomName() }))
    .then((fixture) => {
      return cy.APIMissionCreate(fixture);
    })
    .then((mission) => {
      missionToDelete = mission.body.id;
      cy.SettingsAccess();
      cy.SettingsChangeWorkspacePerformance('50');

      cy.MissionDetailAccessDirectly(mission.body.id);
      MissionElements.missionPopupResumeSelector().contains('50%').should('be.visible');
    });
});

afterEach(() => {
  if (missionToDelete) {
    cy.APICourseDelete(missionToDelete);
    missionToDelete = false;
  }
  cy.APIWorkspaceSettings({ min_performance_certificate: 0.7 });
});
