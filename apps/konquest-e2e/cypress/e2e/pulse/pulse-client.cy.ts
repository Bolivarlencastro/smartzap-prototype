/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import {
  ERROR_CONTENT_NOT_FOUND_GLOBAL_SEARCH,
  ERROR_PULSE_NOT_FOUND,
} from '../../support/constants/errors-messages-pulse';
import { USER_CY_ID } from '../../support/constants/users';
import ChannelElements from '../../support/elements/channel-elements';
import GlobalSearchElements from '../../support/elements/global-search-elements';
import PulseElements from '../../support/elements/pulse-elements';
import { ChannelPulseContentOptions, CypressResponse } from '../../support/interfaces';
import * as util from '../../support/constants/utils';
let fixtures;
let channelID;
let pulseID;

describe('Channel with youtube pulse', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesChannelPulseContent()
      .then((reponse: ChannelPulseContentOptions) => {
        fixtures = reponse;
        return cy.CreateChannelWithPulseFile(fixtures.content.video, fixtures);
      })
      .then((response: { channel: string; pulse: string }) => {
        channelID = response.channel;
        pulseID = response.pulse;
      });
  });
  it('I should see the pulse in the favorites filter after I add it to favorite', () => {
    cy.Login('user');
    cy.PulseAccess();
    cy.PulseSearch(fixtures.pulse.name);
    cy.PulseFavorite();

    ChannelElements.searchInput().clear();
    cy.PulseFilterFavorites();
    cy.PulseSearch(fixtures.pulse.name);
    PulseElements.pulseCardSelector();
    PulseElements.pulseCardSelector().contains(fixtures.pulse.name);
  });

  it('I should not see the pulse in the favorites filter after I remove it to favorite', () => {
    cy.Login('user');
    cy.APIPulseFavorite(pulseID, USER_CY_ID);
    cy.PulseAccess();
    cy.PulseSearch(fixtures.pulse.name);
    PulseElements.pulseCardSelector().contains(fixtures.pulse.name);
    cy.PulseUnfavorite();

    ChannelElements.searchInput().clear();
    cy.PulseFilterFavorites();
    cy.PulseSearch(fixtures.pulse.name);
    cy.PulseFilterFavorites();
    cy.PulseFilterFavorites();
    PulseElements.pulseAlertSelector().contains(ERROR_PULSE_NOT_FOUND);
  });
});

describe('Inactive channel with pulse file image', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesChannelPulseContent().then((response) => {
      fixtures = response;
      fixtures.channel.active = false;
      cy.CreateChannelWithPulseFile(fixtures.content.image, fixtures).then((response: any) => {
        channelID = response.body.channel;
      });
    });
  });
  it('Should not see pulse on inactive channel', () => {
    cy.Login('user');
    cy.PulseAccess();
    cy.PulseSearch(fixtures.pulse.name);
    PulseElements.pulseAlertSelector().contains(ERROR_PULSE_NOT_FOUND);

    cy.GlobalSearchAccess();
    cy.GlobalSearchPulseTab();
    cy.GlobalSearch(fixtures.pulse.name);
    GlobalSearchElements.textContentNotFound().contains(ERROR_CONTENT_NOT_FOUND_GLOBAL_SEARCH);
  });
});

describe('Closed channel with pulse file image', () => {
  const CLOSED_CHANNEL_UUID = util.CLOSED_TYPE_ID;
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesChannelPulseContent().then((response) => {
      fixtures = response;
      fixtures.channel.typeUUID = CLOSED_CHANNEL_UUID;
      cy.CreateChannelWithPulseFile(fixtures.content.image, fixtures).then((response: any) => {
        channelID = response.body.channel;
      });
    });
  });
  it('Should not see pulse on closed channel', () => {
    cy.Login('user');
    cy.PulseAccess();
    cy.PulseSearch(fixtures.pulse.name);
    PulseElements.pulseAlertSelector().contains(ERROR_PULSE_NOT_FOUND);

    cy.GlobalSearchAccess();
    cy.GlobalSearchPulseTab();
    cy.GlobalSearch(fixtures.pulse.name);
    // GlobalSearchElements.textContentNotFound().contains(ERROR_CONTENT_NOT_FOUND_GLOBAL_SEARCH); TODO: DEV-19758
  });
});

