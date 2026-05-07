/// <reference types="cypress" />

import EnrollsMissionsElements from '../elements/enrolls-missions-elements';
import SettingsEnrollmentsElements from '../elements/settings-enrollments-elements';
import ClassroomElements from '../elements/classroom-elements';
import * as util from '../../support/constants/utils';
import { Interception } from 'cypress/types/net-stubbing';
import MissionElements from '../elements/mission-elements';

Cypress.Commands.add('EnrollmentsAccess', () => {
  cy.intercept('**/mission-enrollments/**').as('listEnrollments');
  EnrollsMissionsElements.buttonEnrollments();
  cy.url().should('include', '/enrollments/missions');
  cy.wait('@listEnrollments');
});

Cypress.Commands.add('EnrollmentsAccessDirectly', () => {
  cy.intercept('**/mission-enrollments**').as('listEnrollments');
  cy.intercept('**/gamification').as('listGamification');
  cy.visit(`/${util.WORKSPACE_DEFAULT}/enrollments/missions`);
  cy.wait('@listEnrollments');
  cy.wait('@listGamification');
});

Cypress.Commands.add('EnrollmentsAccessMobile', () => {
  cy.intercept('**/mission-enrollments**').as('listEnrollments');
  EnrollsMissionsElements.buttonTouchTargetMobile().click();
  EnrollsMissionsElements.buttonEnrollments();
  cy.wait('@listEnrollments');
});

Cypress.Commands.add('EnrollmentsSearchMission', (mission) => {
  cy.intercept('**/mission-enrollments/**search**').as('SearchListEnrollments');
  EnrollsMissionsElements.inputSearchEnrollmentsMissions().clear().type(`${mission}`, { delay: 500 });
  return cy.wait('@SearchListEnrollments').then(() => {
    MissionElements.MissionNameListEnrollments().should('be.visible').contains(mission);
  });
});

Cypress.Commands.add('EnrollmentsVerifyMission', (mission) => {
  return EnrollsMissionsElements.enrollmentRow().contains(mission).should('be.visible');
});

Cypress.Commands.add('EnrollmentsNavBarAcess', () => {
  return EnrollsMissionsElements.navBarButton().click({ force: true });
});

Cypress.Commands.add('EnrollmentsMenuOptionsMission', () => {
  // EnrollsMissionsElements.tableMissionEnrollments().scrollTo('right');
  return EnrollsMissionsElements.menuOptionsMission().click();
});

Cypress.Commands.add('EnrollmentsConfirmClassroom', () => {
  EnrollsMissionsElements.listOptionsInEnrollment().contains(util.VIEW_MISSION).click();
  EnrollsMissionsElements.openMissionContinue().click();
});

Cypress.Commands.add('EnrollmentsOpenClassroom', () => {
  cy.intercept('**/stages').as('loadClassroom');
  cy.EnrollmentsMenuOptionsMission();
  cy.EnrollmentsConfirmClassroom().wait('@loadClassroom');
});

Cypress.Commands.add('EnrollmentsOpenClassroomMobile', () => {
  cy.intercept('**/stages').as('loadClassroom');
  EnrollsMissionsElements.menuOptionsMission().click();
  cy.EnrollmentsConfirmClassroom().wait('@loadClassroom');
});

Cypress.Commands.add('EnrollmentsVerifyStatus', (status) => {
  EnrollsMissionsElements.menuOptionsMission().first().focus();
  return EnrollsMissionsElements.enrollmentStatus().contains(status).should('be.visible');
});

Cypress.Commands.add('EnrollmentsOptionFinishMission', () => {
  SettingsEnrollmentsElements.optionEnrollment().contains('Finalizar').should('be.visible').click();
});

Cypress.Commands.add('EnrollmentsFinishMission', (certificate) => {
  cy.EnrollmentsMenuOptionsMission();
  cy.EnrollmentsOptionFinishMission();
  cy.ClassroomSurveySatisfaction();
  cy.EnrollmentsUploadCertificate(certificate);
});

Cypress.Commands.add('EnrollmentsConfirmFeedback', () => {
  cy.intercept('**/konquest/missions/evaluations').as('loadEvaluations');
  ClassroomElements.buttonConfirm().click().wait('@loadEvaluations');
});

