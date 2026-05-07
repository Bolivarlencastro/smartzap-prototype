/// <reference types="cypress" />

import { getDateInFiveDays, getDateTomorrowBR, getRandomName } from '../../support/commands';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import MissionElements from '../../support/elements/mission-elements';
import * as util from '../../support/constants/utils';
import { InternalMissionOptions } from '../../support/interfaces';

let goalDateDuration;
let missionToDelete;
let createdMission: InternalMissionOptions;

describe('Internal mission - Free enrollment', () => {
  beforeEach(() => {
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = getRandomName();
      missionDefault.mission_type.id = util.OPEN_TYPE_ID;
      cy.Login('admin');
      cy.APIMissionCreate(missionDefault).then((response) => {
        createdMission = response.body;
        missionToDelete = response.body.id;
      });
    });
  });

  it('User enrols in a mission', () => {
    cy.Login('user');
    cy.MissionEnroll(createdMission.name);
    cy.CloseClassroom();
    cy.MissionClosePopup();
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(createdMission.name);

    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
    MissionElements.FieldNumberEnrolled().should('contain.text', 1, { timeout: 10000 });
    MissionElements.MissionNameListEnrollments().should('contain.text', createdMission.name);

    cy.EnrollmentsMenuOptionsMission();
    EnrollsMissionsElements.listOptionsInEnrollment().contains(util.TO_GIVE_UP);
    EnrollsMissionsElements.listOptionsInEnrollment().contains(util.VIEW_MISSION).click();
  });

  it('User enrollment should have the same workspace goal date', () => {
    goalDateDuration = 5;
    const goalDate = getDateInFiveDays();
    cy.APIWorkspaceSettings({ enrollment_goal_duration_days: goalDateDuration });
    cy.Login('user');
    cy.MissionEnroll(createdMission.name);
    cy.CloseClassroom();
    cy.MissionClosePopup();
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(createdMission.name);

    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
    EnrollsMissionsElements.fieldOnListEnrollments().contains(goalDate).should('be.visible');
  });
});

describe('Scorm Mission', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = getRandomName();
      missionDefault.mission_model = 'SCORM';
      missionDefault.mission_type.id = util.OPEN_TYPE_ID;
      cy.APIMissionCreate(missionDefault).then((response) => {
        createdMission = response.body;
        missionToDelete = response.body.id;
      });
    });
  });

  it('User enrols in a mission scorm', () => {
    cy.Login('user');
    cy.MissionEnroll(createdMission.name);
    cy.CloseClassroom();
    cy.MissionClosePopup();
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(createdMission.name);

    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
    MissionElements.FieldNumberEnrolled().should('have.length', 1, { timeout: 10000 });
  });
});

describe('Mission with custom goal date ', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = getRandomName();
      missionDefault.mission_type.id = util.OPEN_TYPE_ID;
      missionDefault.enrollment_goal_duration_days = '1';
      cy.APIMissionCreate(missionDefault).then((response) => {
        createdMission = response.body;
        missionToDelete = response.body.id;
      });
    });
  });
  it('Should enroll on mission with custom goal date', () => {
    const tomorrowDate = getDateTomorrowBR();
    cy.Login('user');
    cy.MissionEnroll(createdMission.name);
    cy.CloseClassroom();
    cy.MissionClosePopup();
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(createdMission.name);

    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
    EnrollsMissionsElements.fieldOnListEnrollments().contains(tomorrowDate).should('be.visible');
  });
});
afterEach(() => {
  if (missionToDelete) {
    cy.Login('admin');
    cy.APICourseDelete(missionToDelete);
  }
  if (goalDateDuration) {
    cy.APIWorkspaceSettings({ enrollment_goal_duration_days: 30 });
    goalDateDuration = null;
  }
});
