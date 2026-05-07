/// <reference types="cypress" />

import { CourseFields } from '../interfaces';
import { CourseOptions } from '../interfaces';
import * as StatusCode from '../../support/constants/status-code';
import { CONTENT_SELECTORS_AND_FILES, CONTENT_SELECTORS_AND_LINKS } from '../../support/constants/contents-selectors';
import CourseElements from '../elements/course-elements';
import { getRandomName } from '../commands';

Cypress.Commands.add('CourseListFieldsValidate', (course) => {
  CourseElements.courseNameList().contains(course.name).should('be.visible');
  CourseElements.courseCategory().contains(course.category).should('be.visible');
  CourseElements.courseDurationList().contains(course.duration).should('be.visible');
  CourseElements.courseSubscribersList().contains(course.subscribers).should('be.visible');
  CourseElements.usersCompletedList().contains(course.usersCompleted).should('be.visible');
  CourseElements.courseStatusList().contains(course.courseStatus).should('be.visible');
});

Cypress.Commands.add('CourseDetailFieldsValidate', (course) => {
  CourseElements.courseNameDetails().contains(course.name).should('be.visible');
  CourseElements.courseDetailDuration().contains(course.duration).should('be.visible');
  CourseElements.courseSubscribersDetails().contains(course.subscribers).should('be.visible');
  CourseElements.usersCompletedDetails().contains(course.usersCompleted).should('be.visible');
  CourseElements.courseStatusDetails().contains(course.courseStatus).should('be.visible');
  CourseElements.courseDescriptionDetails().contains(course.description).should('be.visible');
});

Cypress.Commands.add('CourseCreate', (fixtures) => {
  cy.intercept('**/course').as('courseCreate');
  CourseElements.newCourseButton().click();
  CourseElements.courseNameField().type(fixtures.name);
  CourseElements.courseCategoryField().click();
  CourseElements.courseCategoryOption(fixtures.category).click();
  CourseElements.courseLanguageField().click();
  CourseElements.courseLanguageOption(fixtures.lang).click();
  CourseElements.courseDescriptionField().type(fixtures.description);
  CourseElements.saveCourseInformationButton().click();
  cy.wait('@courseCreate').then((response) => {
    expect(response.response.statusCode).eq(StatusCode.Created);
    return response.response.body;
  });
});

