import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';

import TrailElements from '../../support/elements/trail-elements';

let createdTrail;
let createdMission;

describe('Trail with content internal mission', () => {
  beforeEach(() => {
    cy.Login('admin');

    cy.FixturesTrail()
      .then((trail) => cy.APITrailCreate({ ...trail, name: getRandomName() }))
      .then((response) => {
        createdTrail = response.body;
      });

    cy.FixturesMissionStageContent()
      .then((fixtures) => cy.UpdateFixtToRandom(fixtures))
      .then((fixtures) => {
        fixtures.mission.mission_type.id = util.OPEN_TYPE_ID;
        return cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((response) => {
        createdMission = response;
        cy.APITrailLinkMission(createdTrail.id, createdMission.id, 1);
      });
  });

  it('Super admin user should have all action options on trail', () => {
    cy.Login('superAdmin');
    cy.HomeAccess();
    cy.ContentManagementAccess(util.TRAILS);
    cy.ContentManagementSearch(createdTrail.name);
    cy.pause();
    TrailElements.buttonTrailDropdown().click();

    util.TRAIL_MENU_ACTIONS.forEach((item) => {
      TrailElements.listTrailActions().should('contain.text', item);
    });
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APITrailDelete(createdTrail.id);
    cy.APICourseDelete(createdMission.id);
  });
});
