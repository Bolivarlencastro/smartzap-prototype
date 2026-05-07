/// <reference types="cypress" />
import SettingsEnrollmentsElements from '../elements/settings-enrollments-elements';
import EnrollsMissionsElements from '../elements/enrolls-missions-elements';
import { getDateTodayBR } from '../commands';
import * as StatusCode from '../constants/status-code';
import { Interception } from 'cypress/types/net-stubbing';
import * as util from '../../support/constants/utils';
import SettingsElements from '../elements/settings-elements';

Cypress.Commands.add('SettingsEnrollmentsAccess', () => {
  cy.intercept('**/mission-enrollments**').as('loadEnrollments');
  SettingsElements.buttonAdmin().click();
  SettingsEnrollmentsElements.buttonNavEnrollments().click();
  SettingsEnrollmentsElements.buttonEnrollmentsOnNav().click();
  return cy.wait('@loadEnrollments');
});

Cypress.Commands.add('SettingsEnrollmentsRejectCertificate', (text) => {
  cy.EnrollmentsMenuOptionsMission();
  cy.SettingsEnrollmentsButtonRejectCertificate();
  cy.SettingsEnrollmentsMotiveRejectCertificate(text);
  cy.SettingsEnrollmentsConfirmReject();
});

Cypress.Commands.add('SettingsEnrollmentsMotiveRejectCertificate', (text) => {
  SettingsEnrollmentsElements.motiveRejectCertificate().type(text);
});

Cypress.Commands.add('SettingsEnrollmentsButtonRejectCertificate', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('Rejeitar').should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsConfirmReject', () => {
  cy.intercept('/konquest/mission-enrollments/**/external-validate').as('loadStatus');
  SettingsEnrollmentsElements.confirmReject().click().wait('@loadStatus');
});

Cypress.Commands.add('SettingsEnrollmentsApproveCertificate', () => {
  cy.EnrollmentsMenuOptionsMission();
  cy.SettingsEnrollmentsOptionApprove();
  cy.SettingsEnrollmentsInputPerformance(util.MAX_PERFORMANCE);
  cy.SettingsEnrollmentsConfirmApproveCertificate();
});

Cypress.Commands.add('SettingsEnrollmentsConfirmApproveCertificate', () => {
  cy.intercept('**/external-validate').as('loadExternalValidate');
  SettingsEnrollmentsElements.confirmApproveCertificate().click().wait('@loadExternalValidate');
});

Cypress.Commands.add('SettingsEnrollmentsHistoric', () => {
  cy.EnrollmentsMenuOptionsMission().SettingsEnrollmentsOptionHistoric().SettingsEnrollmentsVerifyHistoric();
});

Cypress.Commands.add('SettingsEnrollmentsOptionHistoric', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('Histórico').should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsVerifyHistoric', () => {
  SettingsEnrollmentsElements.titleHistoricEnroll().contains('Histórico da matrícula').should('be.visible');
});

Cypress.Commands.add('SettingsEnrollmentsDelete', () => {
  cy.EnrollmentsMenuOptionsMission().SettingsEnrollmentsOptionDelete().SettingsEnrollmentsConfirmDelete();
});

Cypress.Commands.add('SettingsEnrollmentsOptionDelete', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('Excluir').should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsConfirmDelete', () => {
  cy.intercept('**/mission-enrollments/**').as('deleteMission');
  SettingsEnrollmentsElements.confirmDeleteEnrollment().click().wait('@deleteMission');
});

Cypress.Commands.add('SettingsEnrollmentsNotFound', (enrollNotFound) => {
  SettingsEnrollmentsElements.fieldEmptyEnrollment().contains(enrollNotFound).should('be.visible');
});

Cypress.Commands.add('SettingsEnrollmentsApprove', (performance) => {
  cy.EnrollmentsMenuOptionsMission();
  cy.SettingsEnrollmentsOptionApprove();
  cy.SettingsEnrollmentsInputPerformance(performance);
  cy.SettingsEnrollmentsConfirmApprove();
});

Cypress.Commands.add('SettingsEnrollmentsChangePerformance', (performance) => {
  cy.EnrollmentsMenuOptionsMission();
  cy.SettingsEnrollmentsOptionApprove();
  cy.SettingsEnrollmentsInputPerformance(performance);
  cy.SettingsEnrollmentsConfirmChangePerformance();
});
Cypress.Commands.add('SettingsEnrollmentsOptionApprove', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('Aprovar').should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsInputPerformance', (performance) => {
  SettingsEnrollmentsElements.inputEnrollmentPerformance().clear().type(performance);
});

Cypress.Commands.add('SettingsEnrollmentsConfirmApprove', () => {
  cy.intercept('**/manual-finish').as('loadManualFinish');
  SettingsEnrollmentsElements.confirmApprove().click().wait('@loadManualFinish');
});

