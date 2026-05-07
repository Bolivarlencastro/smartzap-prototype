import { CypressResponse, CourseOptions } from '../interfaces';

const baseUrlCourse = `${Cypress.env('url_api')}/course`;

Cypress.Commands.add('APICourseCreate', (payload) => {
  cy.keepsApi(
    baseUrlCourse,
    {
      name: payload.name,
      description: payload.description,
      category_id: payload.category_id,
      lang: payload.lang,
      is_active: payload.is_active,
      status: payload.status,
      quiz_performance_weight: payload.quiz_performance_weight,
      content_performance_weight: payload.content_performance_weight,
      allow_content_anticipation: payload.allow_content_anticipation,
      allow_drop_out: payload.allow_drop_out,
      disable_send_certificate: payload.disable_send_certificate,
    },
    'POST',
  );
});

Cypress.Commands.add('APICourseUpdate', (payload) => {
  cy.keepsApi(
    `${baseUrlCourse}/${payload.id}`,
    {
      status: payload.status,
    },
    'PATCH',
  );
});

Cypress.Commands.add('APICourseDelete', (id) => {
  cy.keepsApi(`${baseUrlCourse}/${id}`, {}, 'DELETE');
});

Cypress.Commands.add('APICourseLessonCreate', (payload) => {
  cy.keepsApi(
    `${Cypress.env('url_api')}/lesson`,
    {
      course_id: payload.course_id,
      name: payload.name,
      order: payload.order,
    },
    'POST',
  );
});

Cypress.Commands.add('APICoursePublish', (couseID) => {
  cy.keepsApi(`${Cypress.env('url_api')}/course/${couseID}/publish`, {}, 'POST');
});

declare global {
  namespace Cypress {
    interface Chainable {
      APICourseCreate(payload: CourseOptions): Chainable<CypressResponse>;
      APICourseUpdate(payload: CourseOptions): Chainable<CypressResponse>;
      APICourseDelete(id: string): Chainable<CypressResponse>;
      APICourseLessonCreate(payload: { course_id: string; name: string; order: number }): Chainable<CypressResponse>;
      APICoursePublish(courseID: string): Chainable<CypressResponse>;
    }
  }
}
