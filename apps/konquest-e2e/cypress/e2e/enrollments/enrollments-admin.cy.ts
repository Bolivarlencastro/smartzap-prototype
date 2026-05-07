/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import MissionElements from '../../support/elements/mission-elements';
import { ScormMissionCreate } from '../../support/interfaces';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import * as util from '../../support/constants/utils';
let courseToDelete;
let createdCourse;

describe('Internal course - Required Enrollment', () => {
  beforeEach(() => {
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = getRandomName();
      cy.Login('admin');
      cy.APIMissionCreate(missionDefault).then((response) => {
        createdCourse = response.body;
        courseToDelete = response.body.id;
      });
    });
  });

  it('Admin enrol user in a course', () => {
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = createdCourse.name;
      cy.MissionBathEnroll(missionDefault, 'required');
      cy.Login('user');
      cy.HomeAccess({ filter: util.COURSES });
      cy.MissionEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdCourse.name);

      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      MissionElements.FieldNumberEnrolled().should('have.length', 1, { timeout: 10000 });
      MissionElements.MissionNameListEnrollments().should('contain.text', createdCourse.name);
    });
  });
  it('Admin enroll user in a course by api', () => {
    cy.FixturesEnrollment().then((enrollmentDefault) => {
      enrollmentDefault.missionUUID = createdCourse.id;
      cy.APIMissionEnrollUser(enrollmentDefault);
      cy.Login('user');
      cy.HomeAccess({ filter: util.COURSES });
      cy.MissionEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdCourse.name);

      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      MissionElements.FieldNumberEnrolled().should('have.length', 1, { timeout: 10000 });
      MissionElements.MissionNameListEnrollments().should('contain.text', createdCourse.name);

      cy.EnrollmentsMenuOptionsMission();
      EnrollsMissionsElements.listOptionsInEnrollment().contains(util.VIEW_MISSION).click();
      MissionElements.buttonOpenMissionOnClassroom();
    });
  });
});

describe('Mission Scorm - Required Enrollment', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMission().then((fixture) => {
      const mission: ScormMissionCreate = {
        name: getRandomName(),
        duration_time: fixture.duration_time,
      };
      createdCourse = mission;
    });
  });

  it('Admin enrol user in a mission scorm open', () => {
    cy.Login('admin');
    cy.MissionScormCreate(util.FILE_PATH_SCORM, createdCourse).then((response: ScormMissionCreate) => {
      courseToDelete = response.id;
      cy.ContentManagementPublish(createdCourse.name);
      cy.MissionBathEnroll(createdCourse, 'required');
      cy.Login('user');
      cy.MissionEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdCourse.name);

      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      MissionElements.FieldNumberEnrolled().should('have.length', 1, { timeout: 10000 });
      MissionElements.MissionNameListEnrollments().should('contain.text', createdCourse.name);
    });
  });

  it('Admin enrol user in a mission scorm closed', () => {
    createdCourse.mission_type.name = 'Fechado';
    cy.MissionScormCreate(util.FILE_PATH_SCORM, createdCourse).then((response: ScormMissionCreate) => {
      courseToDelete = response.id;
      cy.ContentManagementPublish(createdCourse.name);
      cy.Login('user');
      cy.MissionSearchNotFound(createdCourse.name);
      MissionElements.missionPageSelector().contains(util.NOT_EXIST_MISSIONS);
      cy.MissionEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdCourse.name);
      MissionElements.EnrollmentEmptyField().should('contain.text', 'Nenhuma matrícula encontrada.');
      cy.Login('admin');
      cy.MissionWaitLoad();
      cy.MissionClosedVerified(createdCourse);
      MissionElements.ButtonDropdownMission().click();
      cy.MissionBatchEnrrolments();
      cy.MissionFieldInputUserEnrol(Cypress.env('user_cy'));
      cy.MissionFieldInvisibleSelectUser();
      cy.BatchEnrollmentSetting('required');
      cy.MissionConfirmBatchEnrollments();
      cy.PressEsc();

      cy.Login('user');
      cy.MissionEnrollmentsAccess();
      MissionElements.FieldNumberEnrolled().should('exist');
      cy.EnrollmentsSearchMission(createdCourse.name);
      MissionElements.FieldNumberEnrolled().should('have.length', 1, { timeout: 10000 });
      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      MissionElements.MissionNameListEnrollments().should('contain.text', createdCourse.name);
    });
  });
});

afterEach(() => {
  if (courseToDelete) {
    cy.Login('admin');
    cy.APICourseDelete(courseToDelete);
  }
});