Cypress.Commands.add('CourseAccess', () => {
  cy.intercept('**/course**').as('loadCourses');
  cy.intercept('**/course-category**').as('loadCategories');
  CourseElements.courseTabButton().click();
  cy.wait('@loadCourses').its('response.statusCode').should('eq', StatusCode.OK);
  return cy.wait('@loadCategories').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('CourseSearch', (courseName) => {
  cy.intercept(`**/course?**name__ilike=${courseName}`).as('courseSearch');
  cy.viewport(1920, 1080);
  CourseElements.courseSearch().type(courseName, { delay: 500 });
  return cy.wait('@courseSearch').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('CourseEdit', (fixtures) => {
  cy.intercept('PATCH', '**/course/**').as('courseEdit');
  CourseElements.openCourseButton().click();
  CourseElements.editCourseButton().click();
  CourseElements.confirmButton().click();
  CourseElements.courseNameField().clear().type(fixtures.name);
  CourseElements.courseCategoryField().click();
  CourseElements.courseCategoryOption(fixtures.category).click();
  CourseElements.courseLanguageField().click();
  CourseElements.courseLanguageOption(fixtures.lang).click();
  CourseElements.courseDescriptionField().clear().type(fixtures.description);
  CourseElements.saveCourseInformationButton().click();
  return cy.wait('@courseEdit').its('response.statusCode').should('eq', StatusCode.NoContent);
});

Cypress.Commands.add('CourseDelete', () => {
  cy.intercept('DELETE', '**/course/**').as('courseDelete');
  CourseElements.openCourseButton().click();
  CourseElements.courseMenuButton().click();
  CourseElements.courseMenuOptionDelete().click();
  CourseElements.confirmButton().click();
  return cy.wait('@courseDelete').its('response.statusCode').should('eq', StatusCode.NoContent);
});

Cypress.Commands.add('CourseCreateWithContentFile', () => {
  let createdCourse: CourseOptions;
  cy.FixturesCourse()
    .then((course) => course)
    .then((response) => {
      return cy.APICourseCreate(response);
    })
    .then((response) => {
      createdCourse = response.body;
    })
    .then(() => {
      return cy.FixturesContent();
    })
    .then((contentFixture) => {
      contentFixture.lesson.course_id = createdCourse.id;
      cy.APICreateContentFileAllSteps(contentFixture.lesson, contentFixture.learnContent);
    })
    .then(() => {
      cy.APICoursePublish(createdCourse.id);
    });
  cy.wrap(createdCourse);
});

Cypress.Commands.add('CourseAddAllContentsTypeFile', () => {
  cy.intercept('**/lesson').as('lessonCreate');
  cy.intercept('**/learn-content').as('contentCreate');
  CourseElements.inputLessonName().type(getRandomName());
  CourseElements.buttonNewLesson().click().wait('@lessonCreate');

  CONTENT_SELECTORS_AND_FILES.forEach((content) => {
    CourseElements.buttonNewContent().click();
    CourseElements.buttonNewContentTypeFile().click();
    CourseElements.contentTypeSelector(content.selector)
      .click({ force: true })
      .then(() => {
        CourseElements.contentUploadSelector().selectFile(content.path, { force: true });
        CourseElements.inputFileContentName().clear().type(getRandomName());
        CourseElements.buttonSave()
          .click()
          .wait('@contentCreate')
          .its('response.statusCode')
          .should('eq', StatusCode.Created);
      });
  });
});

Cypress.Commands.add('CourseAddAllContentsTypeLink', () => {
  cy.intercept('**/lesson').as('lessonCreate');
  cy.intercept('**/learn-content').as('contentCreate');
  CourseElements.inputLessonName().type(getRandomName());
  CourseElements.buttonNewLesson().click().wait('@lessonCreate');

  CONTENT_SELECTORS_AND_LINKS.forEach((content) => {
    CourseElements.buttonNewContent().click();
    CourseElements.buttonNewContentTypeLink().click();
    CourseElements.contentTypeSelector(content.selector)
      .click({ force: true })
      .then(() => {
        CourseElements.inputContentLink().type(content.link);
        CourseElements.inputLinkContentName().click({ force: true }).type(getRandomName());
        CourseElements.buttonSave()
          .click()
          .wait('@contentCreate')
          .its('response.statusCode')
          .should('eq', StatusCode.Created);
      });
  });
});

Cypress.Commands.add('CourseAddContentTypeQuiz', () => {
  cy.intercept('**/lesson').as('lessonCreate');
  cy.intercept('**/exams').as('quizCreate');
  cy.intercept('**/questions').as('questionCreate');
  CourseElements.inputLessonName().type(getRandomName());
  CourseElements.buttonNewLesson().click().wait('@lessonCreate');

  cy.FixturesQuiz().then((quizFixtures) => {
    CourseElements.buttonNewContent().click();
    CourseElements.buttonNewContentTypeQuiz().click();
    CourseElements.inputQuizName().type(getRandomName());
    CourseElements.buttonSave().click().wait('@quizCreate').its('response.statusCode').should('eq', StatusCode.Created);
    CourseElements.newQuizQuestionButton().click();
    CourseElements.quizQuestionInput().type(quizFixtures.question);
    quizFixtures.options.forEach((option, index) => {
      CourseElements.quizOptionInput(index).type(option.option);
      if (option.correct_answer) {
        CourseElements.selectQuizCorrectOption(index).click();
      }
      if (quizFixtures.options.length - index > 2) {
        CourseElements.newQuizAnswerButton().click();
      }
    });
    CourseElements.buttonSave()
      .click()
      .wait('@questionCreate')
      .its('response.statusCode')
      .should('eq', StatusCode.Created);
  });
});

Cypress.Commands.add('CourseOpen', () => {
  cy.intercept('**/course/**').as('courseOpen');
  CourseElements.openCourseButton()
    .click({ force: true })
    .wait('@courseOpen')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});

declare global {
  namespace Cypress {
    interface Chainable {
      CourseListFieldsValidate(course: CourseFields): Chainable<JQuery<HTMLElement>>;
      CourseDetailFieldsValidate(course: CourseFields): Chainable<JQuery<HTMLElement>>;
      CourseCreate(fixtures: CourseOptions): Chainable<CourseOptions>;
      CourseAccess(): Chainable<JQuery<HTMLElement>>;
      CourseSearch(courseName: string): Chainable<JQuery<HTMLElement>>;
      CourseEdit(fixtures: CourseOptions): Chainable<CourseOptions>;
      CourseDelete(): Chainable<JQuery<HTMLElement>>;
      CourseCreateWithContentFile(): Chainable<CourseOptions>;
      CourseAddAllContentsTypeFile(): Chainable<JQuery<HTMLElement>>;
      CourseAddAllContentsTypeLink(): Chainable<JQuery<HTMLElement>>;
      CourseAddContentTypeQuiz(): Chainable<JQuery<HTMLElement>>;
      CourseOpen(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
