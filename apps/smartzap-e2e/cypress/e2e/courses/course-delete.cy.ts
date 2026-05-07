/// <reference types="cypress" />

import { COURSE_NOT_AVAILABLE } from '../../support/constants/utils';
import CourseElements from '../../support/elements/course-elements';

let courseFixtures;

describe('Course delete', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesCourse().then((response) => {
      courseFixtures = response;
      cy.APICourseCreate(courseFixtures);
    });
  });

  it('As an administrator, I should be able to delete a course', () => {
    cy.CourseSearch(courseFixtures.name);
    cy.CourseDelete();
    cy.CourseSearch(courseFixtures.name);
    CourseElements.courseListSelector().contains(COURSE_NOT_AVAILABLE);
  });
});
