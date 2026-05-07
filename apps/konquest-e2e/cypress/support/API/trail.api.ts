import { Interception } from 'cypress/types/net-stubbing';
import { TrailOptions } from '../interfaces/trail-options';
import { CypressResponse } from '../interfaces';
import { getRandomName } from '../../support/commands';

const baseUrl = `${Cypress.env('url_api')}/learning-trails`;

Cypress.Commands.add('APITrailCreate', (data) => {
  cy.keepsApi(
    baseUrl,
    {
      name: data.name,
      description: data.description,
      language_api: data.language_api || data.language,
      is_active: data.is_active,
      holder_image: data.holder_image,
      thumb_image: data.thumb_image,
      learning_trail_type: data.trail_type || data.type,
      user_creator: data.user_creator,
    },
    'POST',
  );
});

Cypress.Commands.add('APITrailLinkMission', (trail, mission, order) => {
  cy.keepsApi(
    `${baseUrl}/steps`,
    {
      learning_trail: trail,
      mission: mission,
      order: order,
    },
    'POST',
  );
});

Cypress.Commands.add('APITrailLinkPulse', (trail, pulse, order) => {
  cy.keepsApi(
    `${baseUrl}/steps`,
    {
      learning_trail: trail,
      pulse: pulse,
      order: order,
    },
    'POST',
  );
});

Cypress.Commands.add('APITrailDelete', (UUID) => {
  cy.keepsApi(`${baseUrl}/${UUID}`, {}, 'DELETE');
});

Cypress.Commands.add('APITrailCreateWithExternalMission', () => {
  let mission;
  let trail;
  cy.FixturesTrail()
    .then((fixtures) => ({
      ...fixtures,
      name: getRandomName(),
    }))
    .then((trailFixtures) => {
      return cy.APITrailCreate(trailFixtures);
    })
    .then((response) => {
      trail = response.body;
    });
  cy.FixturesMission()
    .then((fixtures) => ({
      ...fixtures,
      name: getRandomName(),
    }))
    .then((fixtures) => {
      return cy.APIMissionExternalCreate(fixtures);
    })
    .then((response) => {
      mission = response.body;
      cy.APITrailLinkMission(trail.id, mission.id, 1);
    })
    .then(() => {
      return [trail, mission];
    });
});

Cypress.Commands.add('APITrailCreateWithInternalMission', () => {
  let mission;
  let trail;
  cy.FixturesTrail()
    .then((fixtures) => ({
      ...fixtures,
      name: getRandomName(),
    }))
    .then((trailFixtures) => {
      return cy.APITrailCreate(trailFixtures);
    })
    .then((response) => {
      trail = response.body;
    });
  cy.FixturesMission()
    .then((fixtures) => ({
      ...fixtures,
      name: getRandomName(),
    }))
    .then((fixtures) => {
      return cy.APIMissionCreate(fixtures);
    })
    .then((response) => {
      mission = response.body;
      cy.APITrailLinkMission(trail.id, mission.id, 1);
    })
    .then(() => {
      return [trail, mission];
    });
});

Cypress.Commands.add('APITrailGetEnrollment', (trailId) => {
  cy.keepsApi(`${baseUrl}/${trailId}`, {}, 'GET');
});

declare global {
  namespace Cypress {
    interface Chainable {
      APITrailCreate(data: TrailOptions): Chainable<CypressResponse>;
      APITrailDelete(UUID: string): Chainable<Interception>;
      APITrailLinkMission(trail, mission, order): Chainable<Interception>;
      APITrailLinkPulse(trail, pulse, order): Chainable<Interception>;
      APITrailCreateWithExternalMission(): Chainable<Interception>;
      APITrailCreateWithInternalMission(): Chainable<CypressResponse>;
      APITrailGetEnrollment(trailId: string): Chainable<CypressResponse>;
    }
  }
}
