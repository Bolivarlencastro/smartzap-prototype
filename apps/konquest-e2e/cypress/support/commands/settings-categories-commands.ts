/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';
import SettingsCategoriesElements from '../elements/settings-categories-elements';
import { CypressResponse } from '../interfaces';
import SettingsElements from '../elements/settings-elements';

Cypress.Commands.add('SettingsCategoriesAccess', () => {
  cy.intercept('**/categories?search=').as('loadCategories');
  SettingsElements.buttonAdmin().click();
  SettingsCategoriesElements.buttonCategorieNav().click();
  cy.wait('@loadCategories');
  return cy.url().should('include', '/categories');
});

Cypress.Commands.add('SettingsCategoriesCreate', (name) => {
  cy.intercept('**/categories').as('categoryCreate');
  SettingsCategoriesElements.createCategoryButton().click();
  SettingsCategoriesElements.inputCategoryName().type(name);
  SettingsCategoriesElements.categoryIconExpansiveMenu().click();
  SettingsCategoriesElements.categoryIconOption().first().click();
  cy.GetMetaDataSelectorAndClick('category-dialog-ok-button');
  cy.wait('@categoryCreate').then((response) => cy.wrap(response.response));
});

Cypress.Commands.add('SettingsCategoriesEdit', (name) => {
  cy.intercept('PUT', '**/categories/**').as('categoryEdit');
  SettingsCategoriesElements.categoryMenu().click();
  SettingsCategoriesElements.categoryOptionMenu().eq(1).click();
  SettingsCategoriesElements.inputCategoryName().clear().type(name);
  SettingsCategoriesElements.categoryIconExpansiveMenu().click();
  SettingsCategoriesElements.categoryIconOption().eq(5).click();
  cy.GetMetaDataSelectorAndClick('category-dialog-ok-button');
  return cy.wait('@categoryEdit');
});

Cypress.Commands.add('SettingsCategoriesSearch', (name) => {
  cy.intercept('**/categories?search**').as('categorySearch');
  SettingsCategoriesElements.categoryInput().clear().type(name);
  return cy.wait('@categorySearch');
});

Cypress.Commands.add('SettingsCategoriesDelete', () => {
  SettingsCategoriesElements.categoryMenu().click();
  cy.GetMetaDataSelectorAndClick('collection-item-menu-remove');
  return SettingsCategoriesElements.categoryConfirmButton().click();
});

Cypress.Commands.add('SettingsCategoriesToggleStatus', (status) => {
  cy.intercept('**/workspaces/**').as('categoriesUpdate');

  const expectedValue = status ? 'false' : 'true';

  SettingsElements.defaultCategories().should('have.attr', 'aria-checked', expectedValue).click();

  if (status != true) {
    SettingsElements.buttonConfirm().click();
  }

  return cy.wait('@categoriesUpdate');
});

declare global {
  namespace Cypress {
    interface Chainable {
      SettingsCategoriesAccess(): Chainable<string>;
      SettingsCategoriesCreate(name: string): Chainable<CypressResponse>;
      SettingsCategoriesEdit(name: string): Chainable<Interception>;
      SettingsCategoriesSearch(name: string): Chainable<Interception>;
      SettingsCategoriesDelete(): Cypress.Chainable<JQuery<HTMLElement>>;
      SettingsCategoriesToggleStatus(status: boolean): Chainable<Interception>;
    }
  }
}
