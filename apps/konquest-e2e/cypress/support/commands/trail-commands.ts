import TrailElements from '../elements/trail-elements';
import EnrollsTrailElements from '../elements/enrolls-trail-elements';
import PulseElements from '../elements/pulse-elements';
import { getDateTodayBR } from '../commands';
import { Interception } from 'cypress/types/net-stubbing';
import * as StatusCode from '../../support/constants/status-code';
import SharedCreationElements from '../elements/shared-creation-elements';

Cypress.Commands.add('TrailCreate', (trailDefault) => {
  cy.TrailAccess();
  cy.TrailNew();
  cy.TrailCreateStepInformation(trailDefault).then((response) => {
    cy.TrailCreateStepImage();
    cy.TrailCreateStepContent(trailDefault.contentInTrail);
    TrailElements.buttonFinishTrail().click();
    cy.wrap(response);
  });
});

Cypress.Commands.add('TrailNew', () => {
  SharedCreationElements.sharedCreateButton().click();
  return SharedCreationElements.buttonCreateTrail().click();
});

Cypress.Commands.add('TrailCreateStepInformation', (trailDefault) => {
  cy.TrailFillName(trailDefault.name);
  cy.TrailFillType(trailDefault.type);
  cy.TrailFillLanguage(trailDefault.language);
  cy.TrailFillDescription(trailDefault.description);
  cy.TrailFillExpirationDate(trailDefault.expiration_date);
  cy.TrailFillStatus(trailDefault.is_active);
  return cy.TrailConfirmInformation();
});

Cypress.Commands.add('TrailFillName', (name) => {
  return TrailElements.fieldNameTrail().type(name);
});

Cypress.Commands.add('TrailFillType', (type) => {
  TrailElements.fieldTypeTrail()
    .click()
    .then(() => {
      return TrailElements.trailType().contains(type).click();
    });
});

Cypress.Commands.add('TrailFillLanguage', (language) => {
  if (language == 'Português') {
    return TrailElements.fieldLanguagesTrail()
      .click()
      .then(() => {
        TrailElements.trailLanguage().contains(language).click();
      });
  }
});

Cypress.Commands.add('TrailFillDescription', (description) => {
  return TrailElements.fieldDescriptionTrail().type(description);
});

Cypress.Commands.add('TrailConfirmInformation', () => {
  cy.intercept('**learning-trails**').as('trailCreated');
  cy.TrailClickConfirmInformation()
    .wait('@trailCreated')
    .then((request) => {
      expect(request.response.statusCode).equal(201);
      expect(request.response.body.id).not.to.be.empty;
      cy.log('Trail Created');
      const createdTrail = request.response.body;
      return cy.wrap(createdTrail);
    });
});

Cypress.Commands.add('TrailClickConfirmInformation', () => {
  return TrailElements.buttonConfirmInformation().click();
});

Cypress.Commands.add('TrailCreateStepContent', (contentInTrail) => {
  return cy.TrailFieldSearchPulseOrMission(contentInTrail).TrailConfirmPulseOrMission().TrailConfirmContent();
});

Cypress.Commands.add('TrailFieldSearchPulseOrMission', (contentInTrail) => {
  cy.intercept(`**available-contents?search=${contentInTrail}`).as('ContentSearching');
  TrailElements.fieldSearchPulseOrMission()
    .click({ force: true })
    .type('{selectall}{backspace}')
    .type(contentInTrail)
    .wait('@ContentSearching');
  return TrailElements.fieldMissionInTrailSearched().contains(contentInTrail).click();
});

Cypress.Commands.add('TrailConfirmPulseOrMission', () => {
  cy.intercept(`**/learning-trails/steps`).as('LoadStepContent');
  return TrailElements.fieldConfirmAddPulseOrMission().click().wait('@LoadStepContent');
});

Cypress.Commands.add('TrailConfirmContent', () => {
  return TrailElements.buttonConfirmStepContent().click();
});

Cypress.Commands.add('TrailSearch', (trailName) => {
  cy.intercept('**=&search=**').as('SearchTrail');
  return TrailElements.fieldSearchTrail().last().type(`${trailName}{enter}`, { force: true }).wait('@SearchTrail');
});

Cypress.Commands.add('TrailSearchMobile', (trailName) => {
  cy.intercept('**=&search=**').as('SearchTrail');
  TrailElements.trailSearchMobile().clear().type(`${trailName}{enter}`, { force: true });
  return cy.wait('@SearchTrail');
});

