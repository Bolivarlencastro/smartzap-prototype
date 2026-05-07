export default class GroupElements {
  static createGroupButton() {
    return cy.get('[data-test="new-group"]').should('be.visible');
  }
  static inputGroupName() {
    return cy.get('[data-cy="group-dialog-name-input"]').should('be.visible');
  }

  static okButtonNewGroup() {
    return cy.get('[data-cy="group-dialog-ok-button"]');
  }
  static cancelButtonNewGroup() {
    return cy.get('mat-dialog-container').find('button').contains('Cancelar');
  }
  static tableGroups() {
    return cy.get('cdk-table');
  }
  static rowsGroups() {
    return GroupElements.tableGroups().find('cdk-row').should('be.visible');
  }
  static columnName(name) {
    return GroupElements.rowsGroups().find('cdk-cell.cdk-column-name').should('have.text', name);
  }
  static columnActions() {
    return GroupElements.rowsGroups().find('cdk-cell.cdk-column-actions');
  }
  static columnTrails() {
    return GroupElements.rowsGroups().find('cdk-cell.cdk-column-trails');
  }
  static columnChannels() {
    return GroupElements.rowsGroups().find('cdk-cell.cdk-column-channels');
  }
  static columnMissions() {
    return GroupElements.rowsGroups().find('cdk-cell.cdk-column-missions');
  }
  static columnUsers() {
    return GroupElements.rowsGroups().find('cdk-cell.cdk-column-users');
  }

  static actionOpen(name: string) {
    return cy.contains('cdk-row', name).find('mat-icon').contains('launch');
  }

  static openChannelsTabs(name: string) {
    return cy.get('.mat-mdc-tab-link, .mat-tab-link').contains(name);
  }

  static floatButton() {
    return cy.get('[data-cy=float-button]').should('be.visible');
  }

  static erroMessageForm() {
    return cy.get('.mat-mdc-form-field-error');
  }

  static inputSearch() {
    return cy.get('input[data-test="global-search-input"]').should('be.visible');
  }

  static modal() {
    return cy.get('mat-dialog-container');
  }

  static modalInputSearch() {
    return cy.get('mat-dialog-container').find('input[data-test="global-search-input"]');
  }

  static modalRow() {
    return cy.get('mat-row');
  }

  static modalFirstRow() {
    return cy.get('mat-row').first().should('be.visible');
  }

  static modalRowCheckbox() {
    return GroupElements.modalFirstRow().find('input');
  }

  static modalButtonSave() {
    return GroupElements.modal().find('button').contains('Vincular', { matchCase: false }).parents('button');
  }

  static groupScroll() {
    return cy.get(`#container-3 > .ps__rail-y`);
  }

  static importUsers() {
    return cy.get('[data-test="import-users"]');
  }

  static importMissions() {
    return cy.get('[data-test="import-missions"]').should('be.visible');
  }

  static importChannels() {
    return cy.get('[data-test="import-channels"] > div > input');
  }

  static buttonImportChannels() {
    return cy.get('[data-test="import-channels"]').should('be.visible');
  }

  static uploadSheet() {
    return cy.get('app-group-import-dialog [data-test="upload-sheet"]');
  }

  static confirmUploadImport() {
    return cy.get('mat-dialog-actions > button').should('be.visible');
  }

  static optionMenuGroup() {
    return cy.get('[data-cy="collection-item-menu"]').should('be.visible');
  }

  static buttonDeleteGroup() {
    return cy.get('[data-test="collection-item-menu-remove"]').should('be.visible');
  }

  static buttonConfirmDeleteGroup() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static buttonGroupVerticalAccess() {
    return cy.get('div span').contains('Grupos').should('be.visible');
  }

  static groupsTabVisible() {
    return cy.get('[data-test="groups-nav-bar-navigate"]').should('be.visible');
  }

  static groupsNavBarNavigate() {
    return cy.get('[data-test="groups-nav-bar-navigate"]').should('be.visible');
  }

  static confirmLinkToGroup() {
    return cy.get('mat-dialog-actions div button').contains('Vincular').should('be.visible');
  }

  static checkboxEnrollmentGroupBySheet() {
    return cy.get('#input-settings-groups-enroll-input');
  }

  static goalDateEnrollmentGroupBySheet() {
    return cy.get('#input-settings-groups-goal-date').should('exist');
  }

  static buttonNavGroups() {
    return cy.get('[data-test="nav-link-groups"]').should('be.visible');
  }

  static tableItens() {
    return cy.get('[role="row"]').should('be.visible');
  }

  static checkErollmentGroupBySheet() {
    return cy.get('#input-settings-groups-enroll-button').should('be.visible');
  }

  static groupsContainer() {
    return cy.get('[data-test="groups-nav-bar-navigate"]').should('be.visible');
  }
}