describe('User actions in pulse type quiz', () => {
  const NUMBER_OF_QUESTIONS = 3;

  beforeEach(() => {
    cy.Login('admin');

    cy.FixturesChannelAndPulse()
      .then((response) => {
        fixtures = response;
        fixtures.channel.name = getRandomName();
        return cy.APIChannelCreate(fixtures.channel);
      })
      .then((response: CypressResponse) => {
        channelID = response.body.id;
        return cy.APIPulseCreateQuizWithMultipleQuestions(channelID, NUMBER_OF_QUESTIONS);
      })
      .then((pulseCreated: CypressResponse) => {
        pulseID = pulseCreated.body.id;
        fixtures.pulse.name = pulseCreated.body.name;
      });
  });

  it('Should I consume a quiz-type pulse and get all the questions right', () => {
    cy.viewport(1920, 1080);
    cy.Login('user');
    cy.OpenPulseContent(fixtures.pulse);
    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++) {
      cy.PulseValidateAndAnswerQuiz();
      PulseElements.quizOption().should('have.length', 3);
      cy.PulseSelectCorrectAnswerOnQuiz();

      if (i !== NUMBER_OF_QUESTIONS - 1) {
        PulseElements.messageCorrectAnswer().should('be.visible');
        PulseElements.topNumberCorrectAnswers().contains(i + 1);
        PulseElements.buttonSkipQuestion().should('be.visible').click();
      } else {
        PulseElements.messageCorrectAnswer().should('be.visible');
        PulseElements.topNumberCorrectAnswers().contains(NUMBER_OF_QUESTIONS);
        PulseElements.buttonSkipQuestion().should('not.exist');
        cy.GetMetaDataSelectorAndClick('button-next-on-quiz');
      }
    }
    cy.PulseValidatFinishQuiz();
    PulseElements.numberCorrectAnswersOnFinshPage().contains(NUMBER_OF_QUESTIONS);
  });

  it('Should I consume a quiz-type pulse and get 2 questions wrong', () => {
    cy.viewport(1920, 1080);
    cy.Login('user');
    cy.OpenPulseContent(fixtures.pulse);

    for (let i = 0; i < 1; i++) {
      cy.PulseValidateAndAnswerQuiz();
      PulseElements.quizOption().should('have.length', 3);
      cy.PulseSelectCorrectAnswerOnQuiz();
      PulseElements.messageCorrectAnswer().should('be.visible');
      PulseElements.topNumberCorrectAnswers().contains(i + 1);
      PulseElements.buttonSkipQuestion().should('be.visible').click();
    }

    for (let i = 1; i < NUMBER_OF_QUESTIONS; i++) {
      cy.PulseValidateAndAnswerQuiz();
      PulseElements.quizOption().should('have.length', 3);
      cy.PulseSelectIncorrectAnswerOnQuiz();

      if (i !== NUMBER_OF_QUESTIONS - 1) {
        PulseElements.messageIncorrectAnswer().should('be.visible');
        PulseElements.topNumberIncorrectAnswers().contains(i);
        PulseElements.buttonSkipQuestion().should('be.visible').click();
      } else {
        PulseElements.messageIncorrectAnswer().should('be.visible');
        PulseElements.topNumberIncorrectAnswers().contains(i);
        PulseElements.buttonSkipQuestion().should('not.exist');
        cy.GetMetaDataSelectorAndClick('button-next-on-quiz');
      }
    }
    cy.PulseValidatFinishQuiz();
    PulseElements.numberCorrectAnswersOnFinshPage().contains(1);
    PulseElements.numberIncorrectAnswersOnFinshPage().contains(2);
  });

  it('Should I navigate a pulse type quiz answered', () => {
    cy.viewport(1920, 1080);
    cy.Login('user');
    cy.ConsumePulseTypeQuiz(pulseID, NUMBER_OF_QUESTIONS);
    cy.PulseTypeQuizAccessDirectly(pulseID);
    cy.PulseTypeQuizAlreadyAnsweredNavigate(NUMBER_OF_QUESTIONS);
    for (let i = 0; i < 4; i++) {
      cy.GetMetaDataSelectorAndClick('button-back');
    }
    cy.url().should('include', '/pulse');
    PulseElements.pulsesPageSelector().should('be.visible');
  });

  it('When accessing a quiz-type pulse with an already answered question, I should navigate to an unanswered question', () => {
    cy.viewport(1920, 1080);
    cy.Login('user');
    cy.PulseTypeQuizAccessDirectly(pulseID);
    cy.PulseSelectCorrectAnswerOnQuiz();
    PulseElements.messageCorrectAnswer().should('be.visible');
    PulseElements.buttonSkipQuestion().should('be.visible').click();
    cy.PulseTypeQuizAccessDirectly(pulseID);
    PulseElements.buttonSkipQuestion().should('be.visible').click();
    PulseElements.topNumberCorrectAnswers().contains(1);
    PulseElements.currentAndLastQuestionSelector().contains(`Pergunta 0${2} de 0${NUMBER_OF_QUESTIONS}`);
    PulseElements.quizOption().should('have.length', 3);
    PulseElements.messageCorrectAnswer().should('not.exist');
    PulseElements.messageIncorrectAnswer().should('not.exist');
  });
});

afterEach(() => {
  if (channelID) {
    cy.Login('admin');
    cy.APIChannelDelete(channelID);
  }
});
