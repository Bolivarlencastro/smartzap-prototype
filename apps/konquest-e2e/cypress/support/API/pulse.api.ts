import { CypressResponse, PulseOptions } from '../interfaces';
import { getRandomName } from '../../support/commands';

const baseUrlPulse = `${Cypress.env('url_api')}/pulses`;

Cypress.Commands.add('APIPulseCreate', (data) => {
  const body = {
    name: data.name,
    description: data.description,
    learn_content_uuid: data.learn_content_uuid,
    user_creator: data.user_creator,
    pulse_type: data.pulse_type,
  };
  return cy.keepsApi(baseUrlPulse, body, 'POST');
});

Cypress.Commands.add('APIPulseCreateQuiz', (channelID) => {
  const body = {
    name: getRandomName(),
    exam: {
      title: getRandomName(),
      questions: [
        {
          id: null,
          exam_question: getRandomName(),
          points: 5,
          question_type: 'correct_choices',
          options: [
            {
              id: null,
              option: 'Correct',
              correct_answer: true,
            },
            {
              id: null,
              option: getRandomName(),
              correct_answer: false,
            },
            {
              id: null,
              option: getRandomName(),
              correct_answer: false,
            },
          ],
        },
      ],
    },
  };
  return cy.keepsApi(`${Cypress.env('url_api')}/channels/${channelID}/pulses/exams`, body, 'POST');
});

Cypress.Commands.add('APIPulseCreateQuizWithMultipleQuestions', (channelID, numberOfQuestions) => {
  const questions = [];

  for (let i = 0; i < numberOfQuestions; i++) {
    questions.push({
      id: null,
      exam_question: getRandomName(),
      points: 5,
      question_type: 'correct_choices',
      options: [
        { id: null, option: 'Correct', correct_answer: true },
        { id: null, option: getRandomName(), correct_answer: false },
        { id: null, option: getRandomName(), correct_answer: false },
      ],
    });
  }

  const body = {
    name: getRandomName(),
    exam: {
      title: getRandomName(),
      questions,
    },
  };

  cy.keepsApi(`${Cypress.env('url_api')}/channels/${channelID}/pulses/exams`, body, 'POST');
});

Cypress.Commands.add('APIPulseDelete', (UUID) => {
  cy.keepsApi(`${baseUrlPulse}/${UUID}`, {}, 'DELETE');
});

Cypress.Commands.add('APIPulseFavorite', (pulseID, userID) => {
  const body = {
    pulse: pulseID,
    user: userID,
  };
  cy.keepsApi(`${baseUrlPulse}/bookmarks`, body, 'POST');
});

declare global {
  namespace Cypress {
    interface Chainable {
      APIPulseCreate(data: PulseOptions): Chainable<CypressResponse<PulseOptions>>;
      APIPulseCreateQuiz(channelID): Chainable<CypressResponse<PulseOptions>>;
      APIPulseDelete(UUID): Chainable<CypressResponse<PulseOptions>>;
      APIPulseFavorite(pulseID, userID: string): Chainable<CypressResponse<PulseOptions>>;
      APIPulseCreateQuizWithMultipleQuestions(channelID, numberOfQuestions): Chainable<CypressResponse<PulseOptions>>;
    }
  }
}
