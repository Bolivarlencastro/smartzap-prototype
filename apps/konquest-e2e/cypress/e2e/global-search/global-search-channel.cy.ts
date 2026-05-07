import { getRandomName } from '../../support/commands';
import GlobalSearchElements from '../../support/elements/global-search-elements';
import * as StatusCode from '../../support/constants/status-code';
const channelFixture = `${Cypress.env('ENVIRONMENT')}/channel/default`;
let createdChannel;
let channelToDelete;

beforeEach(() => {
  cy.Login('admin');
  cy.fixture(channelFixture)
    .then((fixture) => ({ ...fixture, name: getRandomName() }))
    .then((payload) => cy.APIChannelCreate(payload))
    .then((channel) => {
      createdChannel = channel.body;
      channelToDelete = createdChannel.id;
    });
});
it('Should found channel at global search', () => {
  cy.MissionWaitLoad();
  cy.GlobalSearchAccess();

  cy.intercept('**=channels').as('loadChannelSearch');
  GlobalSearchElements.buttonChannelOnGlobalSearch().should('be.visible').click();
  cy.wait('@loadChannelSearch');
  cy.GlobalSearch(createdChannel.name);

  cy.intercept(`**/channels/${createdChannel.id}`).as('loadChannel');
  GlobalSearchElements.listItems().should('contain', createdChannel.name);
  GlobalSearchElements.buttonOpenItem(createdChannel.name).scrollIntoView().click({ force: true });
  cy.wait('@loadChannel').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.OK);
  });
});

afterEach(() => {
  if (channelToDelete) {
    cy.APIChannelDelete(channelToDelete);
  }
});
