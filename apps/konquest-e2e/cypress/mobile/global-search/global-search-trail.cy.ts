import { getRandomName } from '../../support/commands';
import GlobalSearchElements from '../../support/elements/global-search-elements';
const trailDefaultPath = `${Cypress.env('ENVIRONMENT')}/trail/default`;
import * as StatusCode from '../../support/constants/status-code';
let createdTrail;
let trailToDelete;

beforeEach(() => {
  cy.Login('admin');
  cy.fixture(trailDefaultPath)
    .then((fixture) => ({ ...fixture, name: getRandomName() }))
    .then((trail) => {
      cy.APITrailCreate(trail);
    })
    .then((trail) => {
      createdTrail = trail.body;
      trailToDelete = createdTrail.id;
    });
});
it('Should found trail at global search', () => {
  cy.MissionWaitLoad();
  cy.GlobalSearchAccess();

  cy.intercept('**=trails').as('loadTrailSearch');
  GlobalSearchElements.buttonTrailOnGlobalSearch().should('be.visible').scrollIntoView().click({ force: true });
  cy.wait('@loadTrailSearch');
  cy.GlobalSearch(createdTrail.name);

  cy.intercept(`**/learning-trails/${createdTrail.id}`).as('loadTrail');
  GlobalSearchElements.mobileItemName().should('contain', createdTrail.name).click();
  cy.wait('@loadTrail').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.OK);
  });
});

afterEach(() => {
  if (trailToDelete) {
    cy.APITrailDelete(trailToDelete);
  }
});
