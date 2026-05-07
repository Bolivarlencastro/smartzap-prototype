/// <reference types="cypress" />
import ClassroomElements from '../elements/classroom-elements';
import * as StatusCode from '../constants/status-code';
import { Interception } from 'cypress/types/net-stubbing';

Cypress.Commands.add('ClassroomNextStep', () => {
  cy.intercept('**/kontent/learn-content/**').as('loadContent');
  return ClassroomElements.nextContent().click().wait('@loadContent');
});

Cypress.Commands.add('ClassroomNextContentQuiz', () => {
  cy.intercept('/konquest/exams/**').as('loadQuiz');
  return ClassroomElements.nextContent().click({ force: true }).wait('@loadQuiz');
});

Cypress.Commands.add('ClassroomPlayContentVideo', (timeConsume = 15000) => {
  return ClassroomElements.playVideo().click({ force: true }).wait(timeConsume); // aguarda video ser executado
});

Cypress.Commands.add('ClassroomViewContentImage', () => {
  return ClassroomElements.viewImage()
    .wait(18000)
    .click({ force: true })
    .then(() => cy.ClassroomCloseImage());
});

Cypress.Commands.add('ClassroomFinishCourse', () => {
  cy.intercept('**/finish').as('finishCourse');
  cy.url().should('contain', '/finish');
  ClassroomElements.buttonFinishCourse().click();
  ClassroomElements.buttonConfirm().click().wait('@finishCourse');
});

Cypress.Commands.add('ClassroomSurveySatisfaction', () => {
  ClassroomElements.surveySatisfactionQ1();
  ClassroomElements.surveySatisfactionQ2();
  ClassroomElements.surveySatisfactionQ3();
  ClassroomElements.surveySatisfactionQ4();
  ClassroomElements.surveySatisfactionQ5();
  ClassroomElements.surveySatisfactionQ6();
  ClassroomElements.surveySatisfactionQ7();
  ClassroomElements.surveySatisfactionQ8();
  ClassroomElements.surveySatisfactionQText().type('comment in course automated');
  ClassroomElements.buttonConfirm().click();
});

Cypress.Commands.add('ClassroomVerifyCertificate', () => {
  cy.intercept('**/certificates').as('loadCertificate');
  ClassroomElements.buttonGetCertificate().click();
  cy.wait('@loadCertificate').then((response) => {
    expect(response.response.statusCode).eq(StatusCode.OK);
    expect(response.response.body).to.have.property('certificate_url');
    ClassroomElements.certificateIframe().should('be.visible');
  });
});

Cypress.Commands.add('ClassroomCloseImage', () => {
  ClassroomElements.closeImage().click();
});

Cypress.Commands.add('ClassroomQuizOptionCorrect', () => {
  cy.intercept('/konquest/exams/**').as('loadQuiz').wait('@loadQuiz');
  ClassroomElements.quizOptionCorrect()
    .contains('resp 1')
    .should('be.visible')
    .click()
    .then(() => cy.ClassroomQuizConfirmOptionAndNext());
});

Cypress.Commands.add('ClassroomQuizConfirmOption', () => {
  ClassroomElements.quizConfirmOption().click();
});

Cypress.Commands.add('ClassroomQuizConfirmOptionAndNext', () => {
  cy.intercept('/konquest/exams/**').as('loadQuiz');
  cy.ClassroomQuizConfirmOption()
    .wait('@loadQuiz')
    .then((response) => {
      if (response.response.statusCode == 200) {
        expect(response.response.statusCode).eq(StatusCode.OK);
      } else {
        expect(response.response.statusCode).eq(StatusCode.Created);
      }
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.ClassroomQuizNextQuestion();
    });
});

Cypress.Commands.add('ClassroomNextFinishQuiz', () => {
  ClassroomElements.nextContentFinishQuiz().click();
});

Cypress.Commands.add('ClassroomQuizNextQuestion', () => {
  ClassroomElements.quizNextQuestion().click();
});

