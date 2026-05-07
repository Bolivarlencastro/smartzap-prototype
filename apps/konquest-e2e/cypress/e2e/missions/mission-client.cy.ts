/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import * as users from '../../support/constants/users';
import ContentManagementElements from '../../support/elements/content-management-elements';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import GlobalSearchElements from '../../support/elements/global-search-elements';
import MissionElements from '../../support/elements/mission-elements';
import { InternalMissionOptions } from '../../support/interfaces';
import { FixtureEnrollment } from '../../support/interfaces/enrollment-options';
let createdMission: InternalMissionOptions;

let missionToDelete;

describe('Mission Inactive', () => {
  beforeEach(() => {
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = getRandomName();
      missionDefault.is_active = false;
      cy.Login('admin');
      cy.APIMissionCreate(missionDefault).then((response) => {
        createdMission = response.body;
        missionToDelete = response.body.id;
      });
    });
  });

  it('Should inactivate course as admin user and hide the course for common users', () => {
    cy.MissionEdit(createdMission.id);
    cy.MissionStepAccess('Configurações');
    cy.MissionStepSettings('Inactive');
    cy.MissionClickButtonInfoNext();
    cy.MissionInactivatedVerified(createdMission.name);

    cy.Login('user');
    cy.HomeAccess();
    cy.GlobalSearch(createdMission.name);
    GlobalSearchElements.textContentNotFound();
  });
});

describe('Closed course', () => {
  beforeEach(() => {
    cy.FixturesMission().then((missionDefault) => {
      const closed_type = util.CLOSED_TYPE_ID;
      missionDefault.name = getRandomName();
      missionDefault.mission_type.id = closed_type;
      cy.Login('admin');
      cy.APIMissionCreate(missionDefault).then((response) => {
        createdMission = response.body;
        missionToDelete = response.body.id;
      });
    });
  });

  it('Closed course should not be visible to the client user, only after enrolled', () => {
    cy.FixturesEnrollment().then((enrollmentDefault) => {
      enrollmentDefault.missionUUID = createdMission.id;

      cy.Login('user');
      cy.HomeAccess();
      cy.GlobalSearch(createdMission.name);
      GlobalSearchElements.textContentNotFound();

      cy.Login('admin').then(() => {
        cy.APIMissionBatchEnrollments(enrollmentDefault);
      });

      cy.Login('user').then(() => {
        cy.HomeAccess();
        cy.MissionEnrollmentsAccess();
        cy.EnrollmentsSearchMission(createdMission.name);
        EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
        MissionElements.FieldNumberEnrolled().should('have.length', 1, { timeout: 10000 });
        MissionElements.MissionNameListEnrollments().should('contain.text', createdMission.name);
      });
    });
  });

  it('Super admin should have all actions on course', () => {
    cy.Login('superAdmin');
    cy.ContentManagementAccess();
    cy.ContentManagementSearch(createdMission.name);
    ContentManagementElements.buttonOpenCourseMenu().click();
    util.listActions.forEach((action) => {
      cy.get('.mat-mdc-menu-panel').should('contain.text', action);
    });
  });
});

describe('Internal course - No contents', () => {
  beforeEach(() => {
    cy.FixturesMission()
      .then((fixtures) => ({
        ...fixtures,
        name: getRandomName(),
        mission_type: { id: util.OPEN_TYPE_ID },
      }))
      .then((missionDefault) => {
        cy.Login('admin');
        cy.APIMissionCreate(missionDefault).then((response) => {
          createdMission = response.body;
          missionToDelete = response.body.id;
        });
      });
  });

  it('Should see course enrolled mission on "All courses" list', () => {
    cy.Login('user');
    cy.HomeAccess({ filter: util.COURSES });
    cy.GetMetaDataSelectorAndClick('button-all-contents');
    cy.MissionSearch(createdMission.name);
    cy.MissionOpenCard(createdMission.name);
  });

  it('Should see the created course on "Courses Created by me" list as admin user', () => {
    cy.ContentManagementAccess();
    cy.GetMetaDataSelectorAndClick('button-my-missions');
    cy.ContentManagementSearch(createdMission.name);
    ContentManagementElements.itemNameSelector().should('contain.text', createdMission.name);
  });
});

describe('Internal course - re-enroll permission disabled', () => {
  let enrollmentDefault: FixtureEnrollment;
  beforeEach(() => {
    cy.FixturesMission()
      .then((fixtures) => ({
        ...fixtures,
        name: getRandomName(),
        mission_type: { id: util.OPEN_TYPE_ID },
        allow_self_enrollment_renewal: false,
        allow_self_reproved_enrollment_renewal: false,
      }))
      .then((missionDefault) => {
        cy.Login('admin');
        cy.APIMissionCreate(missionDefault).then((response) => {
          createdMission = response.body;
          missionToDelete = response.body.id;
        });
      });
    cy.FixturesEnrollment()
      .then((fixtures) => ({
        ...fixtures,
        user: users.USER_CY_ID,
        mission: createdMission.id,
      }))
      .then((fixtures) => (enrollmentDefault = fixtures));
  });

  it('Should see course on "All courses" section list', () => {
    cy.Login('user');
    cy.HomeAccess({ filter: util.COURSES });
    cy.GetMetaDataSelectorAndClick('button-all-contents');
    cy.MissionSearch(createdMission.name);
    cy.MissionOpenCard(createdMission.name);
  });

  it('Should not have access to re-enroll in the mission when re-enroll are disabled', () => {
    cy.APIMissionEnrollUser(enrollmentDefault).then((response) => {
      enrollmentDefault.id = response.body.id;
      cy.APIMissionEnrollmentManualFinish(enrollmentDefault);
    });
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(createdMission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    EnrollsMissionsElements.optionsMenu().click({ force: true });
    EnrollsMissionsElements.listOptionsInEnrollment().contains(util.VIEW_MISSION).click({ force: true });
    MissionElements.buttonOpenMissionOnClassroom();
  });

  it('Should not have access to re-enroll in the mission when re-enroll for reproved are disabled', () => {
    enrollmentDefault.performance = '0.3';
    cy.APIMissionEnrollUser(enrollmentDefault).then((response) => {
      enrollmentDefault.id = response.body.id;
      cy.APIMissionEnrollmentManualFinish(enrollmentDefault);
    });
    cy.Login('user');
    cy.EnrollmentsAccess();
    cy.viewport(1920, 1080);
    cy.EnrollmentsSearchMission(createdMission.name);
    EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
    EnrollsMissionsElements.optionsMenu().click({ force: true });
    EnrollsMissionsElements.listOptionsInEnrollment().should('not.contain.text', util.RE_ENROLL);
  });
});

afterEach(() => {
  if (missionToDelete) {
    cy.Login('admin');
    cy.APICourseDelete(missionToDelete);
    missionToDelete = false;
  }
});
