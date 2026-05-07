export default class SettingsCategoriesElements {
  static createCategoryButton() {
    return cy.get('[data-cy="float-button"]').should('be.visible');
  }

  static inputCategoryName() {
    return cy.get('[data-test="category-dialog-name-input"]').should('be.visible');
  }

  static categoryIconExpansiveMenu() {
    return cy.get('[role="combobox"]').should('be.visible');
  }

  static categoryIconOption() {
    return cy.get('[role="option"]').should('be.visible');
  }

  static categoryAccess() {
    return cy.get('[data-test="categories"]').should('be.visible');
  }

  static categoryMenu() {
    return cy.get('[data-cy="collection-item-menu"]').should('be.visible');
  }

  static categoryOptionMenu() {
    return cy.get('[role="menuitem"]').should('be.visible');
  }

  static categoryInput() {
    return cy.get('#filter-input').should('be.visible');
  }

  static categoryConfirmButton() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static buttonCategorieNav() {
    return cy.get('[data-test="nav-item-categories"]').should('be.visible');
  }
}
