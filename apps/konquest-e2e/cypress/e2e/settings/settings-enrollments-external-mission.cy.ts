/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';

let testFixtures;

describe('Manage required enrollments', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APITrailEnrollmentsDeleteAll();
    cy.APIEnrollmentsDeleteAll();
    cy.FixturesMissionStageContent()
      .then((fixtures) => {
        testFixtures = fixtures;
        testFixtures.mission.mission_type.id = util.OPEN_TYPE_ID;
        testFixtures.mission.mission_model = 'EXTERNAL_PROVIDER';
        testFixtures.mission.name = getRandomName();
        return cy.APIMissionExternalCreate(testFixtures.mission);
      })
      .then((mission) => {
        testFixtures.enrollment.missionUUID = mission.body.id;
        testFixtures.mission.missionUUID = mission.body.id;
        cy.APIMissionEnrollUser(testFixtures.enrollment).then((response) => {
          testFixtures.enrollment.id = response.body.id;
        });
      });
  });
  it('Should view activities with admin user - FINISHED', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.APIExternalMissionEvaluateCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsViewActivities();
    cy.SettingsEnrollmentsVerifyActivitiesEmpty();
  });

  it('Should delete enrollment with admin user - FINISHED', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.APIExternalMissionEvaluateCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });

  it('Should restart enrollment with admin user - FINISHED', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.APIExternalMissionEvaluateCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.SettingsEnrollmentsRestart();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
    cy.EnrollmentsVerifyStatus(util.STARTED);
  });

  it('Should re-enroll with admin user - FINISHED', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.APIExternalMissionEvaluateCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.SettingsEnrollmentsReenroll();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.STARTED);
  });

  it('Should see all enrollments with admin user - FINISHED', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.APIExternalMissionEvaluateCertificate(testFixtures.enrollment);
    cy.APIExternalMissionReenroll(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsAll();
    cy.SettingsEnrollmentsAllVerify();
  });

  it('Should approve enrollment with admin user - REFUSED', () => {
    testFixtures.enrollment.approve.approved = false;
    testFixtures.enrollment.performance = null;
    testFixtures.enrollment.approve.reject_comment = 'refused certificate';
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.APIExternalMissionEvaluateCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.SettingsEnrollmentsApproveCertificate();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
  });

  it('Should delete enrollment with admin user - REFUSED', () => {
    testFixtures.enrollment.approve.approved = false;
    testFixtures.enrollment.performance = null;
    testFixtures.enrollment.approve.reject_comment = 'refused certificate';
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.APIExternalMissionEvaluateCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });

  it('Should approve enrollment with admin user - INACTIVE', () => {
    testFixtures.mission.is_active = false;
    cy.APIMissionExternalUpdate(testFixtures.mission);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.SettingsEnrollmentsApprove(util.MAX_PERFORMANCE);
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
  });

  it('Should delete enrollment with admin user - INACTIVE', () => {
    testFixtures.mission.is_active = false;
    cy.APIMissionExternalUpdate(testFixtures.mission);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });

  it('Should approve certificate with admin user - WAITING APPROVAL', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.SettingsEnrollmentsApproveCertificate();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
  });

  it('Should reject certificate with admin user - WAITING APPROVAL', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.SettingsEnrollmentsRejectCertificate(testFixtures.enrollment.certificate.reject);
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.REFUSED);
  });

  it('Should view historic enrollment with admin user - WAITING APPROVAL', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsHistoric();
  });

  it('Should delete enrollment with admin user - WAITING APPROVAL', () => {
    cy.APIExternalMissionSendCertificate(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });

  it('Should delete enrollment with user admin - STARTED', () => {
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });
  it('Should view enrollment activities with user admin - STARTED', () => {
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsViewActivities();
    cy.SettingsEnrollmentsVerifyActivitiesEmpty('-');
  });

  it('Should approve certificate with admin user - STARTED', () => {
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.SettingsEnrollmentsApprove(util.MAX_PERFORMANCE);
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
  });
});

describe('Manage free enrollments', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMissionStageContent().then((fixtures) => {
      testFixtures = fixtures;
      testFixtures.mission.mission_type.id = util.OPEN_TYPE_ID;
      testFixtures.mission.mission_model = 'EXTERNAL_PROVIDER';
      testFixtures.mission.name = getRandomName();
      return cy.APIMissionExternalCreate(testFixtures.mission);
    });
  });

  it('Should retake enrollment with admin user - GIVE UP', () => {
    cy.Login('user');
    cy.MissionEnroll(testFixtures.mission.name);
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.EnrollmentsGiveUp(util.MOTIVE_FOR_GIVE_UP);
    cy.EnrollmentsVerifyStatus(util.GIVE_UP);

    cy.Login('admin');
    cy.HomeAccess();
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
    cy.SettingsEnrollmentsRetake();
  });
});

afterEach(() => {
  cy.APIEnrollmentsDeleteAll();
});
