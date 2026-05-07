/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
let channelCreatedBefore;

describe('Edit Channel', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesChannel()
      .then((channel) => ({ ...channel, name: getRandomName() }))
      .then((channel) => cy.APIChannelCreate(channel))
      .then((response) => (channelCreatedBefore = response.body));
  });

  it('Edit channel - Change Type ', () => {
    const typeEdited = 'Fechado para a Workspace';
    cy.ChannelAccessOpen(channelCreatedBefore.id)
      .ChannelEdit()
      .ChannelSelectType(typeEdited)
      .ChannelSave('edit')
      .then((channelEdit) => {
        cy.ChannelAccessOpen(channelEdit.id).ChannelEdit().ChannelValidType(typeEdited);
      });
  });

  it('Edit channel - Change Categorie: ', () => {
    const categorieEdited = 'automação cy 2';
    cy.ChannelAccessOpen(channelCreatedBefore.id)
      .ChannelEdit()
      .ChannelSelectCategorie(categorieEdited)
      .ChannelSave('edit')
      .then((channelEdit) => {
        cy.ChannelAccessOpen(channelEdit.id).ChannelEdit().ChannelValidCategorie(categorieEdited);
      });
  });

  it('Edit channel - Change Language ', () => {
    const languageEdited = 'Inglês';
    cy.ChannelAccessOpen(channelCreatedBefore.id)
      .ChannelEdit()
      .ChannelSelectLanguage(languageEdited)
      .ChannelSave('edit')
      .then((channelEdit) => {
        cy.ChannelAccessOpen(channelEdit.id).ChannelEdit().ChannelValidLanguage(languageEdited);
      });
  });

  it('Edit channel - Change Description ', () => {
    const descriptionEdited = 'Description Edited';
    cy.ChannelAccessOpen(channelCreatedBefore.id)
      .ChannelEdit()
      .ChannelTypeDescription(descriptionEdited)
      .ChannelSave('edit')
      .then((channelEdit) => {
        cy.ChannelAccessOpen(channelEdit.id).ChannelEdit().ChannelValidDescription(descriptionEdited);
      });
  });

  it('Edit channel - Change Active ', () => {
    const activeChange = false;
    cy.ChannelAccessOpen(channelCreatedBefore.id)
      .ChannelEdit()
      .ChannelCheckActive(false)
      .ChannelSave('edit')
      .then((channelEdit) => {
        cy.ChannelAccessOpen(channelEdit.id).ChannelEdit().ChannelValidActive(activeChange);
      });
  });

  afterEach(() => {
    if (channelCreatedBefore?.id) cy.APIChannelDelete(channelCreatedBefore.id);
    channelCreatedBefore = {};
  });
});