Cypress.Commands.add('TrailVerifyNumberMissionOnPopUp', (numberContents) => {
  return TrailElements.IconNumberMissionOnPopUp().contains(numberContents).should('be.visible');
});

Cypress.Commands.add('TrailVerifyNumberPulseOnPopUp', (numberContents) => {
  return TrailElements.IconNumberPulseOnPopUp().contains(numberContents).should('be.visible');
});

Cypress.Commands.add('TrailVerifyCardActive', () => {
  return TrailElements.IconCardActive();
});

Cypress.Commands.add('TrailOpenCard', (trailName) => {
  return TrailElements.CardTrail().contains(trailName).click();
});

Cypress.Commands.add('TrailOpenCardMobile', (trailName) => {
  return TrailElements.trailCardMobile().contains(trailName).click({ force: true });
});

Cypress.Commands.add('TrailVerifyTypeCard', (statusType) => {
  if (statusType == 'Aberta') {
    return TrailElements.typeStatusCardOpen().contains(statusType).should('be.visible');
  }
  if (statusType == 'Fechada') {
    return TrailElements.typeStatusCardClosed().contains(statusType).should('be.visible');
  } else {
    return null;
  }
});

Cypress.Commands.add('TrailCreatedByMe', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.TrailAccess();
  return TrailElements.buttonTrailCreatedByme().click();
});

Cypress.Commands.add('TrailFillStatus', (is_active) => {
  if (is_active === false) {
    TrailElements.checkboxStatusTrail().click({ force: true });
    return TrailElements.checkboxInactiveTrail();
  } else {
    return null;
  }
});

Cypress.Commands.add('TrailNotAvailable', (messageTrail) => {
  return TrailElements.trailNotAvailable().contains(messageTrail).should('be.visible');
});

Cypress.Commands.add('TrailInactive', (inactive) => {
  return TrailElements.cardInactive().contains(inactive).should('be.visible');
});

Cypress.Commands.add('TrailVerifyCheckboxInactive', () => {
  return TrailElements.checkboxInactiveTrail();
});

Cypress.Commands.add('TrailClickEdit', (trailCreatedBefore) => {
  cy.intercept(`**/learning-trails/${trailCreatedBefore.id}`).as('loadPageEdit');
  TrailElements.buttonEdit().click();
  return cy.wait('@loadPageEdit');
});

Cypress.Commands.add('TrailEnroll', () => {
  cy.intercept('POST', '**/learning-trail-enrollments').as('trailEnrollment');
  cy.intercept('GET', 'learning-trail-enrollments?give_up=false&is_active=true&status=STARTED,ENROLLED').as(
    'statusEnrolled',
  );
  return TrailElements.buttonStartEnroll()
    .click()
    .then(() => {
      cy.TrailSelectDateTarget()
        .wait('@trailEnrollment')
        .then((request) => {
          expect(request.response.statusCode).equal(201);
          expect(request.response.body.id).not.to.be.empty;
          cy.log('User Enrolls');
          const userEnroll = request.response.body;
          return cy.wrap(userEnroll);
        });
    });
});

Cypress.Commands.add('TrailEnrollMobile', () => {
  cy.intercept('POST', '**/learning-trail-enrollments').as('trailEnrollment');
  return TrailElements.buttonStartEnrollMobile()
    .click()
    .then(() => {
      cy.TrailSelectDateTarget()
        .wait('@trailEnrollment')
        .then((request) => {
          expect(request.response.statusCode).equal(201);
        });
    });
});

Cypress.Commands.add('TrailSelectDateTarget', () => {
  const dayTarget = new Date().getUTCDate();
  return TrailElements.selectDateTarget().contains(dayTarget).click();
});

Cypress.Commands.add('TrailVerifyEnrolled', (trailDefault) => {
  TrailElements.buttonGiveup();
  cy.PressEsc();
  cy.EnrollmentsAccessTrail();
  cy.EnrollmentsSearchTrail(trailDefault.name);
  return cy.EnrollmentsVerifyTrail(trailDefault.name);
});

Cypress.Commands.add('TrailFillExpirationDate', (expiration_date) => {
  if (expiration_date) {
    TrailElements.checkboxExpirationDate().check();
    return TrailElements.inputTrailExpirationDate().type(expiration_date);
  } else {
    return null;
  }
});

