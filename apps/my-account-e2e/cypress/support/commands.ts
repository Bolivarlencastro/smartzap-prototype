/// <reference types="cypress" />

export function getRandomName() {
  return Math.random().toString(36).slice(2);
}

export function getRandomNumber() {
  const min = 100000;
  const max = 999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

Cypress.Commands.add('ConvertFirstLetterToUpperCase', (name) => {
  const nameUp = name.charAt(0).toUpperCase() + name.slice(1);
  cy.wrap(nameUp);
});

Cypress.Commands.add('GetMetaDataSelectorAndClick', (element) => {
  return cy.get(`[data-test="${element}"]`).should('be.visible').click();
});

Cypress.Commands.add('ClickBody', () => {
  return cy.get('body').click();
});
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      ConvertFirstLetterToUpperCase(name: string): any;
      GetMetaDataSelectorAndClick(element: string): Chainable<JQuery<HTMLElement>>;
      ClickBody(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
