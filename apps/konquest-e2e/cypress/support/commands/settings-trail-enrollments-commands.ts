/// <reference types="cypress" />
import { Interception } from 'cypress/types/net-stubbing';
import * as StatusCode from '../../support/constants/status-code';
import SettingsElements from '../elements/settings-elements';
import SettingsEnrollmentsElements from '../elements/settings-enrollments-elements';
import * as util from '../constants/utils';

Cypress.Commands.add('SettingsTrailEnrollmentsAccess', () => {
  cy.intercept('**/learning-trail-enrollments**').as('loadTrailEnrollments');
  SettingsElements.buttonAdmin().click();
  SettingsEnrollmentsElements.buttonNavEnrollments().click();
  SettingsEnrollmentsElements.buttonSettingsEnrollmentsTrails().click();
  cy.wait('@loadTrailEnrollments', { timeout: 10000 });
  return SettingsEnrollmentsElements.trailRow().should('be.visible');
});

Cypress.Commands.add('SettingsTrailEnrollmentsReenroll', () => {
  cy.intercept('**/learning-trail-enrollments').as('trailReenroll');
  SettingsEnrollmentsElements.trailEnrollmentMenu().click();
  cy.SettingsEnrollmentsOptionReenroll();
  cy.SettingsEnrollmentsGoalDate();
  cy.SettingsEnrollmentsConfirmReenroll();
  return cy.wait('@trailReenroll').then((response) => {
    expect(response.response.statusCode).eq(StatusCode.Created);
  });
});

Cypress.Commands.add('SettingsTrailsEnrollmentsApprove', () => {
  SettingsEnrollmentsElements.trailEnrollmentMenu().click();
  cy.SettingsEnrollmentsOptionApprove();
  cy.SettingsEnrollmentsInputPerformance(util.MAX_PERFORMANCE);
  cy.SettingsEnrollmentsConfirmApprove();
});

Cypress.Commands.add('SettingsTrailsEnrollmentsReprove', () => {
  SettingsEnrollmentsElements.trailEnrollmentMenu().click();
  cy.SettingsEnrollmentsOptionApprove();
  cy.SettingsEnrollmentsConfirmApprove();
});

declare global {
  namespace Cypress {
    interface Chainable {
      SettingsTrailEnrollmentsAccess(): Chainable<JQuery<HTMLElement>>;
      SettingsTrailEnrollmentsReenroll(): Chainable<Interception>;
      SettingsTrailsEnrollmentsApprove(): Chainable<Interception>;
      SettingsTrailsEnrollmentsReprove(): Chainable<Interception>;
    }
  }
}