Cypress.Commands.add('CloseClassroom', () => {
  ClassroomElements.buttonExitClassroom().click();
  ClassroomElements.buttonConfirm().click();
});

Cypress.Commands.add('ClassroomOpenVerify', () => {
  return ClassroomElements.nextContent();
});

Cypress.Commands.add('ClassroomPlayContentVideoVimeo', (timeConsume = 15000) => {
  ClassroomElements.contentVimeoAvailableClassroom();
  ClassroomElements.playVimeoClassroom().click();
  return cy.wait(timeConsume); // aguarda video ser executado
});

Cypress.Commands.add('ClassroomConsumeMissionWithVideo', () => {
  cy.ClassroomNextStep();
  cy.ClassroomPlayContentVideo(10000);
  ClassroomElements.nextContent().click();
  cy.ClassroomSurveySatisfaction();
  cy.ClassroomFinishCourse();
  return cy.ClassroomVerifyCertificate();
});

Cypress.Commands.add('ClassroomStartCourseMobile', () => {
  cy.intercept('/konquest/users/mission-stages').as('loadContent');
  return ClassroomElements.nextContentMobile().click().wait('@loadContent');
});

Cypress.Commands.add('ClassroomNextContentMobile', () => {
  cy.intercept('/kontent/learn-content/**').as('loadLearnContent');
  return ClassroomElements.nextContentMobile().click().wait('@loadLearnContent');
});

Cypress.Commands.add('ClassroomChangeGoalDate', (goalDate) => {
  cy.intercept('PATCH', '**/mission-enrollments/**').as('updateGoalDate');
  cy.GetMetaDataSelectorAndClick('progress-panel-button');
  cy.GetMetaDataSelectorAndClick('goal-date-edit-button-on-classroom');
  const [day] = goalDate.split('/');
  ClassroomElements.daySelectorOnGoalDate().contains(day).click();
  ClassroomElements.confirmNewGoalDate().click();
  cy.wait('@updateGoalDate').its('response.statusCode').should('eq', StatusCode.OK);
  return ClassroomElements.progressPanel().contains(goalDate);
});

declare global {
  namespace Cypress {
    interface Chainable {
      ClassroomNextStep(): Chainable<Interception>;
      ClassroomNextContentQuiz(): Chainable<Interception>;
      ClassroomPlayContentVideo(timeConsume?: number): Chainable<JQuery<HTMLElement>>;
      ClassroomViewContentImage(): Chainable<JQuery<HTMLElement>>;
      ClassroomFinishCourse(): Chainable<JQuery<HTMLElement>>;
      ClassroomSurveySatisfaction(): Chainable<JQuery<HTMLElement>>;
      ClassroomVerifyCertificate(): Chainable<JQuery<HTMLElement>>;
      ClassroomCloseImage(): Chainable<JQuery<HTMLElement>>;
      ClassroomQuizOptionCorrect(): Chainable<JQuery<HTMLElement>>;
      ClassroomQuizConfirmOption(): Chainable<JQuery<HTMLElement>>;
      ClassroomQuizConfirmOptionAndNext(): Chainable<JQuery<HTMLElement>>;
      ClassroomNextFinishQuiz(): Chainable<JQuery<HTMLElement>>;
      ClassroomQuizNextQuestion(): Chainable<JQuery<HTMLElement>>;
      CloseClassroom(): Chainable<JQuery<HTMLElement>>;
      ClassroomOpenVerify(): Chainable<JQuery<HTMLElement>>;
      ClassroomPlayContentVideoVimeo(timeConsume?: number): Chainable<Interception>;
      ClassroomConsumeMissionWithVideo(): Chainable<JQuery<HTMLElement>>;
      ClassroomStartCourseMobile(): Chainable<Interception>;
      ClassroomNextContentMobile(): Chainable<Interception>;
      ClassroomChangeGoalDate(goalDate: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
