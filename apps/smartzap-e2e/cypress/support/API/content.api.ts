import { CypressResponse } from '../interfaces';
import { ContentOptions, LearnContentPayload, LessonPayload } from '../interfaces/content-options';

const baseUrlContent = 'https://learning-platform-api-stage.keepsdev.com/smartzap/api/v1/content';
const baseUrlKontent = `${Cypress.env('url_api_kontent')}/learn-content`;

Cypress.Commands.add('APIContentCreate', (payload) => {
  cy.keepsApi(`${baseUrlContent}`, payload, 'POST');
});

Cypress.Commands.add('APICreateContentFileAllSteps', (lesson_payload, learn_content_payload) => {
  let lesson_id;
  let learn_content_id;
  cy.APICourseLessonCreate(lesson_payload)
    .then((response) => {
      lesson_id = response.body.id;
    })
    .then(() => {
      console.log(learn_content_payload);
      return cy.APICreateLearnContentFile(learn_content_payload);
    })
    .then((response) => {
      learn_content_id = response.body.id;
    })
    .then(() => {
      return cy.FixturesContent();
    })
    .then((fixtureContent) => {
      fixtureContent.content.lesson_id = lesson_id;
      fixtureContent.content.learn_content = learn_content_id;
      return fixtureContent;
    })
    .then((content_payload) => {
      return cy.APIContentCreate(content_payload.content);
    });
});

Cypress.Commands.add('APICreateLearnContentFile', (data) => {
  const { path, name, fileName } = data;
  return cy
    .readFile(path, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then((blob) => buildFormData(blob, name, fileName))
    .then(createFileLearnContent);
});

const buildFormData = (file, name, fileName) => {
  const formdata = new FormData();
  formdata.append('file', file, fileName);
  formdata.append('name', name);
  return formdata;
};

const createFileLearnContent = (body) => {
  return cy.keepsApi(baseUrlKontent, body, 'POST', { 'content-type': 'multipart/form-data' }).then(parseResponseToJson);
};

const parseResponseToJson = (response) => {
  const status = response.status;
  const bodyString = Cypress.Blob.arrayBufferToBinaryString(response.body);
  const body = JSON.parse(bodyString);
  return { status, body };
};

Cypress.Commands.add('APIContentDelete', (contentId) => {
  cy.keepsApi(`${Cypress.env('url_api')}/content/${contentId}`, {}, 'DELETE');
});

Cypress.Commands.add('APILessonDelete', (lessonId) => {
  cy.keepsApi(`${Cypress.env('url_api')}/lesson/${lessonId}`, {}, 'DELETE');
});

Cypress.Commands.add('APILessonWithContentCreate', (courseId) => {
  let lessonId: string;

  return cy.FixturesContent().then((fixtures) => {
    const lessonPayload: LessonPayload = {
      course_id: courseId,
      name: fixtures.lesson.name,
      order: 2,
    };

    return cy
      .APICourseLessonCreate(lessonPayload)
      .then((lessonResponse) => {
        lessonId = lessonResponse.body.id;
        return cy.APICreateLearnContentFile(fixtures.learnContent);
      })
      .then((learnContentResponse) => {
        const contentPayload: ContentOptions = {
          ...fixtures.content,
          lesson_id: lessonId,
          learn_content: learnContentResponse.body.id,
        };
        return cy.APIContentCreate(contentPayload);
      })
      .then((contentResponse) => {
        return cy.wrap({ lessonId, contentId: contentResponse.body.id });
      });
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      APICreateLearnContentFile(payload: { path: any; name: string; fileName: string }): Chainable<CypressResponse>;
      APIContentCreate(payload: ContentOptions): Chainable<CypressResponse>;
      APICreateContentFileAllSteps(
        lesson_payload: LessonPayload,
        learn_content_payload: LearnContentPayload,
      ): Chainable<CypressResponse>;
      APIContentDelete(contentId: string): Chainable<CypressResponse>;
      APILessonDelete(lessonId: string): Chainable<CypressResponse>;
      APILessonWithContentCreate(courseId: string): Chainable<{ lessonId: string; contentId: string }>;
    }
  }
}
