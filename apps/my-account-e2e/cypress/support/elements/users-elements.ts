export default class UsersElements {
  static buttonDropDown() {
    return cy.get('[data-test="test-drop-down"]').should('be.visible');
  }

  static buttonImportUsers() {
    return cy.get('[data-test="test-import-users"]').should('be.visible');
  }

  static buttonUploadFile() {
    return cy.get('[data-test="bath-users-input"]').should('be.hidden');
  }

  static buttonConfirm() {
    return cy.get('[data-test="button-save-changes"]').should('be.visible');
  }

  static userKonquest() {
    return cy.get('[value="a6d23aea-807e-4374-964e-c725b817742d"]');
  }

  static buttonConfirmRolesImport() {
    return cy.get('.mat-mdc-dialog-actions > .mdc-button > .mdc-button__label');
  }

  static infoImportUser() {
    return cy.get('[role="tooltip"]');
  }

  static search() {
    return cy.get('#filter-input').should('be.visible');
  }

  static tableName() {
    return cy.get('[data-test="user-list-field-name"]');
  }

  static tableEmail() {
    return cy.get('[data-test="user-list-field-email"]');
  }

  static buttonNewUser() {
    return cy.get('[data-test="button-new-user"]').should('be.visible');
  }

  static formFieldEmail() {
    return cy.get('[data-test="field-email"]').focus();
  }

  static formFieldName() {
    return cy.get('[data-test="field-name"]').focus();
  }

  static formFieldLanguage() {
    return cy.get('[data-test="field-language"]').focus();
  }

  static optionLanguage() {
    return cy.get('[role="listbox"]');
  }

  static saveFormUser() {
    return cy.get('button[type="submit"]').focus();
  }

  static listMenuOptions() {
    return cy.get('button');
  }

  static workspaceList() {
    return cy.get('[data-test="test-workspace"]');
  }

  static roleOption(role) {
    return cy.get(`[data-test="role-${role}"]`);
  }

  static closeModal() {
    return cy.get('[data-test="button-close-modal"]').should('be.visible');
  }

  static buttonNewPassword() {
    return cy.get('[data-test="button-new-password"]');
  }

  static userMenuButton() {
    return cy.get('[data-cy="user-menu"]', { timeout: 5000 }).should('exist', 'be.visible');
  }

  static workspaceEditButton() {
    return cy.get('[data-test="button-edit-workspace"]').scrollIntoView();
  }

  static roleSelectorInKonquest() {
    return cy.get('[data-test="selector-role-konquest"]').should('be.visible');
  }

  static workspaceOptionSelector() {
    return cy.get('[data-test="workspace-option-selector"]').should('be.visible');
  }

  static fieldUploadFile() {
    return cy.get('app-users-import-form > [ng-reflect-message="Selecione um Arquivo"]').should('be.visible');
  }

  static roleTab() {
    return cy.get('[role="tab"]').last().should('be.visible');
  }
}
