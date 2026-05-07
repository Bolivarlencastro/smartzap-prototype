export default class GlobalSearchElements {
  static buttonGlobalSearch() {
    return cy.get('[data-test="global-search-trigger"]').should('be.visible');
  }

  static buttonMissionOnGlobalSearch() {
    return cy.get('[data-test="tab-MISSIONS"]').should('be.visible');
  }

  static fieldSearchOnGlobalSearch() {
    return cy.get('input').last();
  }

  static listItems() {
    return cy.get('kp-global-search-item');
  }

  static buttonTrailOnGlobalSearch() {
    return cy.get('[data-test="tab-TRAILS"]').should('exist');
  }

  static buttonChannelOnGlobalSearch() {
    return cy.get('[data-test="tab-CHANNELS"]').should('exist');
  }

  static buttonPulseOnGlobalSearch() {
    return cy.get('[data-test="tab-PULSES"]').should('exist');
  }

  static buttonOpenItem(itemName?) {
    if (itemName) {
      return this.listItems().contains(itemName);
    }

    return this.listItems().first();
  }

  static mobileItemName() {
    return cy.get('[data-test="global-search-mobile-results-name"]').should('be.visible');
  }

  static textContentNotFound() {
    return cy.get('[data-test="global-search-no-items-selector"]').should('be.visible');
  }
}
