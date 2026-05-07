/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
let channelCreatedBefore: any = {};

context('Delete Channel', () => {
  describe('Delete', () => {
    beforeEach(() => {
      cy.Login('admin');
      cy.FixturesChannel()
        .then((channel) => ({ ...channel, name: getRandomName() }))
        .then((channel) => cy.APIChannelCreate(channel))
        .then((response) => (channelCreatedBefore = response.body));
    });
    it('Delete Channel ', () => {
      cy.ChannelAccessOpen(channelCreatedBefore.id);
      cy.ChannelDelete();
    });
  });
});
