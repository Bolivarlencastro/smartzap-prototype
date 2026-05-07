/// <reference types="cypress" />

import EnrollmentElements from '../../support/elements/enrollment-elements';
import { EnrollmentOptions } from '../../support/interfaces/enrollment-options';
import { CourseOptions } from '../../support/interfaces';
import { COMPLETED_STATUS } from '../../support/constants/utils';

let course: CourseOptions;
let enrollmentId: string;
let courseToDelete: string;

describe('Enrollment status impact when course content changes', () => {
  beforeEach(() => {
    cy.Login('admin');

    cy.FixturesCourse()
      .then((fixture) => cy.APICourseCreate(fixture))
      .then((courseResponse) => {
        course = courseResponse.body;
        courseToDelete = course.id;
        return cy.FixturesContent();
      })
      .then((contentFixture) => {
        contentFixture.lesson.course_id = course.id;
        return cy.APICreateContentFileAllSteps(contentFixture.lesson, contentFixture.learnContent);
      })
      .then(() => cy.APICoursePublish(courseToDelete))
      .then(() => cy.FixturesEnrollment())
      .then((enrollmentFixture: EnrollmentOptions) => {
        enrollmentFixture.course_id = courseToDelete;
        return cy.APIEnrollmentUser(enrollmentFixture);
      })
      .then((enrollmentResponse) => {
        enrollmentId = enrollmentResponse.body.id;
        return cy.APIEnrollmentComplete(enrollmentId);
      });
  });

  it('enrollment should show COMPLETED status after being concluded', () => {
    cy.CourseSearch(course.name);
    cy.CourseOpen();
    EnrollmentElements.buttonManageEnrollments().click();
    EnrollmentElements.listEnrollmentStatus().contains(COMPLETED_STATUS);
  });

  it('enrollment status should change when new content is added to a completed course', () => {
    cy.APILessonWithContentCreate(course.id).then(({ lessonId }) => {
      cy.CourseSearch(course.name);
      cy.CourseOpen();
      EnrollmentElements.buttonManageEnrollments().click();
      EnrollmentElements.listEnrollmentStatus().should('not.contain', COMPLETED_STATUS);

      cy.APILessonDelete(lessonId);
    });
  });

  it('enrollment status should revert to COMPLETED when the added content is removed', () => {
    cy.APILessonWithContentCreate(course.id).then(({ lessonId }) => {
      cy.APILessonDelete(lessonId);

      cy.CourseSearch(course.name);
      cy.CourseOpen();
      EnrollmentElements.buttonManageEnrollments().click();
      EnrollmentElements.listEnrollmentStatus().contains(COMPLETED_STATUS);
    });
  });

  afterEach(() => {
    if (enrollmentId) cy.APIEnrollmentDelete(enrollmentId);
    if (courseToDelete) cy.APICourseDelete(courseToDelete);
  });
});
