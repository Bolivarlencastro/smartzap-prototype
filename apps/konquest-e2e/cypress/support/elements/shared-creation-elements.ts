export default class SharedCreationElements {
  static sharedCreateButton() {
    return cy.get('app-create-learn-content-button > button').should('be.visible');
  }

  static buttonCreateTrail() {
    return cy.get('[data-test="new-learning-trail"]').should('be.visible');
  }
}
