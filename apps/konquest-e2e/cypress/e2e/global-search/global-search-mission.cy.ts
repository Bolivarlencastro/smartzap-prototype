const missionDefaultPath = `${Cypress.env('ENVIRONMENT')}/mission/default`;
import { getRandomName } from '../../support/commands';
import GlobalSearchElements from '../../support/elements/global-search-elements';
import * as StatusCode from '../../support/constants/status-code';
let createdMission;
let missionToDelete;

beforeEach(() => {
  cy.Login('admin');
  cy.fixture(missionDefaultPath)
    .then((fixture) => ({ ...fixture, name: getRandomName() }))
    .then((mission) => cy.APIMissionCreate(mission))
    .then((response) => {
      createdMission = response.body;
      missionToDelete = response.body.id;
    });
});
it('Should found mission at global search', () => {
  cy.MissionWaitLoad();
  cy.GlobalSearchAccess();

  cy.intercept('**=courses').as('loadMissionSearch');
  GlobalSearchElements.buttonMissionOnGlobalSearch().click();
  cy.wait('@loadMissionSearch');
  cy.GlobalSearch(createdMission.name);

  cy.intercept(`**/missions/${createdMission.id}`).as('loadMission');
  GlobalSearchElements.listItems().should('contain', createdMission.name);
  GlobalSearchElements.buttonOpenItem(createdMission.name).scrollIntoView().click({ force: true });
  cy.wait('@loadMission').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.OK);
  });
});

afterEach(() => {
  if (missionToDelete) {
    cy.APICourseDelete(missionToDelete);
  }
});
