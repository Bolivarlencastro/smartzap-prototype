export default class SettingsElements {
  static settingsTab() {
    return cy.get('[data-test="configurations"]').should('be.visible');
  }

  static inputWorkspacePerformance() {
    return cy.get('[data-test="input-workspace-performance"]').should('be.visible');
  }

  static defaultCategories() {
    return cy
      .get('[data-test="settings-default-categories-selector"]')
      .find('button[role="switch"]')
      .should('be.visible');
  }

  static buttonConfirm() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static buttonSettings() {
    return cy.get('[data-test="nav-link-settings"]').should('be.visible');
  }

  static buttonAdmin() {
    return cy.get('[data-test="nav-item-admin-settings"]').should('be.visible');
  }

  static buttonSections() {
    return cy.get('[data-test="nav-link-custom-sections"]').should('be.visible');
  }

  static categoriesSelector() {
    return cy.get(`[role="listbox"][aria-multiselectable="true"] mat-option`);
  }
}
