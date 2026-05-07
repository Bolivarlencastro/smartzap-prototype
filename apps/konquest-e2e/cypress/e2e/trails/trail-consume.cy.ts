/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import { USER_CY_ID } from '../../support/constants/users';
import * as util from '../../support/constants/utils';
import SettingsEnrollmentsElements from '../../support/elements/settings-enrollments-elements';
import MissionEnrollmentsElements from '../../support/elements/enrolls-missions-elements';
import TrailElements from '../../support/elements/trail-elements';
import { InternalMissionOptions } from '../../support/interfaces';

let createdTrail;
let externalMission;
let internalMission;
let testFixtures;
let channelPulseContentFixtures;

describe('Trail consume on external and internal mission', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APITrailCreateWithExternalMission().then((response) => {
      createdTrail = response[0];
      externalMission = response[1];
    });

    cy.FixturesMissionStageContent()
      .then((response) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        return cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((response) => {
        internalMission = response;
        cy.APITrailLinkMission(createdTrail.id, internalMission.id, 2);
      })
      .then(() => {
        const payloadEnrollmentTrail = {
          trailUUID: createdTrail.id,
          userUUID: USER_CY_ID,
        };
        return cy.APITrailBatchEnrollments(payloadEnrollmentTrail);
      });
  });
  it('Should finish trail enrollment when finish missions', () => {
    cy.Login('user');
    cy.APITrailGetEnrollment(createdTrail.id)
      .then((response) => {
        const internalMissionEnrollmentId = response.body.steps[1].mission.enrollment.id;
        const externalMissionEnrollmentId = response.body.steps[0].mission.enrollment.id;
        return { internalMissionEnrollmentId, externalMissionEnrollmentId };
      })
      .then((response) => {
        const payloadEnrollmentInternalMission = {
          id: response.internalMissionEnrollmentId,
          performance: '1.00',
        };
        const payloadEnrollmentexternalMission = {
          id: response.externalMissionEnrollmentId,
          performance: '1.00',
        };
        cy.Login('admin');
        cy.APIMissionEnrollmentManualFinish(payloadEnrollmentInternalMission);
        cy.APIMissionEnrollmentManualFinish(payloadEnrollmentexternalMission);
        cy.Login('user');
        cy.EnrollmentsAccessTrail();
        cy.EnrollmentsSearchTrail(createdTrail.name);
        SettingsEnrollmentsElements.enrollmentStatusSelector().contains(util.FINISHED);
      });
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APITrailDelete(createdTrail.id);
    cy.APICourseDelete(internalMission.id);
    cy.APICourseDelete(externalMission.id);
  });
});

describe('Trail with contents internal mission, live event and pulse', () => {
  let liveMissionCreated;
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesTrail()
      .then((trailDefault) => {
        trailDefault.name = getRandomName();
        return cy.APITrailCreate(trailDefault);
      })
      .then((response) => {
        createdTrail = response.body;
      });
    cy.FixturesMissionLive()
      .then((response) => {
        return cy.MissionLiveCreateWithDate(response);
      })
      .then((response) => {
        liveMissionCreated = response;
        return cy.APITrailLinkMission(createdTrail.id, liveMissionCreated.id, 1);
      });
    cy.FixturesMissionStageContent()
      .then((response) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        return cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((response) => {
        internalMission = response;
        return cy.APITrailLinkMission(createdTrail.id, internalMission.id, 2);
      });
    cy.FixturesChannelPulseContent()
      .then((fixtures) => {
        return cy.CreateChannelWithPulseFile(fixtures.content['image'], fixtures);
      })
      .then((response) => {
        cy.APITrailLinkPulse(createdTrail.id, response.body.pulse, 3);
      })
      .then(() => {
        const payloadEnrollmentTrail = {
          trailUUID: createdTrail.id,
          userUUID: USER_CY_ID,
        };
        return cy.APITrailBatchEnrollments(payloadEnrollmentTrail);
      });
  });

  it('Should start a trail enrollment with one live mission', () => {
    cy.APIMissionLiveFinish(liveMissionCreated.id);
    cy.Login('user');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000); // time to sync mission enrollment on trail
    cy.APITrailGetEnrollment(createdTrail.id)
      .then((response) => {
        const missionEnrollmentId = response.body.steps[1].mission.enrollment.id;
        const pulseCreated = response.body.steps[2].pulse;
        return { pulseCreated, missionEnrollmentId };
      })
      .then((response) => {
        const payloadEnrollmentInternalMission = {
          id: response.missionEnrollmentId,
          performance: '1.00',
        };
        cy.Login('admin');
        cy.APIMissionEnrollmentManualFinish(payloadEnrollmentInternalMission);
        cy.Login('user');
        cy.OpenPulseContent(response.pulseCreated).PulseValidImgContent();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000); //time to consume
        cy.EnrollmentsAccessTrailEnrolled(createdTrail);
        cy.PressEsc();
        cy.EnrollmentsAccessTrail();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(60000); //wait for routine to finish trail
        cy.EnrollmentsSearchTrail(createdTrail.name);
        MissionEnrollmentsElements.enrollmentStatus().contains(util.STARTED).should('be.visible');
      });
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APITrailDelete(createdTrail.id);
    cy.APICourseDelete(liveMissionCreated.id);
    cy.APICourseDelete(internalMission.id);
  });
});

