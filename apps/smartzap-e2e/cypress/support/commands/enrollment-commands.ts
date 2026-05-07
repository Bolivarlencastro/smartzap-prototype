import EnrollmentElements from '../elements/enrollment-elements';
import { EnrollmentOptions } from '../interfaces/enrollment-options';

Cypress.Commands.add('EnrollmentIndividual', (data) => {
  cy.intercept('**/enrollment/user').as('loadEnrollment');
  EnrollmentElements.buttonEnrollment().click();
  EnrollmentElements.buttonIndividualEnrollment().click();
  EnrollmentElements.enrollmentInputPhone().type(data.phone);
  EnrollmentElements.enrollmentInputName().type('{selectall}{backspace}').type(data.name);
  EnrollmentElements.enrollmentInputEmail().type('{selectall}{backspace}').type(data.email);
  EnrollmentElements.enrollmentInputTags().type('{selectall}{backspace}').type(data.tag);
  EnrollmentElements.enrollmentInputTimeZone().type(data.timezone);
  EnrollmentElements.enrollmentButtonOk().click();
  cy.wait('@loadEnrollment').then((response: any) => {
    expect(response.response.statusCode).eq(201);
  });
});

Cypress.Commands.add('EnrollmentBatchBySheet', (file) => {
  cy.intercept('**/enrollment/file').as('loadEnrollment');
  EnrollmentElements.buttonBatchEnrollment().click();
  EnrollmentElements.buttonUploadBatchEnrollment().selectFile(file, { force: true });
  EnrollmentElements.inputTimezoneBatchEnrollment().type('America/Sao_Paulo');
  EnrollmentElements.buttonConfirmBatchEnrollment().click();
  cy.wait('@loadEnrollment').then((response: any) => {
    expect(response.response.statusCode).eq(201);
  });
});

Cypress.Commands.add('EnrollmentManageAccess', () => {
  cy.intercept('**/enrollment?page=1&per_page=10**').as('loadEnrollment');
  EnrollmentElements.navBarManageEnrollments().click();
  cy.wait('@loadEnrollment');
});

declare global {
  namespace Cypress {
    interface Chainable {
      EnrollmentIndividual(data: EnrollmentOptions): Chainable<JQuery<HTMLElement>>;
      EnrollmentBatchBySheet(file): Chainable<JQuery<HTMLElement>>;
      EnrollmentManageAccess(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
