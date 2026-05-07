it('Login with admin and user on smartzap', () => {
  cy.Login('admin');
  cy.visit('/');
  cy.Login('user');
  cy.visit('/');
});
