/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import CourseElements from '../../support/elements/course-elements';
import { CourseOptions } from '../../support/interfaces';

let courseFixtures: CourseOptions;
let newCourseFixtures: CourseOptions;
let courseToDelete;

describe('Course edit', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesCourse().then((response) => {
      courseFixtures = response;
      cy.APICourseCreate(courseFixtures).then((response) => {
        courseToDelete = response.body.id;
        newCourseFixtures = {
          ...courseFixtures,
          name: getRandomName(),
          category: 'Design',
          lang: 'es',
          description: 'New description in automated test',
        };
      });
    });
  });

  it('As an administrator, I should be able to edit a previously created course', () => {
    cy.CourseSearch(courseFixtures.name);
    cy.CourseEdit(newCourseFixtures);
    cy.CourseAccess();
    cy.CourseSearch(newCourseFixtures.name);
    CourseElements.courseRowSelector().contains(newCourseFixtures.name);
  });

  afterEach(() => {
    if (courseToDelete) {
      cy.APICourseDelete(courseToDelete);
    }
  });
});
