export default class ClassroomElements {
  static nextContent() {
    return cy.get('[data-test="next-step-button"]').should('be.visible');
  }

  static nextContentTop() {
    return cy.get('[data-cy="nextContentTop"]').should('be.visible');
  }

  static playVideo() {
    return cy.get('media-play-button').should('be.visible');
  }

  static viewImage() {
    return cy.get('.cursor-zoom-in').should('be.visible');
  }

  static messageFinishCourse() {
    return cy.get('.text-black');
  }

  static buttonFinishCourse() {
    return cy.get('[data-test="button-finish-course"]').should('be.visible');
  }

  static buttonEvaluationsQuestions() {
    return cy.get('.stars-container > :nth-child(1)').should('be.visible');
  }

  static buttonConfirm() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static surveySatisfactionQ1() {
    return cy.get('[data-cy="evaluation-content.first-step-rate-buttons-4-question-0"]').should('be.visible').click();
  }

  static surveySatisfactionQ2() {
    return cy.get('[data-cy="evaluation-content.first-step-rate-buttons-4-question-1"]').click();
  }

  static surveySatisfactionQ3() {
    return cy.get('[data-cy="evaluation-content.first-step-rate-buttons-4-question-2"]').click();
  }

  static surveySatisfactionQ4() {
    return cy.get('[data-cy="evaluation-content.first-step-rate-buttons-4-question-3"]').click();
  }

  static surveySatisfactionQ5() {
    return cy.get('[data-cy="evaluation-content.first-step-rate-buttons-4-question-4"]').click();
  }

  static surveySatisfactionQ6() {
    return cy.get('[data-cy="evaluation-content.first-step-rate-buttons-4-question-5"]').click();
  }

  static surveySatisfactionQ7() {
    return cy.get('[data-test="evaluation-content.second-step-rate-buttons-4"]').click();
  }

  static surveySatisfactionQ8() {
    return cy.get('[data-test="evaluation-content.third-step-nps-9"]').click();
  }

  static surveySatisfactionQText() {
    return cy.get('[data-test="comment quiz"]').should('be.visible');
  }

  static recommendation() {
    return cy.get('.rate-buttons-container > :nth-child(10)').should('be.visible');
  }

  static closeImage() {
    return cy.get('.iv-fullscreen-close').should('be.visible');
  }

  static quizOptionCorrect() {
    return cy.get('.question');
  }

  static quizConfirmOption() {
    return cy.get('[data-test="answer-question-quiz"]');
  }

  static quizNextQuestion() {
    return cy.get('[data-test="quiz-finish-next-content"]');
  }

  static nextContentFinishQuiz() {
    return cy.get('[data-test="next-content-quiz"]').should('be.visible');
  }

  static classroomMenu() {
    return cy.get('[data-test="button-menu-course"]').should('be.visible');
  }

  static buttonExitClassroom() {
    return cy.get('[data-test="button-close-classroom"]').should('be.visible');
  }

  static buttonExitClassroomMobile() {
    return cy.get('[data-test="button-back-mobile"]').should('be.visible');
  }

  static classroomStepsList() {
    return cy.get('[data-test="classroom-steps-menu"]').should('be.visible');
  }

  static classroomEnrollmentProgressSelector() {
    return cy.get('[data-test="classroom-enrollment-progress-selector"]').should('be.visible');
  }

  static classroomCompletedStep() {
    return cy.get('[data-test="classroom-steps-menu"][ng-reflect-completed="true"]');
  }

  static contentVimeoAvailableClassroom() {
    return cy.get('[data-ready="true"]').should('be.visible');
  }

  static playVimeoClassroom() {
    return cy.get('[data-plyr="play"]').first().should('be.visible');
  }

  static playAudioClassroom() {
    return cy.get('media-play-button').should('be.visible').click();
  }

  static exitMenuClassroom() {
    return cy.get('.fuse-vertical-navigation-overlay').should('be.visible').click();
  }

  static performClassroomFinish() {
    return cy.get('[data-test="performance-classroom"]');
  }

  static classroomErrorElement() {
    return cy.get('[role="alert"]').should('be.visible');
  }

  static nextContentMobile() {
    return cy.get('[data-test="mobile-next-content-button"]').should('be.visible');
  }

  static pointsComponentSelector() {
    return cy.get('[data-test="points-classroom"]').should('be.visible');
  }

  static progressPanel() {
    return cy.get('kp-progress-panel').should('be.visible');
  }

  static confirmNewGoalDate() {
    return cy.get('[data-test="confirm-button"]').should('be.visible');
  }

  static daySelectorOnGoalDate() {
    return cy.get('[role="gridcell"]').should('be.visible');
  }

  static buttonGetCertificate() {
    return cy.get('[data-test="get-certificate-button"]').should('be.visible');
  }

  static certificateIframe() {
    return cy.get('kp-certificate').should('be.visible');
  }
}