Cypress.Commands.add('TrailBatchEnrollment', (user, option) => {
  cy.intercept('POST', '**/learning-trail-enrollments/batch').as('trailEnrollment');
  cy.intercept('GET', '**/users?search**').as('userSearch');

  cy.GetMetaDataSelectorAndClick('trail-menu');
  cy.GetMetaDataSelectorAndClick('button-batch-enrollments');

  EnrollsTrailElements.inputSearchTrail().last().type(user);

  TrailElements.trailOptionBatchEnroll().should('have.length', '1');
  TrailElements.checkboxUserBatchEnrollment().click();
  TrailElements.buttonOpenBatchEnrollDialog().click();

  TrailElements.inputGoalDate().clear().type(getDateTodayBR());
  TrailElements.batchEnrollmentType().click();

  if (option === 'required') {
    TrailElements.batchEnrollmentTypeRequired().click();
  } else {
    TrailElements.batchEnrollmentTypeFree().click();
  }

  TrailElements.settingsBatchEnrollmentConfirm().click();
  TrailElements.submitBatchEnrollment().click();

  cy.wait('@trailEnrollment');
});

Cypress.Commands.add('TrailMissionOpen', (missionName) => {
  cy.intercept('**/missions/**').as('loadMission');
  TrailElements.trailStep().scrollIntoView();
  TrailElements.stageName().should('be.visible').contains(missionName).click();
  return cy.wait('@loadMission');
});

Cypress.Commands.add('TrailEditExpirationDate', () => {
  return TrailElements.checkboxExpirationDate().uncheck({ force: true });
});

Cypress.Commands.add('TrailVerifyStep', (missionName) => {
  return TrailElements.stepContentName().should('contain.text', missionName);
});

Cypress.Commands.add('TrailPulseOpen', () => {
  return cy.get('[data-test="button-stage-open"]').click();
});

Cypress.Commands.add('TrailPulseAccessAndConsume', (trailPulseIndex) => {
  cy.intercept(`**/learning-trails/**`).as('trailDetails');
  TrailElements.buttonPlayStepTrail().eq(trailPulseIndex).scrollIntoView().click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000); //time to consume
  cy.GetMetaDataSelectorAndClick('button-return-to-trail');
  return cy.wait('@trailDetails');
});

Cypress.Commands.add('TrailPulseAccessAndConsumeTypeQuiz', (trailPulseIndex) => {
  cy.intercept(`**/answers`).as('answerResponse');
  TrailElements.buttonPlayStepTrail().eq(trailPulseIndex).scrollIntoView().click();
  PulseElements.quizOption().contains('Correct').click();
  cy.GetMetaDataSelectorAndClick('button-confirm-option-in-pulse-quiz');
  return cy.wait('@answerResponse');
});

Cypress.Commands.add('TrailTransferConfirm', () => {
  cy.intercept('**/learning-trails/**/transfer').as('loadingTransfer');
  TrailElements.confirmTransferButtonVisible();
  TrailElements.confirmTransferButton().click();
  TrailElements.confirmTransferButton().click();
  return cy.wait('@loadingTransfer').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.NoContent);
  });
});

Cypress.Commands.add('TrailOpenStepMobile', (stepNumber) => {
  TrailElements.buttonOpenStepMobile().eq(stepNumber).click();
});

Cypress.Commands.add('TrailVerifyEnrolledMobile', (trailName) => {
  cy.GetMetaDataSelectorAndClick('button-access-vertical-navigation-menu');
  cy.EnrollmentsAccessTrail();
  cy.EnrollmentsSearchTrail(trailName);
  return cy.EnrollmentsVerifyTrailMobile(trailName);
});

Cypress.Commands.add('TrailVerifyEnrollStatusMobile', (trailName, enrollStatus) => {
  cy.EnrollmentsTrailAccessMobile();
  EnrollsTrailElements.filterEnrollmentsMobile().click();
  EnrollsTrailElements.optionFilterStatusMobile(enrollStatus)
    .scrollIntoView()
    .should('be.visible')
    .find('input')
    .check();
  cy.ClickBody();
  cy.EnrollmentsVerifyTrailMobile(trailName);
  return EnrollsTrailElements.enrollmentStatusMobile().contains(enrollStatus).should('be.visible');
});

Cypress.Commands.add('TrailGiveup', () => {
  cy.intercept('**/give-up').as('waitGiveUp');
  TrailElements.buttonGiveup().click();
  TrailElements.trailConfirm().click();
  cy.wait('@waitGiveUp');
});

