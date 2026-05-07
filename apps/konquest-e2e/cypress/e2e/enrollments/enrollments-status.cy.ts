/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import * as StatusCode from '../../support/constants/status-code';
import ClassroomElements from '../../support/elements/classroom-elements';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import { MissionStageContentOptions } from '../../support/interfaces';
let missionToDelete;
let missionCreated;
let testFixtures;

describe('Internal Missions Enrollment Status', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMissionStageContent().then((fixtures) => {
      testFixtures = fixtures;
      cy.UpdateFixtToRandom(testFixtures)
        .then((response: MissionStageContentOptions) => {
          response.mission.mission_type.id = util.OPEN_TYPE_ID;
          return cy.UpdateFixtToRandom(response);
        })
        .then((fixtures) => {
          cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
        })
        .then((response) => {
          missionCreated = response;
          missionToDelete = response.id;
          testFixtures.enrollment.missionUUID = response.id;
          testFixtures.enrollment.required_mission = false;
          return cy.APIMissionEnrollUser(testFixtures.enrollment);
        });
    });
  });

  it('Should be enrollment enrolled', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    EnrollsMissionsElements.enrollmentStatus().contains(util.ENROLLED).should('be.visible');
  });

  it('Should be enrollment finish', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomConsumeMissionWithVideo();
    ClassroomElements.buttonExitClassroom().click();
    cy.MissionClosePopup();
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    EnrollsMissionsElements.enrollmentStatus().contains(util.FINISHED).should('be.visible');
  });

  it('Should be enrollment finish and after generate certificate', () => {
    cy.intercept('**/certificates').as('certificateRequest');
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomConsumeMissionWithVideo();
    ClassroomElements.buttonExitClassroom().click();
    cy.MissionClosePopup();
    cy.Login('admin');
    cy.APIMissionPublish(missionCreated.id);
    cy.Login('user');
    cy.viewport(1920, 1080);
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
    cy.EnrollmentsGetCertificate()
      .wait('@certificateRequest')
      .then((certificate) => {
        expect(certificate.response.statusCode).eq(StatusCode.OK);
        expect(certificate.response.body.certificate_url).contains('/certificates/');
      });
  });

  it('Should be enrollment inactive', () => {
    cy.MissionEdit(missionCreated.id);
    cy.MissionStepAccess('Configurações');
    cy.MissionStepSettings('Inactive');
    cy.MissionClickButtonInfoNext().then(() => {
      cy.Login('user');
      cy.EnrollmentsAccess();
      cy.EnrollmentsSearchMission(missionCreated.name);
      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      cy.EnrollmentsVerifyStatus(util.INACTIVE);
    });
  });

  it('Should be enrollment reproved', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();
    cy.ClassroomPlayContentVideo(6000);
    ClassroomElements.nextContent().click();
    cy.ClassroomSurveySatisfaction();
    cy.ClassroomFinishCourse();
    ClassroomElements.buttonGetCertificate().click();
    cy.MissionClosePopup();
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    EnrollsMissionsElements.enrollmentStatus().contains(util.REPROVED).should('be.visible');
  });

  it.skip('Should be enrollment give up', () => {
    //TO DO: DEV-28413
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsGiveUp(util.MOTIVE_FOR_GIVE_UP);
    EnrollsMissionsElements.enrollmentStatus().contains(util.GIVE_UP).should('be.visible');
  });

  it('Should be enrollment started', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();
    cy.ClassroomPlayContentVideo();
    cy.CloseClassroom();
    cy.MissionClosePopup();
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.STARTED);
  });
});

describe('External Missions Enrollment Status', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMissionStageContent().then((fixtures) => {
      testFixtures = fixtures;
      testFixtures.mission.mission_type.id = util.OPEN_TYPE_ID;
      testFixtures.mission.mission_model = 'EXTERNAL_PROVIDER';
      testFixtures.mission.name = getRandomName();
      cy.log(testFixtures.mission);
      return cy.APIMissionExternalCreate(testFixtures.mission).then((mission) => {
        missionToDelete = mission.body.id;
        testFixtures.enrollment.missionUUID = mission.body.id;
        cy.APIMissionEnrollUser(testFixtures.enrollment);
      });
    });
  });

  it('Should be enrollment Ag.Aprovação - mission external', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.EnrollmentsFinishMission(util.FILE_PATH_CERTIFICATE);
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.WAITING_APPROVAL);
  });

  it('Should be enrollment refused - mission external', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.EnrollmentsFinishMission(util.FILE_PATH_CERTIFICATE);

    cy.Login('admin');
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.EnrollmentsVerifyStatus(util.WAITING_APPROVAL);
    cy.SettingsEnrollmentsRejectCertificate(testFixtures.enrollment.certificate.reject);

    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.REFUSED);
  });
});

afterEach(() => {
  cy.Login('admin');
  if (missionToDelete) {
    cy.APICourseDelete(missionToDelete);
  }
});
