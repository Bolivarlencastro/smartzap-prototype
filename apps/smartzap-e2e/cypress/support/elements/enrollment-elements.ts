export default class EnrollmentElements {
  static buttonManageEnrollments() {
    return cy.get('[class="mdc-button__label"]').contains('Gerenciar');
  }
  static buttonEnrollment() {
    return cy.get('[data-test="button-new-enrollment"]').should('be.visible');
  }

  static buttonIndividualEnrollment() {
    return cy.get('[data-test="button-individual-enrollment"]').should('be.visible');
  }

  static enrollmentInputPhone() {
    return cy.get('[data-test="input-phone"]').should('be.visible');
  }

  static enrollmentInputName() {
    return cy.get('[data-test="input-name"]').should('be.visible');
  }

  static enrollmentInputEmail() {
    return cy.get('[data-test="input-email"]').should('be.visible');
  }

  static enrollmentInputTags() {
    return cy.get('[data-test="input-tag"]').should('be.visible');
  }

  static enrollmentInputTimeZone() {
    return cy.get('[formcontrolname="timezone"]').should('be.visible');
  }

  static enrollmentButtonOk() {
    return cy.get('[data-test="button-ok"]').should('be.visible');
  }

  static listEnrollmentName() {
    return cy.get('[data-test="list-enrollment-name"]').should('be.visible');
  }

  static listEnrollmentPhone() {
    return cy.get('[data-test="list-enrollment-phone"]').should('be.visible');
  }

  static listEnrollmentStatus() {
    return cy.get('[data-test="list-enrollment-status"]').should('be.visible');
  }

  static buttonBatchEnrollment() {
    return cy.get('[data-test="button-batch-enrollment"]').should('be.visible');
  }

  static buttonUploadBatchEnrollment() {
    return cy.get('[data-test="batch-enrollment"]');
  }

  static inputTimezoneBatchEnrollment() {
    return cy.get('[data-test="batch-enrollment-input-timezone"]').should('be.visible');
  }

  static buttonConfirmBatchEnrollment() {
    return cy.get('[data-test="button-confirm-batch-enrollment"]').should('be.visible');
  }

  static navBarManageEnrollments() {
    return cy.get('[data-test="settings"]').should('be.visible');
  }

  static fieldNameManageEnrollments() {
    return cy.get('[data-test="settings-enrollments-name"]').should('be.visible');
  }

  static fieldBalance() {
    return cy.get('kp-toolbar-balance');
  }

  static numberBalance() {
    return cy.get('[class="text-4xl font-bold"]');
  }

  static menuListEnrollment() {
    return cy.get('[data-test="menu-list"]').should('be.visible');
  }

  static optionDeleteEnrollment() {
    return cy.get('[data-test="delete-enrollment"]').should('be.visible');
  }

  static buttonConfirm() {
    return cy.get('[id="button-confirm-ok"]').should('be.visible');
  }

  static emptyListEnrollment() {
    return cy.get('[data-test="empty-list"]').should('be.visible');
  }

  static optionCancelEnrollment() {
    return cy.get('[data-test="cancel-enrollment"]').should('be.visible');
  }

  static optionReenroll() {
    return cy.get('[data-test="reenroll-enrollment"]').should('be.visible');
  }
}
