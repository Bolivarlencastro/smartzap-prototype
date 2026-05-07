import { CypressResponse } from '../interfaces';
import { EnrollmentOptions } from '../interfaces/enrollment-options';

const baseUrlCourse = `${Cypress.env('url_api')}/enrollment`;

Cypress.Commands.add('APIEnrollmentDelete', (enrollmentId) => {
  cy.keepsApi(`${baseUrlCourse}/${enrollmentId}`, {}, 'DELETE');
});

Cypress.Commands.add('APIEnrollmentComplete', (enrollmentId) => {
  cy.keepsApi(`${baseUrlCourse}/${enrollmentId}`, { status: 'COMPLETED' }, 'PATCH');
});

Cypress.Commands.add('APIEnrollmentGetAll', () => {
  cy.keepsApi(`${baseUrlCourse}`, {}, 'GET');
});

Cypress.Commands.add('APIEnrollmentUser', (data) => {
  cy.keepsApi(
    `${baseUrlCourse}/user`,
    {
      course_id: data.course_id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      tags: data.tag,
      timezone: data.timezone,
    },
    'POST',
  );
});

Cypress.Commands.add('APIEnrollmentDeleteAll', () => {
  cy.APIEnrollmentGetAll().then((response) => {
    const enrollments = response.body.result;
    if (enrollments.length > 0) {
      enrollments.forEach((enrollment) => {
        if (enrollment.id) cy.APIEnrollmentDelete(enrollment.id);
      });
    }
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      APIEnrollmentDelete(enrollmentId: string): Chainable<CypressResponse>;
      APIEnrollmentGetAll(): Chainable<CypressResponse>;
      APIEnrollmentDeleteAll(): Chainable<CypressResponse>;
      APIEnrollmentUser(data: EnrollmentOptions): Chainable<CypressResponse>;
      APIEnrollmentComplete(enrollmentId: string): Chainable<CypressResponse>;
    }
  }
}
