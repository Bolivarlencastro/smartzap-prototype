// <reference types="cypress" />
import MissionElements from '../../support/elements/mission-elements';
import * as util from '../../support/constants/utils';
let missionToDelete;
let createdMission;

beforeEach(() => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    });
});
it("Create mission live with today's date and check the live link is visible", () => {
  cy.Login('user');
  cy.MissionDetailAccessDirectly(createdMission.id);

  MissionElements.livePresentialPopupFlagToday().should('be.visible').contains('É HOJE!');
  MissionElements.livePresentialPopupUrlOrAdress().should('have.text', util.ONLINE_EVENT_URL);
});

afterEach(() => {
  if (missionToDelete) {
    cy.Login('admin');
    cy.APICourseDelete(missionToDelete);
  }
});
