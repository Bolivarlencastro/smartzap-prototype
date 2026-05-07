import { getRandomName } from '../../support/commands';
import { TrailOptions } from '../../support/interfaces/trail-options';
let createdTrail: TrailOptions;
let trailToDelete;

it('Admin should transfer a trail for another owner', () => {
  cy.Login('admin');
  cy.FixturesTrail()
    .then((fixture) => {
      const TRAIL_PAYLOAD = { ...fixture, name: getRandomName() };
      return cy.APITrailCreate(TRAIL_PAYLOAD);
    })
    .then((trail) => {
      createdTrail = trail.body;
      trailToDelete = createdTrail.id;
    })
    .then(() => {
      cy.TrailCreatedByMe();
      cy.TrailSearch(createdTrail.name);
      cy.TrailOpenCard(createdTrail.name);
      cy.GetMetaDataSelectorAndClick('trail-menu');
      cy.GetMetaDataSelectorAndClick('button-transfer');
      cy.MissionOrTrailSelectUserToTransfer(Cypress.env('admin_cy2'));
      cy.TrailTransferConfirm();

      cy.Login('admin2');
      cy.TrailCreatedByMe();
      cy.TrailSearch(createdTrail.name);
      cy.TrailOpenCard(createdTrail.name);
    });
});

afterEach(() => {
  if (trailToDelete) {
    cy.APITrailDelete(trailToDelete);
  }
});
