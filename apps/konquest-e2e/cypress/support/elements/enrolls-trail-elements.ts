export default class EnrollsTrailsElements {
  static inputSearchTrail() {
    return cy.get('[id="filter-input"]');
  }

  static tableTrails() {
    return cy.get('[role="table"] [role="row"]');
  }

  static columnTrailName(name) {
    return EnrollsTrailsElements.tableTrails().contains(name);
  }

  static buttonEnrollmentTrail() {
    return cy.get('[ng-reflect-router-link="learning-trails"]').should('be.visible').click();
  }

  static enrollmentsOptionMenuSelector() {
    return cy.get('[role="menuitem"]').should('be.visible');
  }

  static menuOptions() {
    return cy.get('[data-cy="collection-item-menu"]').should('be.visible');
  }

  static buttonAccessTrail() {
    return cy.get('#button-viewTrail').should('be.visible');
  }

  static columnTrailEnrollmentsMobile() {
    return cy.get('kp-enrollment-list-mobile').should('be.visible');
  }

  static enrollmentStatusMobile() {
    return cy.get('kp-status-chip');
  }

  static optionFilterStatusMobile(status) {
    return cy.get(`[data-test="option-${status}"]`).should('exist');
  }

  static filterEnrollmentsMobile() {
    return cy.get('[data-test="enrollments-mobile-filter"]').should('be.visible');
  }
}
