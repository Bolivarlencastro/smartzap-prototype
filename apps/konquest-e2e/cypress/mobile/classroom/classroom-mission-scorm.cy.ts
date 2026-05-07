/// <reference types="cypress" />
const scormPath = `cypress/fixtures/${Cypress.env('ENVIRONMENT')}/scorm/scorm-file.zip`;
const missionDefaultPath = `${Cypress.env('ENVIRONMENT')}/mission/default`;
const enrollmentDefaultPath = `${Cypress.env('ENVIRONMENT')}/enrollment/default`;
const fileScorm = scormPath;
import ClassroomElements from '../../support/elements/classroom-elements';
import { getRandomName } from '../../support/commands';
import { ScormMissionCreate } from '../../support/interfaces';
let missionToDelete;
let missionCreated;

describe('Classroom tests consume SCORM', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.Login('admin');
    cy.fixture(missionDefaultPath)
      .then((fixture) => {
        const mission: ScormMissionCreate = {
          ...fixture,
          class: 'Missão Scorm',
          name: getRandomName(),
        };
        return mission;
      })
      .then((mission) => cy.MissionScormCreate(fileScorm, mission))
      .then((response: ScormMissionCreate) => {
        missionToDelete = response.id;
        missionCreated = response;
      });
    cy.fixture(enrollmentDefaultPath)
      .then((enrollment) => {
        enrollment.missionUUID = missionCreated.id;
        return enrollment;
      })
      .then((fixtures) => cy.APIMissionEnrollUser(fixtures));
  });
  it('Should consume a mission scorm', () => {
    cy.viewport('iphone-xr');
    cy.Login('user');
    cy.EnrollmentsAccessMobile();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsStartCourseMobile();
    cy.ClassroomStartCourseMobile();
    cy.ClassroomNextContentMobile();

    cy.get('iframe').should('be.visible');
    cy.url().should('contain', '/scorm/');
    cy.intercept('**/users/scorm-activities').as('requestScorm');
    cy.wait('@requestScorm').then((res) => {
      expect(res.response.statusCode).equal(201);
      expect(res.response.statusMessage).equal('Created');
    });
    cy.WaitConsumeContent(30000);
    ClassroomElements.nextContentMobile().click();
    cy.ClassroomSurveySatisfaction();
    cy.ClassroomFinishCourse();
    cy.ClassroomVerifyCertificate();
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
      missionToDelete = {};
    }
  });
});
