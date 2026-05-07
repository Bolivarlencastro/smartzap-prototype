const registerCypressGrep = require('@cypress/grep');
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
registerCypressGrep();
import 'cypress-iframe';
import 'cypress-mochawesome-reporter/register';
import './commands/index';
import './commands';
import './API/index';
import './commands';

Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});
