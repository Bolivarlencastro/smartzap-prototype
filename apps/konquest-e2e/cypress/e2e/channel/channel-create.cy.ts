/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import ChannelElements from '../../support/elements/channel-elements';
import * as StatusCode from '../../support/constants/status-code';
import { ChannelOptions } from '../../support/interfaces';
import PulseElements from '../../support/elements/pulse-elements';
import * as util from '../../support/constants/utils';
let channelToDelete: any = {};
let channelFixtures;

describe('Create Channel', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.PulseAccess();
    cy.ChannelTabAccess();
  });
  it('Create a channel - Happy Way', () => {
    cy.intercept('**/cover-images-by-size').as('cover-images');
    cy.fixture(util.FIXTURE_PATH_CHANNEL_INDEX)
      .then((channel) => ({ ...channel, name: getRandomName() }))
      .then((response) => {
        channelFixtures = response;
        cy.ChannelCreate(channelFixtures);
      })
      .then((channelCreated) => {
        channelToDelete = channelCreated;
        ChannelElements.buttonFinishChannel();
        ChannelElements.inputChannelBanner().selectFile(util.FILE_PATH_IMAGE_PNG_1, { force: true });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        PulseElements.CropperButtonSave().click({ force: true });
        cy.wait('@cover-images').should((response) => {
          expect(response.response.statusCode).eq(StatusCode.OK);
        });
        ChannelElements.buttonFinishChannel().click();
        cy.NavigateTo('pulse');
        cy.SearchChannelOrPulse(channelFixtures.name);
        cy.ChannelCardSelect(channelFixtures.name);
        cy.ChannelEdit();
        cy.ChannelValid(channelFixtures);
      });
  });

  it('Should create a channel with status inactive', () => {
    cy.fixture(util.FIXTURE_PATH_CHANNEL_INDEX)
      .then((channel) => ({ ...channel, active: false, name: getRandomName() }))
      .then((channel) => cy.ChannelCreate(channel))
      .then((channelCreated: ChannelOptions) => {
        channelToDelete = channelCreated;
        cy.ChannelFinish();
        cy.NavigateTo('pulse');
        cy.ChannelInactiveVerified(channelCreated.name);
      });
  });

  it('Create a channel - Closed', () => {
    cy.fixture(util.FIXTURE_PATH_CHANNEL_INDEX).then((channelDefault) => {
      channelDefault.type = 'Fechado para a Workspace';
      cy.ChannelCreate(channelDefault).then((channelCreated: ChannelOptions) => {
        channelToDelete = channelCreated;
        cy.ChannelFinish();
        cy.NavigateTo('pulse');
        cy.ChannelTabAccess();
        cy.SearchChannelOrPulse(channelDefault.name);
        cy.ChannelCardSelect(channelCreated.name);
        cy.ChannelClosed(channelDefault.type);
        cy.ChannelEdit();
        cy.ChannelValid(channelDefault);
      });
    });
  });

  it('Create a channel - Without Name', () => {
    cy.fixture(util.FIXTURE_PATH_CHANNEL_INDEX).then((channelDefault) => {
      channelDefault.name = null;
      cy.ChannelOpenFillCreateForm(channelDefault);
      cy.ChannelValidNameRequired(channelDefault.messages.nameRequired);
      cy.ChannelValidCantSave();
    });
  });

  it('Create a channel - Without Categorie', () => {
    cy.fixture(util.FIXTURE_PATH_CHANNEL_INDEX).then((channelDefault) => {
      channelDefault.categorie = null;
      cy.ChannelOpenFillCreateForm(channelDefault);
      cy.ChannelValidCategorieRequired(channelDefault.messages.categorieRequired);
      cy.ChannelValidCantSave();
    });
  });
  it('Create a channel - Without Type', () => {
    cy.fixture(util.FIXTURE_PATH_CHANNEL_INDEX).then((channelDefault) => {
      channelDefault.type = null;
      cy.ChannelOpenFillCreateForm(channelDefault);
      cy.ChannelValidTypeRequired(channelDefault.messages.typeRequired);
      cy.ChannelValidCantSave();
    });
  });
  it('Create a channel - Without Language', () => {
    cy.fixture(util.FIXTURE_PATH_CHANNEL_INDEX).then((channelDefault) => {
      channelDefault.language = null;
      cy.ChannelOpenFillCreateForm(channelDefault);
      cy.ChannelValidCantSave();
    });
  });

  it('Create a channel - Without Description', () => {
    cy.fixture(util.FIXTURE_PATH_CHANNEL_INDEX).then((channelDefault) => {
      channelDefault.description = null;
      cy.ChannelOpenFillCreateForm(channelDefault);
      cy.ChannelValidDescriptionRequired(channelDefault.messages.descriptionRequired);
      cy.ChannelValidCantSave();
    });
  });
});

afterEach(() => {
  if (channelToDelete.id) cy.APIChannelDelete(channelToDelete.id);
  channelToDelete = {};
});
