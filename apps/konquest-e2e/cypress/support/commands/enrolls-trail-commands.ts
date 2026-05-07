/// <reference types="cypress" />
import * as StatusCode from '../constants/status-code';
import EnrollsTrailsElements from '../elements/enrolls-trail-elements';
import EnrollsMissionsElements from '../elements/enrolls-missions-elements';
import TrailElements from '../elements/trail-elements';
import { Interception } from 'cypress/types/net-stubbing';

Cypress.Commands.add('EnrollmentsAccessTrail', () => {
  cy.intercept('**/learning-trail-enrollments**').as('listEnrollments');
  EnrollsMissionsElements.buttonEnrollments();
  return EnrollsTrailsElements.buttonEnrollmentTrail().wait('@listEnrollments');
});

Cypress.Commands.add('EnrollmentsSearchTrail', (trail) => {
  cy.intercept('**/learning-trail-enrollments?page**').as('searchListEnrollments');
  return EnrollsTrailsElements.inputSearchTrail()
    .clear()
    .type(`${trail}{enter}`, { delay: 250 })
    .wait('@searchListEnrollments')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});

Cypress.Commands.add('EnrollmentsVerifyTrail', (trailName) => {
  return EnrollsTrailsElements.columnTrailName(trailName).should('be.visible');
});

Cypress.Commands.add('EnrollmentsTrailOpen', (trail) => {
  cy.intercept(`**/learning-trails/${trail.id}`).as('trailLoad');
  EnrollsTrailsElements.menuOptions().click();
  EnrollsTrailsElements.enrollmentsOptionMenuSelector().contains('Visualizar Trilha').click({ force: true });
  cy.wait('@trailLoad').its('response.statusCode').should('eq', 200);
  return TrailElements.trailDetails().contains(trail.name);
});

Cypress.Commands.add('EnrollmentsAccessTrailEnrolled', (trail) => {
  cy.EnrollmentsAccessTrail();
  cy.EnrollmentsSearchTrail(trail.name);
  return cy.EnrollmentsTrailOpen(trail);
});

Cypress.Commands.add('EnrollmentsVerifyTrailMobile', (trailName) => {
  return EnrollsTrailsElements.columnTrailEnrollmentsMobile().contains(trailName);
});

Cypress.Commands.add('EnrollmentsTrailAccessMobile', () => {
  cy.GetMetaDataSelectorAndClick('button-access-vertical-navigation-menu');
  cy.intercept('**/learning-trail-enrollments**').as('listEnrollments');
  EnrollsMissionsElements.buttonEnrollments();
  return EnrollsTrailsElements.buttonEnrollmentTrail().wait('@listEnrollments');
});
declare global {
  namespace Cypress {
    interface Chainable {
      EnrollmentsAccessTrail(): Chainable<Interception>;
      EnrollmentsTrailAccessMobile(): Chainable<Interception>;
      EnrollmentsSearchTrail(trail: string): Chainable<Interception>;
      EnrollmentsVerifyTrail(trailName: string): Chainable<JQuery<HTMLElement>>;
      EnrollmentsTrailOpen(trail): Chainable<JQuery<HTMLElement>>;
      EnrollmentsAccessTrailEnrolled(trail): Chainable<JQuery<HTMLElement>>;
      EnrollmentsVerifyTrailMobile(trailName: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
