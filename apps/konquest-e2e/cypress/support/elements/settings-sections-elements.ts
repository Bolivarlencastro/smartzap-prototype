export default class SettingsSectionsElements {
  static sectionCreateOption(option) {
    cy.get('[data-test="menu-create-section"]').should('exist');
    return cy.get(`[data-test="button-create-section-${option}"]`).should('be.visible');
  }

  static inputSectionName() {
    return cy.get('[data-test="input-section-name"]').should('be.visible');
  }

  static inputSectionDescription() {
    return cy.get('[data-test="input-section-description"]').should('be.visible');
  }

  static buttonTemporary() {
    return cy.get('mat-slide-toggle > div > button').should('be.visible');
  }

  static inputStartDate() {
    return cy.get('[data-test="input-section-start-date"]').should('be.visible');
  }

  static inputEndDate() {
    return cy.get('[data-test="input-section-end-date"]').should('be.visible');
  }

  static sectionsTitleElement() {
    return cy.get('[data-test="section-title"]').should('be.visible');
  }

  static sectionsDescriptionElement() {
    return cy.get('[data-test="section-description"]').should('be.visible');
  }

  static contentSearch() {
    return cy.get('[data-test="global-search-input"]').should('be.visible');
  }

  static contentSelector(name: string) {
    return cy.get(`[data-test="section-content-item-${name}"]`, { timeout: 10000 }).should('be.visible');
  }
}
