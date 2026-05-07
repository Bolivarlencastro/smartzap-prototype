import { CypressResponse } from '../interfaces';

const baseUrlPulse = `${Cypress.env('new_url_api')}/regulatory-compliance/api`;

Cypress.Commands.add('APIDeleteNormative', (ID) => {
  return cy.keepsApi(`${baseUrlPulse}/compliances/${ID}`, {}, 'DELETE', {
    Authorization: localStorage.getItem('auth-token'),
  });
});

Cypress.Commands.add('APIDeleteCycle', (ID) => {
  return cy.keepsApi(`${baseUrlPulse}/cycles/${ID}`, {}, 'DELETE', {
    Authorization: localStorage.getItem('auth-token'),
  });
});

Cypress.Commands.add('APICreateNormative', (name) => {
  return cy.keepsApi(
    `${baseUrlPulse}/compliances`,
    {
      name: name,
    },
    'POST',
    {
      Authorization: localStorage.getItem('auth-token'),
    },
  );
});

Cypress.Commands.add(
  'APICreateRegulatoryCompliance',
  (id, learningObjectId = '635571d6-0c79-4e98-ab64-fa6a04b5836b') => {
    return cy.keepsApi(
      `${baseUrlPulse}/cycles`,
      {
        duration: 12,
        jobIds: [],
        jobFunctionIds: [],
        learningObjectId: learningObjectId,
        complianceId: id,
        description: '',
        periodType: 'MONTH',
      },
      'POST',
      {
        Authorization: localStorage.getItem('auth-token'),
      },
    );
  },
);

declare global {
  namespace Cypress {
    interface Chainable {
      APIDeleteNormative(ID: string): Chainable<CypressResponse>;
      APIDeleteCycle(ID: string): Chainable<CypressResponse>;
      APICreateNormative(name: string): Chainable<CypressResponse>;
      APICreateRegulatoryCompliance(id: string, learningObjectId?: string): Chainable<CypressResponse>;
    }
  }
}
