import { Interception } from 'cypress/types/net-stubbing';

const baseUrlTrailEnrollments = `${Cypress.env('url_api')}/learning-trail-enrollments`;
import { getDateTomorrow } from '../commands';
import { CypressResponse } from '../interfaces';

Cypress.Commands.add('APITrailEnrollmentDelete', (UUID) => {
  return cy.keepsApi(`${baseUrlTrailEnrollments}/${UUID}`, {}, 'DELETE');
});

Cypress.Commands.add('APITrailEnrollmentsGetAll', () => {
  return cy.keepsApi(baseUrlTrailEnrollments, {}, 'GET');
});

Cypress.Commands.add('APITrailEnrollmentsDeleteAll', () => {
  cy.APITrailEnrollmentsGetAll().then((request: any) => {
    const listResults = request.body.results ? request.body.results : [];
    listResults.forEach((result) => {
      cy.APITrailEnrollmentDelete(result.id);
    });
  });
});

Cypress.Commands.add('APITrailBatchEnrollments', (data) => {
  return cy.keepsApi(
    `${baseUrlTrailEnrollments}/batch/v2`,
    {
      learning_trails: [data.trailUUID],
      goal_date: getDateTomorrow(),
      users: [data.userUUID],
    },
    'POST',
  );
});

Cypress.Commands.add('APITrailEnrollmentManualFinish', (data) => {
  cy.keepsApi(
    `${baseUrlTrailEnrollments}/${data.enrollmentID}/manual-finish`,
    {
      performance: data.performance,
    },
    'POST',
  );
});

Cypress.Commands.add('APITrailEnrollmentGiveUp', (data) => {
  cy.keepsApi(
    `${baseUrlTrailEnrollments}/${data.enrollmentID}/give-up`,
    {
      give_up_comment: data.give_up_comment,
    },
    'POST',
  );
});

Cypress.Commands.add('APITrailEnroll', (data) => {
  cy.keepsApi(
    baseUrlTrailEnrollments,
    {
      goal_date: getDateTomorrow(),
      user: data.userUUID,
      learning_trail: data.trailUUID,
    },
    'POST',
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      APITrailEnrollmentDelete(UUID: string): Chainable<Interception>;
      APITrailEnrollmentsGetAll(): Chainable<Interception>;
      APITrailEnrollmentsDeleteAll(): Chainable<Interception>;
      APITrailBatchEnrollments(data): Chainable<Interception>;
      APITrailEnrollmentManualFinish(data): Chainable<Interception>;
      APITrailEnrollmentGiveUp(data): Chainable<Interception>;
      APITrailEnroll(data): Chainable<CypressResponse>;
    }
  }
}
