export default class TransferManagementElements {
  static transferManagementAccess() {
    return cy.get('[data-test="nav-link-transfers"]').should('be.visible').click();
  }

  static transferManagementSearchMission() {
    return cy.get('kp-global-search-input').should('be.visible');
  }

  static listFieldsTransfer() {
    return cy.get('[role="table"] [role="row"]');
  }
}
