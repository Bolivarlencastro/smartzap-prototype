/// <reference types="cypress" />

import * as StatusCode from '../../support/constants/status-code';
import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import { USER_CY_ID } from '../../support/constants/users';

let missionCreatedBefore;
let missionToDelete;
let trailToDelete;
let trailCreatedBefore;

describe('Trail enroll in internal mission - OPEN', () => {
  const missionToDelete = [];
  const missionCreatedBefore = [];

  beforeEach(() => {
    missionCreatedBefore.length = 0;
    missionToDelete.length = 0;
    cy.Login('admin');
    cy.FixturesTrail()
      .then((trailDefault) => {
        trailDefault.name = getRandomName();
        return cy.APITrailCreate(trailDefault);
      })
      .then((response) => {
        expect(response.body.learning_trail_type).equal(util.TRAIL_OPEN_TYPE_UUID);
        trailCreatedBefore = response.body;
        trailToDelete = trailCreatedBefore.id;
      });
    cy.FixturesMissionStageContent()
      .then((response) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        fixtures.mission.mission_type.id = util.OPEN_TYPE_ID;
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((missionCreated) => {
        expect(missionCreated.mission_type).equal(util.OPEN_TYPE_ID);
        missionCreatedBefore.push(missionCreated);
        missionToDelete.push(missionCreated.id);
        cy.APITrailLinkMission(trailCreatedBefore.id, missionCreated.id, 1);
      });
  });

  it('User should enroll in trail and access mission inside it', () => {
    cy.Login('user');
    cy.TrailAccess();
    cy.TrailSearch(trailCreatedBefore.name);
    cy.TrailOpenCard(trailCreatedBefore.name);
    cy.TrailEnroll();
    cy.TrailVerifyEnrolled(trailCreatedBefore);
    cy.EnrollmentsTrailOpen(trailCreatedBefore);
    cy.TrailMissionOpen(missionCreatedBefore[0].name);
    cy.GetMetaDataSelectorAndClick('open-mission');
    cy.ClassroomOpenVerify();
  });

  it('User should be enrolled trail and mission open', () => {
    const user = Cypress.env('user_cy');

    cy.TrailAccess();
    cy.TrailSearch(trailCreatedBefore.name);
    cy.TrailOpenCard(trailCreatedBefore.name);

    cy.TrailBatchEnrollment(user, 'required').then((response) => {
      expect(response.request.body.learning_trails).to.include(trailCreatedBefore.id);
      expect(response.request.body.users).to.include(USER_CY_ID);
      expect(response.response.statusCode).to.eq(StatusCode.OK);
    });

    cy.Login('user');
    cy.EnrollmentsAccessTrail();
    cy.EnrollmentsSearchTrail(trailCreatedBefore.name);
    cy.EnrollmentsVerifyTrail(trailCreatedBefore.name);
    cy.EnrollmentsTrailOpen(trailCreatedBefore);

    cy.TrailMissionOpen(missionCreatedBefore[0].name);
    cy.GetMetaDataSelectorAndClick('open-mission');
    cy.ClassroomOpenVerify();
    cy.CloseClassroom();
    cy.PressEsc();

    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreatedBefore[0].name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.ENROLLED);
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APITrailDelete(trailToDelete);
    missionToDelete.forEach((missionToDelete) => {
      cy.APICourseDelete(missionToDelete);
    });
  });
});

describe('Trail enroll in internal mission - CLOSED', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesTrail()
      .then((trailDefault) => {
        trailDefault.name = getRandomName();
        trailDefault.trail_type = util.TRAIL_CLOSED_TYPE_UUID;
        return cy.APITrailCreate(trailDefault);
      })
      .then((response) => {
        expect(response.body.learning_trail_type).equal(util.TRAIL_CLOSED_TYPE_UUID);
        trailCreatedBefore = response.body;
        trailToDelete = trailCreatedBefore.id;
      });
    cy.FixturesMissionStageContent()
      .then((response) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((missionCreated) => {
        expect(missionCreated.mission_type).equal(util.CLOSED_TYPE_ID);
        missionCreatedBefore = missionCreated;
        missionToDelete = missionCreatedBefore.id;
        cy.APITrailLinkMission(trailCreatedBefore.id, missionCreated.id, 1);
      });
  });
  it('User should access trail and mission after be enrolled', () => {
    cy.TrailAccess();
    cy.TrailSearch(trailCreatedBefore.name);
    cy.TrailOpenCard(trailCreatedBefore.name);
    cy.TrailBatchEnrollment(Cypress.env('user_cy')).then((response) => {
      expect(response.request.body.learning_trails).contains(trailCreatedBefore.id);
      expect(response.request.body.users).contains(USER_CY_ID);
      expect(response.response.statusCode).eq(StatusCode.OK);
    });
    cy.Login('user');
    cy.EnrollmentsAccessTrail();
    cy.EnrollmentsSearchTrail(trailCreatedBefore.name);
    cy.EnrollmentsVerifyTrail(trailCreatedBefore.name);
    cy.EnrollmentsTrailOpen(trailCreatedBefore);
    cy.TrailMissionOpen(missionCreatedBefore.name);
    cy.GetMetaDataSelectorAndClick('open-mission');
    cy.ClassroomOpenVerify();
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APITrailDelete(trailToDelete);
    cy.APICourseDelete(missionToDelete);
  });
});

describe('Trail enroll in external mission', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APITrailCreateWithExternalMission().then((response) => {
      trailCreatedBefore = response[0];
      missionCreatedBefore = response[1];
      trailToDelete = trailCreatedBefore.id;
      missionToDelete = missionCreatedBefore.id;
    });
  });

  it('User enrolls in a trail with an external mission', () => {
    cy.Login('user');
    cy.TrailAccess();
    cy.TrailSearch(trailCreatedBefore.name);
    cy.TrailOpenCard(trailCreatedBefore.name);
    cy.TrailEnroll();
    cy.TrailVerifyEnrolled(trailCreatedBefore);
    cy.EnrollmentsTrailOpen(trailCreatedBefore);
    cy.TrailMissionOpen(missionCreatedBefore.name);
    cy.VerifyMetadataElementVisible('mission-popup-provider-selector');
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APITrailDelete(trailToDelete);
    cy.APICourseDelete(missionToDelete);
  });
});
