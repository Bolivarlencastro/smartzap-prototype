/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import { USER_CY_NAME } from '../../support/constants/users';
import * as util from '../../support/constants/utils';

describe('Channel Contributor Tests', () => {
  let createdChannels = [];

  before(() => {
    cy.Login('admin');

    cy.FixturesChannel()
      .then((channel) => ({
        ...channel,
        name: getRandomName(),
      }))
      .then((channel) => cy.APIChannelCreate(channel))
      .then((response) => {
        createdChannels.push(response.body);
      });
  });

  it('Should add a contributor to the channel', () => {
    //this test depends to the above

    const [channel] = createdChannels;

    cy.PulseAccess();
    cy.ChannelTabAccess();
    cy.SearchChannelOrPulse(channel.name);
    cy.ChannelCardSelect(channel.name);
    cy.ChannelAddContributor(USER_CY_NAME);
    cy.PressEsc();
    cy.ChannelVerifyContributorsQuantity('1');
    cy.ChannelVerifyUserContributorsPanel(USER_CY_NAME);
  });

  it('Should add a video pulse and open it as a channel contributor', () => {
    const [channel] = createdChannels;

    cy.Login('user');
    cy.PulseAccess();

    const pulseData = {
      file: util.FILE_PATH_VIDEO_MP4,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: getRandomName(),
    };

    cy.PulseCreateInChannel(channel.name, 'video', pulseData).then((pulse) => {
      cy.OpenPulseContent(pulse);
      cy.PulseValidPlayableContent({ video: true });
    });
  });

  after(() => {
    cy.Login('admin');
    createdChannels.forEach((channel) => {
      if (channel?.id) cy.APIChannelDelete(channel.id);
    });
    createdChannels = [];
  });
});

describe('Negative Scenarios', () => {
  let testChannel;

  beforeEach(() => {
    cy.Login('admin');

    cy.FixturesChannel()
      .then((channel) => ({
        ...channel,
        name: getRandomName(),
      }))
      .then((channel) => cy.APIChannelCreate(channel))
      .then((response) => {
        testChannel = response.body;
      });
  });

  it("Like a user when i not a contributor i can't add pulse to the channel", () => {
    cy.Login('user');
    cy.PulseAccess();
    cy.ChannelSelectedAndVerified(testChannel.name);
    cy.ChannelNewPulseNotExist();
  });

  afterEach(() => {
    cy.Login('admin');
    if (testChannel?.id) {
      cy.APIChannelDelete(testChannel.id);
    }
  });
});
