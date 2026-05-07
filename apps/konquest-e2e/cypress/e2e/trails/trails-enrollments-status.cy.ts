import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import { USER_CY_ID } from '../../support/constants/users';
import SettingsEnrollmentsElements from '../../support/elements/settings-enrollments-elements';

let trailToDelete;
let trailCreated;
let enrollmentID;

describe('Trail Enrollments status', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APITrailEnrollmentsDeleteAll();
    cy.APIEnrollmentsDeleteAll();
    cy.viewport(1920, 1080);
    cy.FixturesTrail()
      .then((trailDefault) => {
        trailDefault.name = getRandomName();
        return cy.APITrailCreateWithInternalMission();
      })
      .then((response) => {
        trailCreated = response[0];
        trailToDelete = trailCreated.id;
        const dataEnroll = { trailUUID: trailCreated.id, userUUID: USER_CY_ID };
        cy.APITrailEnroll(dataEnroll).then((response) => {
          enrollmentID = response.body.id;
        });
      });
  });

  it('As an admin, I should be able to re-enroll the user in a reproved trail', () => {
    const dataManualFinish = { enrollmentID: enrollmentID, performance: '0.10' };
    cy.APITrailEnrollmentManualFinish(dataManualFinish);
    cy.SettingsTrailEnrollmentsAccess();
    cy.EnrollmentsSearchTrail(trailCreated.name);
    SettingsEnrollmentsElements.trailRow().should('have.length', 1).contains(trailCreated.name);
    SettingsEnrollmentsElements.enrollmentStatusSelector().contains(util.REPROVED);
    cy.SettingsTrailEnrollmentsReenroll();
    cy.reload();
    cy.EnrollmentsSearchTrail(trailCreated.name);
    SettingsEnrollmentsElements.trailRow().should('have.length', 2).contains(trailCreated.name);
    SettingsEnrollmentsElements.enrollmentStatusSelector().contains(util.STARTED);
    SettingsEnrollmentsElements.enrollmentStatusSelector().contains(util.REPROVED);
  });

  it('As an admin, I should be able to approve the user enrollment in a trail', () => {
    const dataManualFinish = { enrollmentID: enrollmentID, performance: '1.0' };
    cy.SettingsTrailEnrollmentsAccess();
    cy.EnrollmentsSearchTrail(trailCreated.name);
    SettingsEnrollmentsElements.trailRow().should('have.length', 1).contains(trailCreated.name);
    SettingsEnrollmentsElements.enrollmentStatusSelector().contains(util.STARTED);
    cy.APITrailEnrollmentManualFinish(dataManualFinish);
    cy.reload();
    cy.EnrollmentsSearchTrail(trailCreated.name);
    SettingsEnrollmentsElements.trailRow().should('have.length', 1).contains(trailCreated.name);
    SettingsEnrollmentsElements.enrollmentStatusSelector().contains(util.FINISHED);
  });

  it('As an admin, I should be able to reproved the user enrollment in a trail', () => {
    cy.SettingsTrailEnrollmentsAccess();
    cy.EnrollmentsSearchTrail(trailCreated.name);
    SettingsEnrollmentsElements.trailRow().should('have.length', 1).contains(trailCreated.name);
    SettingsEnrollmentsElements.enrollmentStatusSelector().contains(util.STARTED);
    cy.SettingsTrailsEnrollmentsReprove();
    cy.reload();
    cy.EnrollmentsSearchTrail(trailCreated.name);
    SettingsEnrollmentsElements.trailRow().should('have.length', 1).contains(trailCreated.name);
    SettingsEnrollmentsElements.enrollmentStatusSelector().contains(util.REPROVED);
  });

  afterEach(() => {
    if (trailToDelete) {
      cy.Login('admin');
      cy.APITrailDelete(trailToDelete);
    }
  });
});
