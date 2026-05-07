/// <reference types="cypress" />

import * as util from '../../support/constants/utils';
import { USER_CY_ID } from '../../support/constants/users';
let trailCreated;
let trailToDelete;
let missionToDelete;
let trailEnrollmentID;

describe('Trail enrollments status', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APITrailEnrollmentsDeleteAll();
    cy.APITrailCreateWithInternalMission()
      .then((response) => {
        trailCreated = response[0];
        trailToDelete = trailCreated.id;
        missionToDelete = response[1].id;
        cy.Login('user');
        const data = { trailUUID: trailCreated.id, userUUID: USER_CY_ID };
        cy.APITrailEnroll(data);
      })
      .then((response) => {
        trailEnrollmentID = response.body.id;
      });
  });

  it('As a user, I should see a enroll with status "started"', () => {
    cy.TrailVerifyEnrollStatusMobile(trailCreated.name, util.STARTED);
  });

  it('As a user, I should see a enroll with status "finish"', () => {
    cy.Login('admin');
    const data = { enrollmentID: trailEnrollmentID, performance: '1.00' };
    cy.APITrailEnrollmentManualFinish(data);
    cy.Login('user');
    cy.TrailVerifyEnrollStatusMobile(trailCreated.name, util.FINISHED);
  });

  it('As a user, I should see a enroll with status "reproved"', () => {
    cy.Login('admin');
    const data = { enrollmentID: trailEnrollmentID, performance: '0.10' };
    cy.APITrailEnrollmentManualFinish(data);
    cy.Login('user');
    cy.TrailVerifyEnrollStatusMobile(trailCreated.name, util.REPROVED);
  });

  it('As a user, I should see a enroll with status "given up"', () => {
    const data = { enrollmentID: trailEnrollmentID, give_up_comment: 'Test' };
    cy.APITrailEnrollmentGiveUp(data);
    cy.TrailVerifyEnrollStatusMobile(trailCreated.name, util.GIVE_UP);
  });

  afterEach(() => {
    cy.Login('admin');
    if (trailToDelete) {
      cy.APITrailDelete(trailToDelete);
    }
    if (missionToDelete) {
      cy.APICourseDelete(missionToDelete);
    }
  });
});
