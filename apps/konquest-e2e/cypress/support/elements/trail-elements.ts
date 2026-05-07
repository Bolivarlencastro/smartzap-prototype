import * as util from '../constants/utils';

export default class TrailElements {
  static fieldNameTrail() {
    return cy.get('#input-learning-trail-step-info-name').should('be.visible');
  }

  static fieldTypeTrail() {
    return cy.get('#list-learning-trail-step-info-type').should('be.visible');
  }

  static fieldLanguagesTrail() {
    return cy.get('[ng-reflect-name="language"]').should('be.visible');
  }

  static fieldDescriptionTrail() {
    return cy.get('#input-learning-trail-step-info-description').should('be.visible');
  }
  static buttonConfirmInformation() {
    return cy.get('#button-learning-trail-step-info-next').should('be.visible');
  }

  static trailType() {
    return cy.get('#list-learning-trail-step-info-type-panel');
  }

  static trailLanguage() {
    return cy.get('[role="listbox"] > mat-option');
  }

  static fieldSearchPulseOrMission() {
    return cy.get('#input-learning-trail-step-name').should('be.visible');
  }

  static fieldConfirmAddPulseOrMission() {
    return cy.get('#button-learning-trail-step-add').should('be.visible');
  }

  static fieldMissionInTrailSearched() {
    return cy.get('.shrink-0');
  }

  static buttonConfirmStepContent() {
    return cy.get('#button-learning-trail-step-next').invoke('show').should('be.visible');
  }

  static buttonFinishTrail() {
    return cy.get('#button-learning-trail-step-finalize').should('be.visible');
  }

  static fieldSearchTrail() {
    return cy.get('kp-global-search-input input').should('be.visible');
  }

  static fieldSearchTrailMobile() {
    return cy.get('#filter-input').should('be.visible');
  }

  static BarScrollTrail() {
    return cy.get(`#container-3 > .ps__rail-y`);
  }

  static IconNumberMissionOnPopUp() {
    return cy.get('[data-test="mission-pop-up-resume-selector"]').eq(1).should('be.visible');
  }

  static IconCardActive() {
    return cy.get('[ng-reflect-type="development-published"]').should('be.visible');
  }

  static CardTrail() {
    return cy.get('kp-learn-content-card');
  }

  static typeStatusCardOpen() {
    return cy.get('kp-title div div div span');
  }

  static typeStatusCardClosed() {
    return cy.get('kp-title div div div span');
  }

  static buttonTrailCreatedByme() {
    return cy.get(`[ng-reflect-label="${util.CREATED_BY_ME}"]`).should('be.visible');
  }

  static trailNotAvailable() {
    return cy.get('.message-box');
  }

  static checkboxStatusTrail() {
    return cy.get('#toggle-learning-trail-form-active-button').should('be.visible');
  }

  static checkboxInactiveTrail() {
    return cy.get('[aria-checked="false"]').should('be.visible');
  }

  static cardInactive() {
    return cy.get('[ng-reflect-type="development-inactive"]');
  }

  static buttonEdit() {
    return cy.get('[data-test="edit-trail"]').should('be.visible');
  }

  static buttonStartEnroll() {
    return cy.get('[data-test="learning-trail-start-retake"]').should('be.visible');
  }

  static buttonStartEnrollMobile() {
    return cy.get('[data-test="action-button-trail"]').should('be.visible');
  }

  static selectDateTarget() {
    return cy.get('.mat-calendar-body-cell-content').should('be.visible');
  }

  static buttonGiveup() {
    return cy.get('[ng-reflect-message="Ao abandonar, todas as missões"]').should('be.visible');
  }

  static IconNumberPulseOnPopUp() {
    return cy.get('[data-test="mission-pop-up-resume-selector"]').eq(2).should('be.visible');
  }

  static checkboxExpirationDate() {
    return cy.get('.mdc-checkbox [type="checkbox"]').should('exist');
  }

  static buttonTrailEnrollment() {
    return cy.get('[ng-reflect-router-link="/learning-trails"]').should('be.visible').click();
  }

  static checkboxUserBatchEnrollment() {
    return cy.get('[data-test="checkbox-modal-row"]').should('be.visible');
  }

  static submitBatchEnrollment() {
    return cy.get('#mission-batch-enrollments-positive-button').should('be.visible');
  }

  static trailDetails() {
    return cy.get('kp-title').should('be.visible');
  }

  static stageName() {
    return cy.get('[data-test="step-name"]').should('exist');
  }

  static buttonPlayStepTrail() {
    return cy.get('[data-test="play-circle"]').should('be.visible');
  }

  static inputGoalDate() {
    return cy.get('[formcontrolname="date"]').should('be.visible');
  }

  static inputTrailExpirationDate() {
    return cy.get('[formcontrolname="expiration_date"]').should('be.visible');
  }

  static stepContentName() {
    return cy.get('[data-test="step-content-name"]').should('be.visible');
  }

  static trailDetailsExpirationDate() {
    return cy.get('[data-test="learnign-trail-expiration-date"]');
  }

  static closeTrailDetails() {
    return cy.get('app-learning-trail-detail > div > button').should('be.visible');
  }

  static stepFinishTrail() {
    return cy.get('[role="tab"] div div span').contains('Final').should('be.visible');
  }

  static batchEnrollmentType() {
    return cy.get('[formControlName="enrollmentType"]').should('be.visible');
  }

  static batchEnrollmentTypeFree() {
    return cy.get('[ng-reflect-value="FREE"]').should('be.visible');
  }

  static settingsBatchEnrollmentConfirm() {
    return cy.get('[data-test="batch-enrollments-settings"]').should('be.visible');
  }

  static batchEnrollmentTypeRequired() {
    return cy.get('[ng-reflect-value="REQUIRED"]').should('be.visible');
  }

  static confirmTransferButtonVisible() {
    return cy.get('app-transfer-dialog mat-dialog-content').should('be.visible');
  }

  static confirmTransferButton() {
    return cy.get('[data-test="confirm-transfer-trail"]').should('be.visible');
  }

  static trailSearchMobile() {
    return cy.get('kp-list-filter div div kp-global-search-input div #filter-input').should('be.visible');
  }

  static trailCardMobile() {
    return cy.get('kp-learn-content-card').should('be.visible');
  }

  static trailActionOnCardMobile() {
    return cy.get('[data-test="action-button-trail"]').should('be.visible');
  }

  static buttonAccessVerticalNavigationMobile() {
    return cy.get('compact-layout > div > div> button').should('be.visible');
  }

  static buttonOpenStepMobile() {
    return cy.get('[data-test="play-circle"]').should('be.visible');
  }

  static trailStep() {
    return cy.get('[data-test="step-trail"]');
  }

  static buttonTrailDropdown() {
    return cy.get('[data-test="trail-menu"]').should('be.visible');
  }

  static listTrailActions() {
    return cy.get('.mat-mdc-menu-panel .mat-mdc-menu-content');
  }

  static trailRetake() {
    return cy.get('[data-test="learning-trail-start-retake"]').should('be.visible');
  }

  static trailConfirm() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static buttonOpenBatchEnrollDialog() {
    return cy.get('kp-enrollment-settings-form > div > button').should('be.visible');
  }

  static trailsPageSelector() {
    return cy.get('app-learning-trails-list');
  }

  static trailOptionBatchEnroll() {
    return cy.get('[data-test="option-modal-row"]').should('be.visible');
  }

  static buttonNextStepImage() {
    return cy.get('app-learning-trail-step-images').find('button').last();
  }
}
