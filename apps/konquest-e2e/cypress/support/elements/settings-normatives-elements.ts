export default class SettingsNormativesElements {
  static buttonNavNomatives() {
    return cy.get('[data-test="nav-link-normatives"]');
  }

  static inputNomativeName() {
    return cy.get('#input-normative-name');
  }

  static regulatoryComplianceInputNormative() {
    return cy.get('[data-test="regulatory-compliance-input-normative"]');
  }

  static regulatoryComplianceInputDuration() {
    return cy.get('[data-test="input-regulatory-compliance-duration"]');
  }

  static regulatoryComplianceInputLearningObject() {
    return cy.get('[data-test="regulatory-compliance-input-learning-object"]');
  }

  static regulatoryComplianceOptionSelector(option: string) {
    return cy.get(`[data-test="regulatory-compliance-option-selector-${option}"]`);
  }

  static regulatoryCompliancePeriodTypeSelector() {
    return cy.get('[data-test="input-regulatory-compliance-period-type"]');
  }

  static regulatoryComplianceSearchSelector() {
    return cy.get('[data-test="regulatory-compliance-search-input-element"]');
  }

  static regulatoryComplianceListSelector() {
    return cy.get('[data-test="regulatory-compliance-option-selector"]').should('be.visible');
  }

  static tabCreation() {
    return cy.get('[data-test="regulatory-compliance-tab-creation"]').should('be.visible');
  }

  static tabManagement() {
    return cy.get('[data-test="regulatory-compliance-tab-management"]').should('be.visible');
  }
}