describe('Trail with internal mission open', () => {
  beforeEach(() => {
    internalMission = [];
    // internalMission.length = 0;
    cy.Login('admin');
    cy.FixturesTrail()
      .then((trailDefault) => {
        trailDefault.name = getRandomName();
        return cy.APITrailCreate(trailDefault);
      })
      .then((response) => {
        expect(response.body.learning_trail_type).equal(util.TRAIL_OPEN_TYPE_UUID);
        createdTrail = response.body;
      });
    cy.FixturesMissionStageContent()
      .then((response) => {
        testFixtures = response;
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        fixtures.mission.mission_type.id = util.OPEN_TYPE_ID;
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((missionCreated) => {
        expect(missionCreated.mission_type).equal(util.OPEN_TYPE_ID);
        internalMission.push(missionCreated);
        cy.APITrailLinkMission(createdTrail.id, missionCreated.id, 1);
      });
  });

  it('Should finish trail enrollment automatically when has missions with status: Active, Inactive, In Review', () => {
    cy.MissionCreateMultipleWithContent(2, testFixtures.content.video)
      .then((missionList) => {
        missionList.forEach((mission) => {
          cy.APITrailLinkMission(createdTrail.id, mission.id, 1);
        });
        internalMission.push(missionList.shift(), missionList.shift());
        testFixtures.mission.is_active = false;
        testFixtures.mission.missionUUID = internalMission[0].id;
        cy.APIMissionSettingsUpdate(testFixtures.mission);
        cy.APIMissionPublish(internalMission[1].id);
        testFixtures.enrollment.missionUUID = internalMission[2].id;
        cy.APIMissionEnrollUser(testFixtures.enrollment);
      })
      .then((response) => {
        testFixtures.enrollment.id = response.body.id;
        cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
        testFixtures.enrollment.trailUUID = createdTrail.id;
        cy.APITrailBatchEnrollments(testFixtures.enrollment);
        cy.Login('user');
        cy.VerifyUserEnrollmentDetails('mission', internalMission[1].name, util.INACTIVE);
        cy.VerifyUserEnrollmentDetails('mission', internalMission[2].name, util.FINISHED);
        cy.EnrollmentsSearchMission(internalMission[0].name);
        SettingsEnrollmentsElements.tableAllEnrollments().contains(util.ENROLLMENT_NOT_FOUND);
        cy.VerifyUserEnrollmentDetails('trail', createdTrail.name, util.FINISHED);
      });
  });

  it('Should be approve when consume all pulses in the trail', () => {
    const pulseIds = [];
    cy.FixturesChannelPulseContent()
      .then((fixtures) => {
        channelPulseContentFixtures = fixtures;
        return cy.CreateChannelWithPulseFile(fixtures.content['image'], fixtures);
      })
      .then((response) => {
        pulseIds.push(response.body.pulse);
        return cy.CreateChannelWithPulseQuiz(channelPulseContentFixtures);
      })
      .then((pulseCreated) => {
        pulseIds.push(pulseCreated.id);
      });
    cy.wrap(pulseIds).each((id) => {
      cy.APITrailLinkPulse(createdTrail.id, id, 1);
    });
    const payload: InternalMissionOptions = {
      missionUUID: internalMission[0].id,
      development_status: util.DEVELOPMENT_STATUS.DONE,
    };
    cy.APIMissionUpdate(payload);
    testFixtures.enrollment.trailUUID = createdTrail.id;
    cy.APITrailBatchEnrollments(testFixtures.enrollment);
    cy.Login('user');
    cy.EnrollmentsAccessTrailEnrolled(createdTrail);
    cy.TrailPulseAccessAndConsume(1);
    cy.TrailPulseAccessAndConsumeTypeQuiz(2);
    cy.EnrollmentsAccessTrailEnrolled(createdTrail);
    TrailElements.buttonPlayStepTrail().eq(0).scrollIntoView().click();
    cy.ClassroomConsumeMissionWithVideo();
    cy.CloseClassroom();
    cy.PressEsc();
    cy.EnrollmentsAccessTrail();
    cy.EnrollmentsSearchTrail(createdTrail.name);
    cy.EnrollmentsVerifyTrail(createdTrail.name);
    MissionEnrollmentsElements.enrollmentStatus().contains(util.FINISHED);
  });

  it('Should be enrollment give up on trail', () => {
    cy.Login('user');
    cy.TrailAccess();
    cy.TrailSearch(createdTrail.name);
    cy.TrailOpenCard(createdTrail.name);
    cy.TrailEnroll();
    cy.TrailGiveup();
    TrailElements.trailRetake();
    cy.PressEsc();
    cy.EnrollmentsAccessTrail();
    cy.EnrollmentsSearchTrail(createdTrail.name);
    MissionEnrollmentsElements.enrollmentStatus().contains(util.GIVE_UP);
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APITrailDelete(createdTrail.id);
    internalMission.forEach((missionToDelete) => {
      cy.APICourseDelete(missionToDelete.id);
    });
  });
});
