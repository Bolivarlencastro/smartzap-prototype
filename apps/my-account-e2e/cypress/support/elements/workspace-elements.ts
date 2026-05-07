export default class WorkspaceElements {
  static card(workspace) {
    return cy.get(`mat-card`).contains(`${workspace}`);
  }
}
