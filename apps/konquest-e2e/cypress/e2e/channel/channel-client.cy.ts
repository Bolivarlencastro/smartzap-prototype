/// <reference types="cypress" />
import * as StatusCode from '../../support/constants/status-code';
import { getRandomName } from '../../support/commands';
import ChannelElements from '../../support/elements/channel-elements';
import { USER_CY_NAME } from '../../support/constants/users';
let createdChannel;

beforeEach(() => {
  cy.FixturesChannel()
    .then((channelDefault) => ({ ...channelDefault, name: getRandomName() }))
    .then((channel) => {
      cy.Login('admin');
      cy.APIChannelCreate(channel).then((response) => {
        expect(response.status).eq(StatusCode.Created);
        createdChannel = response.body;
      });
    })
    .then(() => {
      cy.Login('user');
      cy.PulseAccess();
    });
});

it('Should subscribe on channel in the channel list', () => {
  const enrolledUser = USER_CY_NAME;
  cy.ChannelTabAccess();
  cy.SearchChannelOrPulse(createdChannel.name);
  cy.ChannelCardSubscribe(createdChannel.name);
  cy.ChannelCardSelect(createdChannel.name);
  ChannelElements.channelDetailName().contains(createdChannel.name);
  ChannelElements.numberEnrolledUserChannel().click();
  ChannelElements.nameEnrolledUserChannel(enrolledUser);
});

afterEach(() => {
  cy.Login('admin');
  cy.APIChannelDelete(createdChannel.id);
});
