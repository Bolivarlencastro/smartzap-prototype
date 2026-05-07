/// <reference types="cypress" />
import ChannelElements from '../../support/elements/channel-elements';
import PulsesElements from '../../support/elements/pulse-elements';
import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';

let channels = [];
const pulses = [];

describe('Channel - Client Filters', () => {
  before(() => {
    cy.Login('admin');

    cy.FixturesChannel()
      .then((channel) => ({ ...channel, name: getRandomName() }))
      .then((channel) => cy.APIChannelCreate(channel))
      .then((response) => channels.push(response.body))
      .then(() => {
        cy.PulseCreateInChannel(channels[0].name, 'video', {
          file: util.FILE_PATH_VIDEO_MP4,
          thumbnail: util.FILE_PATH_IMAGE_PNG_1,
          name: getRandomName(),
        });
      })
      .then((pulse) => pulses.push(pulse));

    cy.FixturesChannel()
      .then((channel) => ({ ...channel, name: getRandomName() }))
      .then((channel) => cy.APIChannelCreate(channel))
      .then((response) => channels.push(response.body))
      .then(() => {
        cy.PulseCreateInChannel(channels[1].name, 'video', {
          file: util.FILE_PATH_VIDEO_MP4,
          thumbnail: util.FILE_PATH_IMAGE_PNG_1,
          name: getRandomName(),
        });
      })
      .then((pulse) => pulses.push(pulse));

    cy.FixturesChannel()
      .then((channel) => ({ ...channel, name: getRandomName(), active: false }))
      .then((channel) => cy.APIChannelCreate(channel))
      .then((response) => channels.push(response.body));
  });

  it('Should see filter subscribed channels as common user', () => {
    cy.Login('user');
    cy.PulseAccess();
    cy.ChannelTabAccess();
    cy.ChannelSubscribedAndVerified(channels[0].name);
    cy.ChannelFilterSubscribed();
    cy.ChannelSubscribedAndVerified(channels[1].name);
    cy.ChannelFilterSubscribed();
    ChannelElements.searchInput().clear();
  });

  it('Should access pulses in subscribed channels previously created', () => {
    cy.Login('user');
    cy.OpenPulseContent(pulses[0]).url().should('include', pulses[0].id);
    PulsesElements.pulseDetailTitle().contains(pulses[0].name);

    cy.OpenPulseContent(pulses[1]).url().should('include', pulses[1].id);
    PulsesElements.pulseDetailTitle().contains(pulses[1].name);
  });

  it('Should not access inactivated channel', () => {
    const inactivatedChannel = channels[2];
    cy.Login('user');
    cy.PulseAccess();
    cy.ChannelTabAccess();
    cy.SearchChannelOrPulse(inactivatedChannel.name);

    ChannelElements.channelMessageBox().should('be.visible');
    ChannelElements.channelMessageBox().contains('Nenhum canal encontrado.');
  });

  after(() => {
    cy.Login('admin');
    channels.forEach((channel) => {
      if (channel.id) cy.APIChannelDelete(channel.id).log('excluiu', channel.id);
    });
    channels = [];
  });
});
