import * as util from '../../support/constants/utils';
export default class PulseElements {
  static pulseDetailTitle() {
    return cy.get('[data-test="pulse-title"]');
  }

  static allPulses() {
    return cy.get(`[ng-reflect-value="PULSES"]`).should('be.visible');
  }

  static topMenuButton() {
    return cy.get(`[ng-reflect-message="Canais"]`);
  }

  static createButton() {
    return cy.get('a[aria-label="add channel"]');
  }

  static NavPulses() {
    return cy.get('[ng-reflect-router-link="/pulse"] > div', { timeout: 50000 }).should('be.visible');
  }

  static newContentButton(type) {
    return cy.get(`button[aria-label="${type}"]`);
  }

  static contentFileType(type) {
    return cy.get(`button[aria-label="${type}"]`);
  }

  static saveNewPulseButton() {
    return cy.get('[data-test="button-save"]');
  }

  static saveNewPulseQuizButton() {
    return cy.get('[type="submit"]');
  }

  static newPulseDialog() {
    return cy.get('mat-dialog-container');
  }

  static inputFileNewFileContent() {
    return PulseElements.newPulseDialog().find(`[type="file"]`).first();
  }

  static inputThumbnailNewFileContent() {
    return cy.get('kp-file-upload input').first();
  }

  static inputNameNewContent() {
    return PulseElements.inputFormContent('name');
  }

  static inputLinkNewContent() {
    return PulseElements.inputFormContent('value');
  }

  static inputFormContent(type) {
    return cy.get(`input[formcontrolname="${type}"]`);
  }

  static card(name) {
    return cy.get(`[ng-reflect-name="${name}"] > .kp-pulse-card-container > .kp-pulse-card-cover`);
  }

  static requireMessageNewFileContent() {
    return cy.get('mat-error');
  }

  static pdfViewer() {
    return cy.get('kp-pdf-viewer');
  }

  static docViewer() {
    return cy.get('kp-docs-viewer');
  }

  static pulseNotificationElement() {
    return cy.get('[data-test="notification-element"]').should('be.visible');
  }

  static questionQuizName() {
    return cy.get('[data-test="kp-quiz-form.question_name"]').should('be.visible');
  }

  static nextButtonQuiz() {
    return cy.get('[aria-label="Próximo"]').should('be.visible');
  }

  static buttonPlayContent() {
    return cy.get('.plyr__controls > [data-plyr="play"]').should('be.visible');
  }

  static quizOption() {
    return cy.get('[data-test="kp-quiz-form.option_text"]').should('be.visible');
  }

  static favoritePulseSelector() {
    return cy.get('[data-test="pulse-toggle-favorite"]').should('be.visible');
  }

  static pulseFilterOptionFavorite() {
    return cy.get('[ng-reflect-label="Favoritos"]').should('be.visible');
  }

  static pulseCardSelector() {
    return cy.get('kp-pulse-card').should('be.visible');
  }

  static pulseAlertSelector() {
    return cy.get('fuse-alert').should('be.visible');
  }

  static pulseDetailsChannelName() {
    return cy.get('[data-test="pulse-details-channel-name"]').should('be.visible');
  }

  static pulseDetailsPulseName() {
    return cy.get('[data-test="pulse-title"]').should('be.visible');
  }

  static pulseDetailsDescription() {
    return cy.get('[data-test="pulse-details-description"]').should('be.visible');
  }

  static inputNameContentLink() {
    return cy.get('[data-test="field-content-yt"]');
  }

  static inputQuestionOnQuiz() {
    return cy.get('[data-test="kp-quiz-form.form"] [contenteditable="true"]');
  }

  static numberOfCorrectAnswers() {
    return cy.get('[data-test="bottom-number-of-correct-answers-selector"]').should('be.visible');
  }

  static topNumberCorrectAnswers() {
    return cy.get('[data-test="top-number-correct-answers-selector"]').should('be.visible');
  }

  static topNumberIncorrectAnswers() {
    return cy.get('[data-test="top-number-incorrect-answers-selector"]').should('be.visible');
  }

  static numberCorrectAnswersOnFinshPage() {
    return cy.get('[data-test="pulse-quiz-number-correct-answer"]').should('be.visible');
  }

  static numberIncorrectAnswersOnFinshPage() {
    return cy.get('[data-test="pulse-quiz-number-incorrect-answer"]').should('be.visible');
  }

  static buttonSkipQuestion() {
    return cy.get('[data-test="button-skip-question"]');
  }

  static messageCorrectAnswer() {
    return cy.get('[data-test="bottom-correct-answers-selector"]');
  }

  static messageIncorrectAnswer() {
    return cy.get('[data-test="bottom-incorrect-answers-selector"]');
  }

  static currentAndLastQuestionSelector() {
    return cy.get('[data-test="current-and-last-question-number-selector"]').should('be.visible');
  }

  static pulsesPageSelector() {
    return cy.get('app-pulses-collection');
  }

  static pulseExternalLink() {
    return cy.get('[data-test="input-external-link"]');
  }

  static CropperButtonSave() {
    return cy.get('kp-image-cropper div button span').contains(util.SAVE).should('be.visible');
  }

  static titleContentPulseFile() {
    return cy.get('h1.mat-mdc-dialog-title').should('be.visible');
  }
}
