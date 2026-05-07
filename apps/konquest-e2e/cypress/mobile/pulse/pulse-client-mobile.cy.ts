// <reference types="cypress" />

import PulseElements from '../../support/elements/pulse-elements';
import { ChannelPulseContentOptions } from '../../support/interfaces';
let fixtures;
let channelID;
const metadataValues = [
  'pulse-details-subscribe-channel-button',
  'pulse-details-total-subscribers',
  'pulse-details-type',
  'pulse-details-views',
  'pulse-details-create-date',
  'pulse-details-stars-rate',
  'pulse-details-favorite-button',
  'pulse-details-comment-button',
  'pulse-details-share-button',
  'pulse-details-content-viewer',
  'pulse-details-recommended-pulses',
  'pulse-details-comment-selector',
];

describe('Client actions on pulse tab', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesChannelPulseContent()
      .then((reponse: ChannelPulseContentOptions) => {
        fixtures = reponse;
        return cy.CreateChannelWithPulseFile(fixtures.content.video, fixtures);
      })
      .then((response: any) => (channelID = response.body.channel));
  });
  it('I should see pulse details after access the pulse screen', () => {
    cy.Login('user');
    cy.PulseMobileAccess();
    cy.PulseMobileSearch(fixtures.pulse.name);
    PulseElements.pulseCardSelector().click();
    metadataValues.forEach((metadataValue) => {
      cy.VerifyMetadataElementVisible(metadataValue);
    });
    PulseElements.pulseDetailsChannelName().contains(fixtures.channel.name);
    PulseElements.pulseDetailsPulseName().contains(fixtures.pulse.name);
    PulseElements.pulseDetailsDescription().contains(fixtures.pulse.description);
  });

  afterEach(() => {
    if (channelID) {
      cy.Login('admin');
      cy.APIChannelDelete(channelID);
    }
  });
});
