const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
require('./commands');
require('./commands/auth-commands');
require('./commands/users-commands');
require('./API/users-api');

Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});
