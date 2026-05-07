/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import * as StatusCode from '../../support/constants/status-code';
import { ChannelOptions } from '../../support/interfaces';
let channelCreatedBefore: ChannelOptions;

describe('Pulse tests with quiz type', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesChannel().then((channelDefault) => {
      channelDefault.name = getRandomName();
      cy.APIChannelCreate(channelDefault).then((response) => {
        expect(response.status).eq(StatusCode.Created);
        expect(response.body.id).not.to.be.empty;
        channelCreatedBefore = response.body;
      });
    });
  });

  it('Create a pulse QUIZ type', () => {
    cy.PulseCreateWithQuiz(channelCreatedBefore.id, 'quiz', { name: getRandomName() }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated);
      cy.PulseValidQuizContent(pulseCreated.id);
    });
  });
});
