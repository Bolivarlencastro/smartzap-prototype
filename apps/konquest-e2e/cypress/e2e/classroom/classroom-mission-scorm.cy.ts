/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import ClassroomElements from '../../support/elements/classroom-elements';
import { ScormMissionCreate } from '../../support/interfaces';
import * as util from '../../support/constants/utils';
let missionToDelete;
let missionCreated;

describe('Classroom tests consume SCORM', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMission()
      .then((fixture) => {
        const mission: ScormMissionCreate = {
          name: getRandomName(),
          duration_time: fixture.duration_time,
        };
        return mission;
      })
      .then((mission) => cy.MissionScormCreate(util.FILE_PATH_SCORM, mission))
      .then((response: ScormMissionCreate) => {
        missionToDelete = response.id;
        missionCreated = response;
      });
    cy.FixturesEnrollment()
      .then((enrollment) => {
        enrollment.missionUUID = missionCreated.id;
        return enrollment;
      })
      .then((fixtures) => cy.APIMissionEnrollUser(fixtures));
  });
  it('Should consume a mission scorm', () => {
    cy.Login('user');
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();

    cy.get('iframe').should('be.visible');
    cy.url().should('contain', '/scorm/');
    cy.intercept('**/users/scorm-activities').as('requestScorm');
    cy.wait('@requestScorm').then((res) => {
      expect(res.response.statusCode).equal(201);
      expect(res.response.statusMessage).equal('Created');
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(30000); //consume time the content scorm
    ClassroomElements.nextContent().click();
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