Cypress.Commands.add('EnrollmentsUploadCertificate', (certificate) => {
  return EnrollsMissionsElements.enrollmentUploadCertificate()
    .selectFile(certificate, { force: true })
    .then(() => cy.EnrollmentsSendCertificate());
});

Cypress.Commands.add('EnrollmentsSendCertificate', () => {
  cy.intercept('/konquest/mission-enrollments/**/external-review').as('loadEnrollments');
  EnrollsMissionsElements.sendCertificate().click().wait('@loadEnrollments');
});

Cypress.Commands.add('EnrollmentsGiveUp', (textGiveUp) => {
  cy.EnrollmentsMenuOptionsMission();
  cy.EnrollmentsOptionGiveUp();
  cy.EnrollmentsMotiveGiveUp(textGiveUp);
});

Cypress.Commands.add('EnrollmentsOptionGiveUp', () => {
  EnrollsMissionsElements.listOptionsInEnrollment().contains(util.TO_GIVE_UP).click();
});

Cypress.Commands.add('EnrollmentsMotiveGiveUp', (textGiveUp) => {
  EnrollsMissionsElements.motiveGiveUp().click().type(textGiveUp);
  EnrollsMissionsElements.confirmGiveUp().click();
});

Cypress.Commands.add('EnrollmentsContinueMission', () => {
  cy.intercept('**/stages').as('loadClassroom');
  cy.EnrollmentsMenuOptionsMission();
  EnrollsMissionsElements.listOptionsInEnrollment().contains(util.CONTINUE_MISSION).click();
  EnrollsMissionsElements.openMissionContinue().click();
  return cy.wait('@loadClassroom');
});

Cypress.Commands.add('EnrollmentsGetCertificate', () => {
  // EnrollsMissionsElements.tableMissionEnrollments().scrollTo('right');
  EnrollsMissionsElements.buttonEnrollmentsGetCertificate().click();
  EnrollsMissionsElements.buttonEnrollmentsGenerateCertificate().click();
});

Cypress.Commands.add('EnrollmentsStartCourseMobile', () => {
  cy.intercept('**/stages').as('loadClassroom');
  EnrollsMissionsElements.actionButtonOnEnrollmentMobile(util.VIEW_MISSION).click();
  EnrollsMissionsElements.actionButtonOnCardMobile(util.OPEN).click().wait('@loadClassroom');
});

Cypress.Commands.add('EnrollmentsContinueMissionMobile', () => {
  cy.intercept('**/stages').as('loadClassroom');
  EnrollsMissionsElements.actionButtonOnEnrollmentMobile(util.CONTINUE_MISSION).click();
  EnrollsMissionsElements.actionButtonOnCardMobile(util.OPEN).click().wait('@loadClassroom');
});
declare global {
  namespace Cypress {
    interface Chainable {
      EnrollmentsAccess(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsAccessDirectly(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsSearchMission(mission: string): Chainable<Interception>;
      EnrollmentsVerifyMission(mission: string): Chainable<JQuery<HTMLElement>>;
      EnrollmentsNavBarAcess(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsMenuOptionsMission(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsConfirmClassroom(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsOpenClassroom(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsVerifyStatus(enrollment: string): Chainable<JQuery<HTMLElement>>;
      EnrollmentsOptionFinishMission(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsFinishMission(certificate: FileReference): Chainable<JQuery<HTMLElement>>;
      EnrollmentsConfirmFeedback(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsUploadCertificate(certificate: FileReference): Chainable<JQuery<HTMLElement>>;
      EnrollmentsSendCertificate(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsGiveUp(text: string): Chainable<JQuery<HTMLElement>>;
      EnrollmentsOptionGiveUp(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsMotiveGiveUp(text: string): Chainable<JQuery<HTMLElement>>;
      EnrollmentsContinueMission(): Chainable<Interception>;
      EnrollmentsGetCertificate(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsAccessMobile(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsStartCourseMobile(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsContinueMissionMobile(): Chainable<JQuery<HTMLElement>>;
      EnrollmentsOpenClassroomMobile(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
