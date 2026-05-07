const registerCypressGrep = require('@cypress/grep');
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
registerCypressGrep();
import './commands/index';
import './API/index';
import 'cypress-iframe';
import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});
