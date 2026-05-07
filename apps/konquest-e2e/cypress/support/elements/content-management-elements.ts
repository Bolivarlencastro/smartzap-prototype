export default class ContentManagementElements {
  static buttonContentManagement() {
    return cy.get('[data-test="nav-link-content-management"]').should('be.visible');
  }

  static inputContentSearch() {
    return cy.get('[data-test="content-management-search-input"]').should('be.visible');
  }

  static tabSelector(tab: string) {
    return cy.get(`[data-test="content-management-tab-${tab}"]`).should('be.visible');
  }

  static flagSelector() {
    cy.get('kp-card-tag.development-inactive').scrollIntoView();
    cy.get('kp-card-tag.development-inactive').should('be.visible');
  }

  static buttonOpenCourseMenu() {
    cy.get('[data-test="button-open-edit-course-menu"]').scrollIntoView();
    return cy.get('[data-test="button-open-edit-course-menu"]').should('be.visible');
  }

  static myMissionsSelector() {
    return cy.get('[data-test="button-my-missions"]').should('be.visible');
  }

  static itemNameSelector() {
    return cy.get('[data-test="content-management-item-name-selector"]').should('be.visible');
  }

  static itemDeleteMenuSelector() {
    return cy.get('[data-test="content-management-menu-option-delete"]').should('be.visible');
  }

  static itemDeleteConfirmButtonSelector() {
    return cy.get('[id="button-confirm-ok"]').should('be.visible');
  }

  static itemDuplicateCourse() {
    return cy.get('[data-test="content-management-menu-option-duplicate"]').should('be.visible');
  }
}
