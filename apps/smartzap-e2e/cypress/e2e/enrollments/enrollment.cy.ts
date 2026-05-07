import { CANCELED_STATUS, WAITING_STATUS } from '../../support/constants/utils';
import CourseElements from '../../support/elements/course-elements';
import EnrollmentElements from '../../support/elements/enrollment-elements';
import { EnrollmentOptions } from '../../support/interfaces/enrollment-options';
import * as statusCode from '../../support/constants/status-code';
const usersSheet = './cypress/fixtures/enrollment/users.xlsx';
let enrollment: EnrollmentOptions;
const course = {
  id: '4f6e0ae4-8e41-47c4-acbb-c476d82daabc',
  name: 'vgolrx7uwwe',
};

beforeEach(() => {
  cy.Login('admin');
  cy.APIEnrollmentDeleteAll();
});

it('Admin enroll user in a course', () => {
  cy.CourseSearch(course.name);
  cy.CourseOpen();
  EnrollmentElements.buttonManageEnrollments().click();
  cy.FixturesEnrollment()
    .then((defaultEnrollment) => defaultEnrollment)
    .then((defaultEnrollment) => {
      enrollment = defaultEnrollment;
      cy.EnrollmentIndividual(defaultEnrollment);
    })
    .then(() => {
      EnrollmentElements.listEnrollmentName().contains(enrollment.name);
      EnrollmentElements.listEnrollmentPhone().contains(enrollment.phone);
      EnrollmentElements.listEnrollmentStatus().contains(WAITING_STATUS);
    })
    .then(() => {
      cy.EnrollmentManageAccess();
      EnrollmentElements.fieldNameManageEnrollments().contains(enrollment.name);
    });
});

it('Admin enroll user in a course by sheet', () => {
  cy.CourseSearch(course.name);
  cy.CourseOpen();
  EnrollmentElements.buttonManageEnrollments().click();
  EnrollmentElements.buttonEnrollment().click();
  cy.FixturesEnrollment()
    .then((defaultEnrollment) => defaultEnrollment)
    .then((defaultEnrollment) => {
      enrollment = defaultEnrollment;
    })
    .then(() => {
      cy.EnrollmentBatchBySheet(usersSheet);
    })
    .then(() => {
      EnrollmentElements.listEnrollmentName().contains(enrollment.name);
      EnrollmentElements.listEnrollmentPhone().contains(enrollment.phone);
      EnrollmentElements.listEnrollmentStatus().contains(WAITING_STATUS);
    })
    .then(() => {
      cy.EnrollmentManageAccess();
      EnrollmentElements.fieldNameManageEnrollments().contains(enrollment.name);
    });
});

it('Should delete enrollment', () => {
  cy.intercept(`**/enrollment/**`).as('deleteEnrollment');
  cy.FixturesEnrollment()
    .then((response) => {
      enrollment = response;
      enrollment.course_id = course.id;
    })
    .then(() => {
      cy.APIEnrollmentUser(enrollment);
    })
    .then(() => {
      cy.CourseSearch(course.name);
      cy.CourseOpen();
      EnrollmentElements.buttonManageEnrollments().click();
      EnrollmentElements.menuListEnrollment().click();
      EnrollmentElements.optionDeleteEnrollment().click();
      EnrollmentElements.buttonConfirm().click();
      cy.wait('@deleteEnrollment').then((response) => {
        expect(response.response.statusCode).equal(statusCode.NoContent);
      });
      EnrollmentElements.emptyListEnrollment();
    });
});

it('Should cancel enrollment', () => {
  cy.intercept(`**/enrollment/**`).as('cancelEnrollment');
  cy.FixturesEnrollment()
    .then((response) => {
      enrollment = response;
      enrollment.course_id = course.id;
    })
    .then(() => {
      cy.APIEnrollmentUser(enrollment);
    })
    .then(() => {
      cy.CourseSearch(course.name);
      cy.CourseOpen();
      EnrollmentElements.buttonManageEnrollments().click();
      EnrollmentElements.menuListEnrollment().click();
      EnrollmentElements.optionCancelEnrollment().click();
      cy.wait('@cancelEnrollment').then((response) => {
        expect(response.response.statusCode).equal(statusCode.OK);
      });
      EnrollmentElements.listEnrollmentStatus().contains(CANCELED_STATUS);
    });
});

it('Should re-enroll enrollment', () => {
  cy.intercept(`**/enrollment/**`).as('loadEnrollment');
  cy.intercept(`**/enrollment`).as('loadReenroll');
  cy.FixturesEnrollment()
    .then((response) => {
      enrollment = response;
      enrollment.course_id = course.id;
    })
    .then(() => {
      cy.APIEnrollmentUser(enrollment);
    })
    .then(() => {
      cy.CourseSearch(course.name);
      cy.CourseOpen();
      EnrollmentElements.buttonManageEnrollments().click();
      EnrollmentElements.menuListEnrollment().click();
      EnrollmentElements.optionCancelEnrollment().click();
      cy.wait('@loadEnrollment').then((response) => {
        expect(response.response.statusCode).equal(statusCode.OK);
      });
      cy.get('[data-test="left-page"]').should('be.visible').click();
      EnrollmentElements.buttonManageEnrollments().click();
      EnrollmentElements.menuListEnrollment().click();
      EnrollmentElements.optionReenroll().click();
      EnrollmentElements.buttonConfirm().click();
      cy.wait('@loadReenroll').then((response) => {
        expect(response.response.statusCode).equal(statusCode.Created);
      });
      EnrollmentElements.listEnrollmentStatus().contains(WAITING_STATUS);
    });
});
