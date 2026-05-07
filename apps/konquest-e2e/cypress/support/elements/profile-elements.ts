export default class ProfileElements {
  static userMenuButtonMobile() {
    return cy.get('[data-cy="user-menu"]').should('be.visible');
  }

  static buttonProfileMobile() {
    return cy.get('[data-test="user-menu-profile"]').should('be.visible');
  }

  static nameProfile() {
    return cy.get('#name').should('be.visible');
  }

  static nickName() {
    return cy.get('#nickname').should('be.visible');
  }

  static phone() {
    return cy.get('[placeholder="Telefone"]').should('be.visible');
  }

  static birthday() {
    return cy.get('[name="birthday"]').should('be.visible');
  }

  static email() {
    return cy.get('#email').should('be.visible');
  }

  static secondaryEmail() {
    return cy.get('#secondary_email').should('be.visible');
  }

  static country() {
    return cy.get('#country').should('be.visible');
  }

  static language() {
    return cy.get('#language').should('be.visible');
  }

  static address() {
    return cy.get('#address').should('be.visible');
  }

  static submitButton() {
    return cy.get('[data-test="submit-button"]').should('be.visible');
  }
}
