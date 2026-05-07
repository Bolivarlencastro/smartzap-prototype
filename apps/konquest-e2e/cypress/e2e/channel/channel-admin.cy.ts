/// <reference types="cypress" />
import * as util from '../../support/constants/utils';
import { getRandomName } from '../../support/commands';
import ChannelElements from '../../support/elements/channel-elements';
let channel: any = {};
let channelToDelete;

describe('Admin user channel actions', () => {
  it('Should channel created by current admin user', () => {
    cy.Login('admin');
    cy.FixturesChannel()
      .then((channel) => cy.APIChannelCreate({ ...channel, name: getRandomName() }))
      .then((response) => {
        channel = response.body;
        channelToDelete = channel.id;
        cy.PulseAccess();
        cy.ChannelTabAccess();
        cy.SearchChannelOrPulse(channel.name);
        cy.ChannelCardSelect(channel.name);
      });
  });

  it('As an admin user, check filter subscribed', () => {
    cy.Login('admin');
    cy.FixturesChannel()
      .then((channel) => cy.APIChannelCreate({ ...channel, name: getRandomName() }))
      .then((response) => {
        channel = response.body;
        channelToDelete = channel.id;
        cy.Login('admin2');
        cy.PulseAccess();
        cy.ChannelTabAccess();
        cy.SearchChannelOrPulse(channel.name);
        cy.ChannelCardSubscribe(channel.name);
        cy.reload().then(() => {
          cy.intercept('**/channels**').as('channelsLoad');
          cy.wait('@channelsLoad');
          cy.ChannelFilterSubscribed();
          cy.SearchChannelOrPulse(channel.name);
          cy.ChannelCardSelect(channel.name);
        });
      });
  });

  it('Should create and open inactivated channel with owner', () => {
    cy.Login('admin');

    cy.FixturesChannelPulseContent()
      .then((fixtures) => {
        return cy.CreateChannelWithPulseFile(fixtures.content.video, {
          ...fixtures,
          channel: { ...fixtures.channel, name: getRandomName(), active: false },
        });
      })
      .then((response) => {
        channelToDelete = response.channel.id;
        channel = response.channel;

        cy.PulseAccess();
        cy.ChannelTabAccess();
        cy.ChannelFilterCreatedWithMe();

        cy.SearchChannelOrPulse(channel.name);
        ChannelElements.statusInactiveChannel().should('be.visible');

        cy.ChannelCardSelect(channel.name);
        ChannelElements.channelInactiveSelector().should('be.visible');
      });
  });

  afterEach(() => {
    if (channelToDelete) {
      cy.Login('admin');
      cy.APIChannelDelete(channelToDelete);
      channelToDelete = {};
    }
  });
});

describe('Super admin channel test', () => {
  it.skip('As a super-admin, I should access a closed channel created by another admin and open pulse', () => {
    //TO DO: DEV-29929
    cy.Login('admin');
    cy.FixturesChannelPulseContent()
      .then((fixtures) => {
        return cy.CreateChannelWithPulseFile(fixtures.content.video, {
          ...fixtures,
          channel: { ...fixtures.channel, name: getRandomName(), active: false },
        });
      })
      .then((response) => {
        channelToDelete = response.channel.id;
        channel = response.channel;

        cy.Login('superAdmin');
        cy.PulseAccess();
        cy.ChannelTabAccess();

        cy.SearchChannelOrPulse(channel.name);
        ChannelElements.statusInactiveChannel().should('be.visible');

        cy.ChannelCardSelect(channel.name);
        ChannelElements.channelInactiveSelector().should('be.visible');

        cy.PulseSelectCard();
        cy.PulseValidPlayableContent({ video: true });
      });
  });

  it('As a super-admin, I should access a closed channel created by another admin and be able to edit', () => {
    cy.Login('admin');
    cy.FixturesChannelPulseContent()
      .then((fixtures) => {
        return cy.CreateChannelWithPulseFile(fixtures.content.video, {
          ...fixtures,
          channel: { ...fixtures.channel, name: getRandomName(), typeUUID: util.CLOSED_TYPE_ID },
        });
      })
      .then((response) => {
        channelToDelete = response.channel.id;
        channel = response.channel;

        cy.Login('superAdmin');
        cy.PulseAccess();
        cy.ChannelTabAccess();
        cy.SearchChannelOrPulse(channel.name);
        cy.ChannelCardSelect(channel.name);
        cy.ChannelEdit();
        ChannelElements.channelForm().should('be.visible');
      });
  });

  afterEach(() => {
    if (channelToDelete) {
      cy.Login('superAdmin');
      cy.APIChannelDelete(channelToDelete);
      channelToDelete = {};
    }
  });
});
