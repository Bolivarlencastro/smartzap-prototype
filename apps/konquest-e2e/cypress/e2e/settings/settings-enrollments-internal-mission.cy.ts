/// <reference types="cypress" />
let missionName;
let testFixtures;

import * as util from '../../support/constants/utils';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import SettingsEnrollmentsElements from '../../support/elements/settings-enrollments-elements';
import { MissionStageContentOptions } from '../../support/interfaces';

describe('Settings internal missions', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APITrailEnrollmentsDeleteAll();
    cy.APIEnrollmentsDeleteAll();
    cy.FixturesMissionStageContent()
      .then((response: MissionStageContentOptions) => {
        testFixtures = response;
        response.mission.mission_type.id = util.OPEN_TYPE_ID;
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((missionCreated) => {
        missionName = missionCreated.name;
        testFixtures.enrollment.missionUUID = missionCreated.id;
        testFixtures.mission.missionUUID = missionCreated.id;
        cy.APIMissionEnrollUser(testFixtures.enrollment);
      })
      .then((response) => (testFixtures.enrollment.id = response.body.id));
  });
  it('Should be delete enrollment with admin user - ENROLLED', () => {
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });
  it('Should be approve enrollment with admin user - ENROLLED', () => {
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsApprove(util.MAX_PERFORMANCE);
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
  });

  it('Should be view activities enrollment with admin user - FINISHED', () => {
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsViewActivities();
    SettingsEnrollmentsElements.tableViewActivities().should('have.length', 1);
  });

  it('Should be re-enroll with admin user - FINISHED', () => {
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsReenroll();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.ENROLLED);
  });

  it('Should be restart with admin user - FINISHED', () => {
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsRestart();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
    cy.EnrollmentsVerifyStatus(util.STARTED);
  });

  it('Should be delete enrollment with admin user - FINISHED', () => {
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });

  it('Should be approve enrollment with admin user - INACTIVE', () => {
    testFixtures.mission.is_active = false;
    cy.APIMissionUpdate(testFixtures.mission);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsApprove(util.MAX_PERFORMANCE);
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
  });

  it('Should be delete enrollment with admin user - INACTIVE', () => {
    testFixtures.mission.is_active = false;
    cy.APIMissionUpdate(testFixtures.mission);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });

  it('Should be re-enroll enrollment with admin user - REPROVED', () => {
    testFixtures.enrollment.performance = '0.01';
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsReenroll();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.ENROLLED);
  });

  it('Should be approve enrollment with admin user - REPROVED', () => {
    testFixtures.enrollment.performance = '0.01';
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsChangePerformance(util.MAX_PERFORMANCE);
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
  });

  it('Should be restart enrollment with admin user - REPROVED', () => {
    testFixtures.enrollment.performance = '0.01';
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsRestart();
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
    EnrollsMissionsElements.enrollmentStatus().contains(util.STARTED).should('be.visible');
    cy.EnrollmentsContinueMission();
  });

  it('Should be delete enrollment with admin user - REPROVED', () => {
    testFixtures.enrollment.performance = '0.01';
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsDelete();
    cy.SettingsEnrollmentsNotFound(util.ENROLLMENT_NOT_FOUND);
  });

  it('Should be view activities enrollment with admin user - REPROVED', () => {
    testFixtures.enrollment.performance = '0.01';
    cy.APIMissionEnrollmentManualFinish(testFixtures.enrollment);
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsViewActivities();
    SettingsEnrollmentsElements.tableViewActivities().should('have.length', 1);
  });
});

describe('Enrollments with status started', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APIEnrollmentsDeleteAll();
    cy.FixturesMissionStageContent()
      .then((response: MissionStageContentOptions) => {
        testFixtures = response;
        response.mission.mission_type.id = util.OPEN_TYPE_ID;
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((missionCreated) => {
        missionName = missionCreated.name;
        testFixtures.enrollment.missionUUID = missionCreated.id;
        cy.APIMissionEnrollUser(testFixtures.enrollment);
      });
  });
  it('Should delete enrollment with user admin - STARTED', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();
    cy.ClassroomPlayContentVideo();

    cy.Login('admin');
    cy.HomeAccess();
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsDelete();

    SettingsEnrollmentsElements.fieldEmptyEnrollment().contains(util.ENROLLMENT_NOT_FOUND).should('be.visible');
  });

  it('Should view enrollment activities with user admin - STARTED', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();
    cy.ClassroomPlayContentVideo();

    cy.Login('admin');
    cy.HomeAccess();
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.SettingsEnrollmentsViewActivities();
  });

  it('Should approve enrollment with user admin - STARTED', () => {
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();
    cy.ClassroomPlayContentVideo();

    cy.Login('admin');
    cy.HomeAccess();
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsApprove(util.MAX_PERFORMANCE);

    cy.EnrollmentsSearchMission(missionName);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    cy.EnrollmentsVerifyStatus(util.FINISHED);
  });
});

describe('Free enrollments', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APIEnrollmentsDeleteAll();
    cy.FixturesMissionStageContent()
      .then((response: MissionStageContentOptions) => {
        testFixtures = response;
        response.mission.mission_type.id = util.OPEN_TYPE_ID;
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((missionCreated) => {
        missionName = missionCreated.name;
        testFixtures.enrollment.missionUUID = missionCreated.id;
      });
  });
  it('Should retake enrollment with user admin - GIVE UP', () => {
    cy.Login('user');
    cy.MissionEnroll(missionName);
    cy.CloseClassroom();
    cy.MissionClosePopup();
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.EnrollmentsGiveUp(util.MOTIVE_FOR_GIVE_UP);
    cy.EnrollmentsVerifyStatus(util.GIVE_UP);

    cy.Login('admin');
    cy.HomeAccess();
    cy.SettingsEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionName);
    cy.SettingsEnrollmentsRetake();

    cy.EnrollmentsSearchMission(missionName);
    cy.EnrollmentsVerifyStatus(util.ENROLLED);
  });
});

afterEach(() => {
  cy.APIEnrollmentsDeleteAll();
});
