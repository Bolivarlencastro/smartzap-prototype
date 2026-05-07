export default class EnrollsMissionsElements {
  static inputSearchEnrollmentsMissions() {
    return cy.get('#filter-input').should('be.visible');
  }
  static navBarButton() {
    return cy.get('.fuse-vertical-navigation-item-wrapper a[ng-reflect-router-link="enrollments/done"]');
  }

  static enrollmentRow() {
    return cy.get('[role="table"] [role="row"]');
  }

  static menuOptionsMission() {
    return cy.get('[data-cy="collection-item-menu"]', { timeout: 1000 });
  }

  static listOptionsInEnrollment() {
    return cy.get('[data-cy="optionsMenu"]').should('be.visible');
  }

  static buttonConfirmClassroom() {
    return cy.get('kp-action-menu div button span').contains('Abrir').should('be.visible');
  }

  static enrollmentStatus() {
    return cy.get('[data-test="enrollment-status"]');
  }

  static enrollmentOptionFinishMission() {
    return cy.get('.mat-menu-content > :nth-child(3)').should('be.visible');
  }

  static enrollmentUploadCertificate() {
    return cy.get('#input-certificate');
  }

  static sendCertificate() {
    return cy.get('#button-mission-detail-dialog-start').should('be.visible');
  }

  static motiveGiveUp() {
    return cy.get('[data-test="confirm-dialog-report-reason"]').should('be.visible');
  }

  static confirmGiveUp() {
    return cy.get('#button-giveUp').should('be.visible');
  }

  static buttonEnrollments() {
    cy.get('[data-test="nav-link-enrollments"]', { timeout: 20000 }).should('be.visible').click();
  }

  static buttonEnrollmentsGetCertificate() {
    return cy.get('[data-test="enrollments-certificate"]').should('be.visible');
  }

  static buttonEnrollmentsGenerateCertificate() {
    return cy.get('[data-test="enrollments-dialog-generate-certificate"]').should('be.visible');
  }

  static openMissionContinue() {
    return cy.get('kp-action-menu div button span').contains('Abrir').should('be.visible');
  }

  static enrollmentWaitingList() {
    return cy.get('[data-test="enroll-to-waiting-list"]');
  }

  static refuseEnrollmentPresentialLive() {
    return cy.get('[ng-reflect-message="Recusar"]').first().should('be.visible').click();
  }

  static statusRefusedPresentialLive() {
    return cy.get('cdk-table [ng-reflect-status="REFUSED"]');
  }

  static approveEnrollmentPresentialLive() {
    return cy.get('[ng-reflect-message="Aprovar"]').first().should('be.visible').click();
  }

  static statusEnrolledPresentialLive() {
    return cy.get('cdk-table [ng-reflect-status="ENROLLED"]');
  }

  static buttonTouchTargetMobile() {
    return cy.get('.mat-mdc-button-touch-target').parents().contains('menu').should('be.visible');
  }

  static enrollmentStatusMobile() {
    return cy.get('kp-status-chip');
  }

  static optionEnrollmentListMobile() {
    return cy.get('kp-enrollment-list-mobile button span');
  }

  static iconExternalMissionMobile() {
    return cy.get('[data-mat-icon-name="moving"]').should('be.visible');
  }

  static contentDialogMissionMobile() {
    return cy.get('kp-content-box-dialog');
  }

  static buttonCertificateDisabledMobile() {
    return cy.get('button[disabled="true"]').should('be.visible');
  }

  static actionButtonOnEnrollmentMobile(action) {
    return cy.get('.mdc-button__label .text-sm').contains(action).should('be.visible');
  }

  static actionButtonOnCardMobile(action) {
    return cy.get('.mdc-button__label').contains(action).should('be.visible');
  }

  static optionsMenu() {
    return cy.get('[data-cy="collection-item-menu"]').should('be.exist');
  }

  static tableMissionEnrollments() {
    return cy.get('[data-test="table-mission-enrollments"]');
  }

  static fieldOnListEnrollments() {
    return cy.get('[role="row"]');
  }

  static missionRow() {
    return cy.get('tbody').find('[role="row"]');
  }

  static missionEnrollmentRequired() {
    return cy.get('.mat-column-required').should('be.visible');
  }

  static missionEnrollmentGoalDateField() {
    return cy.get('[data-test="enrollment-goal-date-field"]').should('be.visible');
  }
}
