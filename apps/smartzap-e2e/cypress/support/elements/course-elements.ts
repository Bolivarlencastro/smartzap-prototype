export default class CourseElements {
  static courseNameList() {
    return cy.get('[data-test="course-name"]', { timeout: 10000 }).as('name');
  }

  static courseNameDetails() {
    return cy.get('[data-test="course-detail-header.name"]').should('be.visible');
  }

  static courseCategory() {
    return cy.get('[data-test="course-category"]').should('be.visible');
  }

  static courseDurationList() {
    return cy.get('[data-test="course-duration"]').should('be.visible');
  }

  static courseDetailDuration() {
    return cy.get('[data-test="course-detail-status.status"]').should('be.visible');
  }

  static courseSubscribersList() {
    return cy.get('[data-test="course-subscribers"]').should('be.visible');
  }

  static courseSubscribersDetails() {
    return cy.get('[data-test="course-detail-status.status"]').should('be.visible');
  }

  static usersCompletedList() {
    return cy.get('[data-test="users-completed"]').should('be.visible');
  }

  static usersCompletedDetails() {
    return cy.get('[data-test="course-detail-status.status"]').should('be.visible');
  }

  static courseStatusList() {
    return cy.get('[data-test="course-status"]').should('be.visible');
  }

  static courseStatusDetails() {
    return cy.get('.course-detail-status').should('be.visible');
  }

  static courseDescriptionDetails() {
    return cy.get('app-course-detail-description').should('be.visible');
  }

  static newCourseButton() {
    return cy.get('[data-test="button-open-course-create-dialog"]').should('be.visible');
  }

  static courseNameField() {
    return cy.get('#input-mission-step-info-name').should('be.visible');
  }

  static courseCategoryField() {
    return cy.get('[data-test="button-open-category-dialog"]').should('be.visible');
  }

  static courseCategoryOption(category) {
    return cy.get(`[data-test="course-category-${category}"]`).should('be.visible');
  }

  static courseLanguageField() {
    return cy.get('[data-test="button-open-language-dialog"]').should('be.visible');
  }

  static courseLanguageOption(language) {
    return cy.get(`[data-test="course-language-${language}"]`).should('be.visible');
  }

  static courseDescriptionField() {
    return cy.get('[data-test="course-description-field"]').should('be.visible');
  }

  static saveCourseInformationButton() {
    return cy.get('[data-test="save-course-info-button"]').should('be.visible');
  }

  static nextCourseButton() {
    return cy.get('[data-test="next-course-info-button"]').should('be.visible');
  }

  static courseTabButton() {
    return cy.get('[data-test="school"]').should('be.visible');
  }

  static courseSearch() {
    return cy.get('#filter-input').should('be.visible');
  }

  static courseRowSelector() {
    return cy.get('mat-row').should('be.visible');
  }

  static openCourseButton() {
    return cy.get('[data-test="open-details-course-button"]').scrollIntoView();
  }

  static editCourseButton() {
    return cy.get('[data-test="edit-course-button"]').should('be.visible');
  }

  static confirmButton() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static courseMenuButton() {
    return cy.get('[data-test="course-menu-list"]').should('be.visible');
  }

  static courseMenuOptionDelete() {
    return cy.get('[data-test="course-menu-option-delete"]').should('be.visible');
  }

  static courseListSelector() {
    return cy.get('app-course-list').should('be.visible');
  }

  static inputLessonName() {
    return cy.get('[data-test="input-lesson-name"]').should('be.visible');
  }

  static buttonNewLesson() {
    return cy.get('[data-test="button-add-new-lesson"]').should('be.visible');
  }

  static buttonNewContent() {
    return cy.get('[data-test="button-new-content"]').should('be.visible');
  }

  static buttonNewContentTypeFile() {
    return cy.get('[aria-label="Arquivo"]').should('be.visible');
  }

  static buttonNewContentTypeLink() {
    return cy.get('[aria-label="Link"]').should('be.visible');
  }

  static buttonNewContentTypeQuiz() {
    return cy.get('[aria-label="Quiz"]').should('be.visible');
  }

  static contentTypeSelector(selector) {
    return cy.get(`[aria-label="${selector}"]`).should('be.visible');
  }

  static contentUploadSelector() {
    return cy.get('[data-cy="file-upload"]');
  }

  static buttonSave() {
    return cy.get('[data-test="button-save"]').should('be.visible');
  }

  static inputFileContentName() {
    return cy.get('[data-test="inputTextNewFileContent"]').should('be.visible');
  }

  static buttonConfirmContents() {
    return cy.get('[data-test="button-confirm-course-contents"]').should('be.visible');
  }

  static publishCourseButton() {
    return cy.get('[data-test="publish-course-button"]').should('be.visible');
  }

  static courseContentDetails() {
    return cy.get('[data-test="content-details-in-course-popup"]').should('be.visible');
  }

  static inputContentLink() {
    cy.get('[data-test="field-external-link"]').click({ force: true });
    return cy.get('[data-test="input-external-link"]').should('be.visible');
  }

  static inputLinkContentName() {
    return cy.get('[data-test="field-content-yt"]');
  }

  static inputQuizName() {
    return cy.get('[data-test="field-content-yt"]').should('be.visible');
  }

  static newQuizQuestionButton() {
    return cy.get('[data-test="new-quiz-question-button"]').should('be.visible');
  }

  static quizQuestionInput() {
    return cy.get('[data-test="quiz-question-input"]').should('be.visible');
  }

  static quizOptionInput(value) {
    return cy.get(`[data-test="quiz-option-input-${value}"]`).should('be.visible');
  }

  static selectQuizCorrectOption(value) {
    return cy.get(`[data-test="check-quiz-correct-option-${value}"]`).should('be.visible');
  }

  static newQuizAnswerButton() {
    return cy.get('[data-test="add-new-quiz-option"]').should('be.visible');
  }

  static reportButton() {
    return cy.get('[data-test="report-button"]').should('be.visible');
  }

  static reportButtonActivity() {
    return cy.get('[data-cy="choice-report-button-ACTIVITY"]').should('be.visible');
  }

  static buttonCloseReport() {
    return cy.get('[ng-reflect-aria-label="Close"]').should('be.visible');
  }

  static reportButtonProgress() {
    return cy.get('[data-cy="choice-report-button-PROGRESS"]').should('be.visible');
  }

  static reportButtonCompleted() {
    return cy.get('[data-cy="choice-report-button-COMPLETED"]').should('be.visible');
  }

  static reportButtonQuizzes() {
    return cy.get('[data-cy="choice-report-button-QUIZZES"]').should('be.visible');
  }
}
