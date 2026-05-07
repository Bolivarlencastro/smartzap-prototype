/// <reference types="cypress" />
const channelDefaultPath = `${Cypress.env('ENVIRONMENT')}/channel/default`;
import * as StatusCode from '../../support/constants/status-code';
import { getRandomName } from '../../support/commands';
import ChannelElements from '../../support/elements/channel-elements';
let createdChannel;
const metadataValues = [
  'channel-total-pulses-selector',
  'channel-card-button-subscribe',
  'channel-ratting-selector',
  'channel-pulses-selector',
];

describe('User actions on pulses in mobile view', () => {
  beforeEach(() => {
    cy.fixture(channelDefaultPath)
      .then((channelDefault) => ({ ...channelDefault, name: getRandomName() }))
      .then((channel) => {
        cy.Login('admin');
        cy.APIChannelCreate(channel).then((response) => {
          expect(response.status).eq(StatusCode.Created);
          createdChannel = response.body;
        });
      });
  });

  it('As a user subscribe on channel in the channel list', () => {
    cy.Login('user');
    cy.PulseMobileAccess();
    ChannelElements.mobileButtonChannelTab().click();
    cy.ChannelMobileSearch(createdChannel.name);
    cy.ChannelMobileCardSubscribe();
    cy.ChannelMobileCardSelect(createdChannel.name);
    ChannelElements.mobileNumberEnrolledInChannel().contains('1');
    ChannelElements.mobileChannelSubscribeButton().contains('Inscrito');
  });

  it('As a user I access the channel and verify channel specific fields are visible', () => {
    cy.Login('user');
    cy.PulseMobileAccess();
    ChannelElements.mobileButtonChannelTab().click();
    cy.ChannelMobileSearch(createdChannel.name);
    cy.ChannelMobileCardSelect(createdChannel.name);

    ChannelElements.mobileChannelName().contains(createdChannel.name);
    ChannelElements.mobileChannelDescription().contains(createdChannel.description);
    ChannelElements.channelTab().should('have.length', 2);
    metadataValues.forEach((metadataValue) => {
      cy.VerifyMetadataElementVisible(metadataValue);
    });
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APIChannelDelete(createdChannel.id);
  });
});
