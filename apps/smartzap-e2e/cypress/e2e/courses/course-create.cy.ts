/// <reference types="cypress" />

import CourseElements from '../../support/elements/course-elements';
import { CourseOptions } from '../../support/interfaces';

let courseFixtures: CourseOptions;
let courseToDelete;

describe('Course create', () => {
  beforeEach(() => {
    cy.FixturesCourse().then((response) => {
      courseFixtures = response;
    });
  });
  it('As an Admin, I should be able to create a course', () => {
    cy.Login('admin');
    cy.CourseCreate(courseFixtures).then((response) => {
      courseToDelete = response.id;
      cy.CourseAccess();
      cy.CourseSearch(courseFixtures.name);
      CourseElements.courseRowSelector().contains(courseFixtures.name);
    });
  });

  it('As an Admin, I should be able to create a course with all contents type file', () => {
    cy.Login('admin');
    cy.CourseCreate(courseFixtures).then((response) => {
      courseToDelete = response.id;
      cy.CourseAddAllContentsTypeFile();
      CourseElements.buttonConfirmContents().click();
      cy.CourseAccess();
      cy.CourseSearch(courseFixtures.name);
      cy.CourseOpen();
      CourseElements.courseContentDetails().should('have.length', 4);
    });
  });

  it('As an Admin, I should be able to create a course with all contents type link', () => {
    cy.Login('admin');
    cy.CourseCreate(courseFixtures).then((response) => {
      courseToDelete = response.id;
      cy.CourseAddAllContentsTypeLink();
      CourseElements.buttonConfirmContents().click();
      cy.CourseAccess();
      cy.CourseSearch(courseFixtures.name);
      cy.CourseOpen();
      CourseElements.courseContentDetails().should('have.length', 1);
    });
  });

  it('As an Admin, I should be able to create a course with a content type quiz', () => {
    cy.Login('admin');
    cy.CourseCreate(courseFixtures).then((response) => {
      courseToDelete = response.id;
      cy.CourseAddContentTypeQuiz();
      CourseElements.buttonConfirmContents().click();
      cy.CourseAccess();
      cy.CourseSearch(courseFixtures.name);
      cy.CourseOpen();
      CourseElements.courseContentDetails().should('have.length', 1);
    });
  });

  afterEach(() => {
    if (courseToDelete) {
      cy.APICourseDelete(courseToDelete);
    }
  });
});
