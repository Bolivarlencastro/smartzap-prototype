export default class SettingsEnrollmentsElements {
  static motiveRejectCertificate() {
    return cy
      .get(
        '.mat-mdc-dialog-content > .mat-mdc-form-field > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix',
      )
      .should('be.visible');
  }

  static confirmReject() {
    return cy.get('#button-rejectCertificate').should('be.visible');
  }

  static confirmDeleteEnrollment() {
    return cy.get('#button-delete').should('be.visible');
  }

  static fieldEmptyEnrollment() {
    return cy.get('[role="row"]');
  }

  static inputEnrollmentPerformance() {
    return cy.get('[data-test="input-mission-minimal-performance"]').should('be.visible');
  }

  static confirmApprove() {
    return cy.get('#button-approveEnrollment').should('be.visible');
  }

  static tableViewActivitiesEmpty() {
    return cy.get('[data-test="points"]');
  }

  static optionEnrollment() {
    return cy.get('.mat-mdc-menu-content >button');
  }

  static fieldGoalDateEnrollment() {
    return cy.get('[data-test="input-goal-date"]').should('be.visible').and('not.be.disabled');
  }

  static confirmRestart() {
    return cy.get('#button-restart').should('be.visible');
  }

  static confirmReenroll() {
    return cy.get('#button-reEnroll').should('be.visible');
  }

  static titleAllEnrollments() {
    return cy.get('.text-lg').should('be.visible');
  }

  static tableAllEnrollments() {
    return cy.get('table > tbody > tr');
  }

  static tableViewActivities() {
    return cy.get('app-enrollment-tracking-collection > div > cdk-table > cdk-row');
  }

  static confirmApproveCertificate() {
    return cy.get('#button-approveCertificate').should('be.visible');
  }
  static titleHistoricEnroll() {
    return cy.get('.text-xl');
  }

  static confirmRetake() {
    return cy.get('#button-retake').should('be.visible');
  }

  static buttonNavbar() {
    return cy.get('[data-test="navbar-button"]').should('be.visible').click();
  }

  static buttonSettingsEnrollmentsTrails() {
    return cy.get('[data-test="nav-item-trail-enrollments"]').should('be.visible');
  }

  static buttonNavEnrollments() {
    return cy.get('fuse-vertical-navigation-collapsable-item[data-test="nav-item-enrollments"]').should('be.visible');
  }

  static buttonEnrollmentsOnNav() {
    return cy.get('[data-test="nav-item-mission-enrollments"]').should('be.visible');
  }

  static enrollmentStatusSelector() {
    return cy.get('kp-card-tag').should('be.visible');
  }

  static trailRow() {
    return cy.get('.mat-mdc-row > .cdk-column-name');
  }

  static trailEnrollmentMenu() {
    return cy.get('[aria-label="Menu"]').should('be.visible');
  }
}
