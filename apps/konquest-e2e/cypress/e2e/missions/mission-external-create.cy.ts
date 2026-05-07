/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import MissionElements from '../../support/elements/mission-elements';
let missionToDelete;

describe('External Mission ', () => {
  it('Should create a external mission, default', () => {
    cy.Login('admin');
    cy.FixturesMission().then((missionDefault) => {
      const mission = { ...missionDefault, name: getRandomName() };
      cy.MissionExternalStepInfo(mission).then((response) => {
        missionToDelete = response.id;
      });
      cy.MissionStepAccess('Provedor');
      MissionElements.providerFormExternalMission().should('be.visible');
      cy.MissionStepProviders(mission);
      cy.MissionStepFinish();
      cy.MissionVerifyPopup(mission.name);
      cy.MissionFlagStatus(util.PUBLISHED);
    });
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
      missionToDelete = false;
    }
  });
});
