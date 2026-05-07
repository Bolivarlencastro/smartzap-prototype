export default class UsersElements {
  static userAccessButton() {
    return cy.get('[data-test="nav-item-users"]').should('be.visible');
  }

  static userSearch() {
    return cy.get('[placeholder="Pesquise por usuário, celular ou email"]').should('be.visible');
  }

  static buttonDeleteUser() {
    return cy.get('[data-test="button-delete-user-on-smartzap"]').should('be.visible');
  }

  static confirmButton() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static userSelectors() {
    return cy.get('app-user-list').should('be.visible');
  }

  static buttonEditUser() {
    return cy.get('[data-test="button-edit-user-on-smartzap"]').should('be.visible');
  }

  static inputUserNumber() {
    return cy.get('[data-test="input-phone"]').should('be.visible');
  }

  static inputUserName() {
    return cy.get('[data-test="input-name"]').should('be.visible');
  }

  static inputUserEmail() {
    return cy.get('[data-test="input-email"]').should('be.visible');
  }

  static inputUserTag() {
    return cy.get('[data-test="input-tag"]').should('be.visible');
  }

  static editUserConfirmButton() {
    return cy.get('[data-test="button-ok"]').should('be.visible');
  }

  static userListSelector() {
    return cy.get('[role="table"]').should('be.visible');
  }

  static userCountrySelector() {
    return cy.get('kp-phone-input > div > button').should('be.visible');
  }

  static userCountryOptionSelector() {
    return cy.get('[role="menuitem"]').should('be.visible');
  }
}
