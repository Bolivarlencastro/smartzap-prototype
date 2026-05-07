import { getRandomName } from '../../support/commands';
import { ADMIN_CY_2 } from '../../support/constants/users';
import * as util from '../../support/constants/utils';
import ChannelElements from '../../support/elements/channel-elements';
let createdChannel;
let channelToDelete;

beforeEach(() => {
  cy.Login('admin');
  cy.FixturesChannel()
    .then((channel) => ({ ...channel, name: getRandomName() }))
    .then((channel) => cy.APIChannelCreate(channel))
    .then((response) => {
      createdChannel = response.body;
      channelToDelete = createdChannel.id;
    });
});

it('Should found channel at global search', () => {
  cy.PulseAccess();
  cy.ChannelTabAccess();
  cy.SearchChannelOrPulse(createdChannel.name);
  cy.ChannelCardSelect(createdChannel.name);
  cy.ChannelTransfer(Cypress.env('admin_cy2'));

  ChannelElements.ownerUserChannel().should('contain.text', ADMIN_CY_2);
  cy.Login('admin2');
  cy.PulseAccess();
  cy.ChannelTabAccess();
  cy.SearchChannelOrPulse(createdChannel.name);
  cy.ChannelCardSelect(createdChannel.name);
  ChannelElements.ownerUserChannel().should('contain.text', ADMIN_CY_2);
});

afterEach(() => {
  if (channelToDelete) {
    cy.APIChannelDelete(channelToDelete);
  }
});
