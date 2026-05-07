import CourseElements from '../../support/elements/course-elements';

const DefaultCourseName = '6hnrb3d2hq3';

it('Should get the course reports', () => {
  cy.intercept('**/activity/csv').as('activityCsvReport');
  cy.intercept('**/in-progress/csv').as('inProgressCsvReport');
  cy.intercept('**/completed/csv').as('completedCsvReport');
  cy.intercept('**/quizzes/csv').as('quizzesCsvReport');

  cy.Login('admin');

  cy.APIGetNotificationTotalCount().then((notificationCount) => {
    cy.CourseSearch(DefaultCourseName);
    cy.CourseOpen();

    const reports = [
      { button: CourseElements.reportButtonActivity, alias: '@activityCsvReport' },
      { button: CourseElements.reportButtonProgress, alias: '@inProgressCsvReport' },
      { button: CourseElements.reportButtonCompleted, alias: '@completedCsvReport' },
      { button: CourseElements.reportButtonQuizzes, alias: '@quizzesCsvReport' },
    ];

    reports.forEach(({ button, alias }) => {
      CourseElements.reportButton().should('be.visible').click();
      button().click();
      cy.wait(alias).its('response.statusCode').should('eq', 204);
      CourseElements.buttonCloseReport().click();
    });

    cy.ValidateNotificationIncrease(notificationCount);
  });
});
