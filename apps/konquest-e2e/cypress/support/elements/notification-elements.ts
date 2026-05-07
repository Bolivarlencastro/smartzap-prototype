export default class NotificationElements {
  static buttonOpenNotification() {
    return cy.get('#button-notification-open');
  }

  static buttonCloseNotification() {
    return cy.get('a .mat-icon').contains('close');
  }
}