Cypress.Commands.add('SettingsEnrollmentsConfirmChangePerformance', () => {
  cy.intercept('**/change-performance').as('loadChangePerformance');
  SettingsEnrollmentsElements.confirmApprove().click().wait('@loadChangePerformance');
});

Cypress.Commands.add('SettingsEnrollmentsViewActivities', () => {
  cy.EnrollmentsMenuOptionsMission();
  cy.SettingsEnrollmentsOptionViewActivities();
});

Cypress.Commands.add('SettingsEnrollmentsOptionViewActivities', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('atividades').should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsVerifyActivitiesEmpty', (consume = '0') => {
  SettingsEnrollmentsElements.tableViewActivitiesEmpty().contains(consume).should('be.visible');
});

Cypress.Commands.add('SettingsEnrollmentsRestart', () => {
  cy.EnrollmentsMenuOptionsMission()
    .then(() => EnrollsMissionsElements.menuOptionsMission().dblclick({ force: true }))
    .SettingsEnrollmentsOptionRestart()
    .SettingsEnrollmentsGoalDate()
    .SettingsEnrollmentsConfirmRestart();
});

Cypress.Commands.add('SettingsEnrollmentsOptionRestart', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('Reiniciar').should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsGoalDate', () => {
  SettingsEnrollmentsElements.fieldGoalDateEnrollment().type(getDateTodayBR());
});

Cypress.Commands.add('SettingsEnrollmentsConfirmRestart', () => {
  cy.intercept('**/restart').as('loadRestart');
  SettingsEnrollmentsElements.confirmRestart().click().wait('@loadRestart');
});

Cypress.Commands.add('SettingsEnrollmentsReenroll', () => {
  cy.EnrollmentsMenuOptionsMission()
    .SettingsEnrollmentsOptionReenroll()
    .SettingsEnrollmentsGoalDate()
    .SettingsEnrollmentsConfirmReenroll();
});

Cypress.Commands.add('SettingsEnrollmentsOptionReenroll', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains(util.RE_ENROLL).should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsConfirmReenroll', () => {
  SettingsEnrollmentsElements.confirmReenroll().click();
});

Cypress.Commands.add('SettingsEnrollmentsMenuOptionFirst', () => {
  return EnrollsMissionsElements.menuOptionsMission().first().click();
});

Cypress.Commands.add('SettingsEnrollmentsAll', () => {
  cy.SettingsEnrollmentsMenuOptionFirst().SettingsEnrollmentsOptionAllEnrollments();
});

Cypress.Commands.add('SettingsEnrollmentsOptionAllEnrollments', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('Todas Matrículas').should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsAllVerify', () => {
  SettingsEnrollmentsElements.titleAllEnrollments()
    .contains(util.ALL_ENROLLMENTS_FOR_THIS_COURSE)
    .should('be.visible')
    .then(() => {
      SettingsEnrollmentsElements.tableAllEnrollments().should('have.length', 2);
    });
});

Cypress.Commands.add('SettingsEnrollmentsRetake', () => {
  cy.EnrollmentsMenuOptionsMission()
    .then(() => EnrollsMissionsElements.menuOptionsMission().dblclick({ force: true }))
    .SettingsEnrollmentsOptionRetake()
    .SettingsEnrollmentsGoalDate()
    .SettingsEnrollmentsConfirmRetake();
});

Cypress.Commands.add('SettingsEnrollmentsOptionRetake', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('Retomar').should('be.visible').click();
});

Cypress.Commands.add('SettingsEnrollmentsConfirmRetake', () => {
  cy.intercept('**/retake').as('loadRetake');
  SettingsEnrollmentsElements.confirmRetake().click().wait('@loadRetake');
});

declare global {
  namespace Cypress {
    interface Chainable {
      SettingsEnrollmentsAccess(): Chainable<Interception>;
      SettingsEnrollmentsRejectCertificate(text: string): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsMotiveRejectCertificate(text: string): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsButtonRejectCertificate(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsConfirmReject(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsConfirmApproveCertificate(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsHistoric(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsOptionHistoric(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsVerifyHistoric(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsDelete(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsOptionDelete(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsConfirmDelete(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsNotFound(enrollNotFound: string): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsApprove(performance: string): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsOptionApprove(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsInputPerformance(performance: string): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsChangePerformance(performance: string): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsConfirmApprove(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsConfirmChangePerformance(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsViewActivities(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsOptionViewActivities(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsVerifyActivitiesEmpty(consume?: string): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsRestart(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsOptionRestart(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsGoalDate(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsConfirmRestart(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsReenroll(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsOptionReenroll(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsConfirmReenroll(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsMenuOptionFirst(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsAll(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsOptionAllEnrollments(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsAllVerify(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsApproveCertificate(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsRetake(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsOptionRetake(): Chainable<JQuery<HTMLElement>>;
      SettingsEnrollmentsConfirmRetake(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