Cypress.Commands.add('TrailCreateStepImage', () => {
  cy.intercept('available-contents?search=').as('LoadSearch');
  cy.wait('@LoadSearch');
  TrailElements.buttonNextStepImage().click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      TrailCreate(trailDefault): any;
      TrailNew(): Chainable<JQuery<HTMLElement>>;
      TrailCreateStepInformation(trailDefault): Chainable<JQuery<HTMLElement>>;
      TrailFillName(name: string): Chainable<JQuery<HTMLElement>>;
      TrailFillType(type: string): Chainable<JQuery<HTMLElement>>;
      TrailFillLanguage(language: string): Chainable<JQuery<HTMLElement>>;
      TrailFillDescription(description: string): Chainable<JQuery<HTMLElement>>;
      TrailConfirmInformation(): Chainable<JQuery<HTMLElement>>;
      TrailClickConfirmInformation(): Chainable<JQuery<HTMLElement>>;
      TrailCreateStepContent(contentInTrail: string): Chainable<JQuery<HTMLElement>>;
      TrailFieldSearchPulseOrMission(contentInTrail: string): Chainable<JQuery<HTMLElement>>;
      TrailConfirmPulseOrMission(): Chainable<Interception>;
      TrailConfirmContent(): Chainable<JQuery<HTMLElement>>;
      TrailSearch(trailName: string): Chainable<Interception>;
      TrailSearchMobile(trailName: string): Chainable<Interception>;
      TrailVerifyNumberMissionOnPopUp(numberContents): Chainable<JQuery<HTMLElement>>;
      TrailVerifyNumberPulseOnPopUp(numberContents): Chainable<JQuery<HTMLElement>>;
      TrailVerifyCardActive(): Chainable<JQuery<HTMLElement>>;
      TrailOpenCard(trailName): Chainable<JQuery<HTMLElement>>;
      TrailVerifyTypeCard(statusType): Chainable<JQuery<HTMLElement>>;
      TrailCreatedByMe(): Chainable<JQuery<HTMLElement>>;
      TrailFillStatus(is_active: boolean): Chainable<JQuery<HTMLElement>>;
      TrailNotAvailable(messageTrail): Chainable<JQuery<HTMLElement>>;
      TrailInactive(inactive): Chainable<JQuery<HTMLElement>>;
      TrailVerifyCheckboxInactive(): Chainable<JQuery<HTMLElement>>;
      TrailClickEdit(trailCreatedBefore): Chainable<Interception>;
      TrailEnroll(): Chainable<JQuery<HTMLElement>>;
      TrailEnrollMobile(): Chainable<JQuery<HTMLElement>>;
      TrailSelectDateTarget(): Chainable<JQuery<HTMLElement>>;
      TrailVerifyEnrolled(trailDefault): Chainable<JQuery<HTMLElement>>;
      TrailFillExpirationDate(expiration_date: string): Chainable<JQuery<HTMLElement>>;
      TrailEditExpirationDate(): Chainable<JQuery<HTMLElement>>;
      TrailVerifyStep(missionName: string): Chainable<JQuery<HTMLElement>>;
      TrailBatchEnrollment(user: string, option?: string): Chainable<Interception>;
      TrailNameAndProgressIsVisible(trailName: string): Chainable<JQuery<HTMLElement>>;
      TrailMissionOpen(missionName: string): Chainable<Interception>;
      TrailPulseOpen(): Chainable<JQuery<HTMLElement>>;
      TrailPulseAccessAndConsume(trailPulseIndex: number): Chainable<Interception>;
      TrailPulseAccessAndConsumeTypeQuiz(trailPulseIndex: number): Chainable<Interception>;
      TrailTransferConfirm(): Chainable<Interception>;
      TrailOpenCardMobile(trailName): Chainable<JQuery<HTMLElement>>;
      TrailOpenStepMobile(stepNumber: number): Chainable<JQuery<HTMLElement>>;
      TrailVerifyEnrolledMobile(trailName: string): Chainable<JQuery<HTMLElement>>;
      TrailVerifyEnrollStatusMobile(trailName: string, enrollStatus: string): Chainable<JQuery<HTMLElement>>;
      TrailGiveup(): Chainable<JQuery<HTMLElement>>;
      TrailCreateStepImage(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
