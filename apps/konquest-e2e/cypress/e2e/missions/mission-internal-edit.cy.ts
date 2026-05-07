/// <reference types="cypress" />
import MissionElements from '../../support/elements/mission-elements';
import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import { MissionTopicOptions } from '../../support/interfaces';
import { YOU_TUBE_LINK } from '../../support/constants/players';
let missionToDelete;

describe('Tests edit mission', () => {
  it('Should edit mission adding more topics', () => {
    cy.FixturesMission().then((missionDefault) => {
      const mission = { ...missionDefault, name: getRandomName() };
      const topic: MissionTopicOptions = { link: YOU_TUBE_LINK, title: util.CONTENT };
      cy.Login('admin');
      cy.APIMissionCreate(mission).then((response) => (missionToDelete = response.body.id));
      cy.SearchInMissionCreatedByMe(mission.name);
      cy.MissionOpenCard(mission.name);
      cy.MissionButtonEdit();
      cy.MissionStepAccess(util.CONTENTS);
      cy.MissionTopic(topic);
      cy.MissionTopic(topic);
      cy.MissionTopic(topic);
      MissionElements.ButtonInfoNext().scrollIntoView().click();
      cy.MissionPublish();
      cy.MissionVerifyPopup(mission.name);
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
