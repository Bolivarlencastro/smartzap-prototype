/// <reference types="cypress" />

import { CourseOptions, QuizOptions, userOptions } from './interfaces';
import { FixtureContent } from './interfaces/content-options';
import { EnrollmentOptions } from './interfaces/enrollment-options';

const courseDefaultPath = `./course/default`;
const quizDefaultPath = `./content/quiz/quiz.json`;
const contentDefaultPath = `./content/default`;
const enrollmentDefaultPath = `./enrollment/default`;
const usersDefaultPath = `./users/default.json`;

Cypress.Commands.add('FixturesCourse', () => {
  cy.fixture(courseDefaultPath).then((defaultCourse: CourseOptions) => {
    defaultCourse.name = getRandomName();
    return defaultCourse;
  });
});

Cypress.Commands.add('FixturesContent', () => {
  cy.fixture(contentDefaultPath).then((defaultContent) => {
    return defaultContent;
  });
});

Cypress.Commands.add('FixturesEnrollment', () => {
  cy.fixture(enrollmentDefaultPath).then((defaultEnrollment) => {
    return defaultEnrollment;
  });
});

Cypress.Commands.add('FixturesQuiz', () => {
  cy.fixture(quizDefaultPath).then((defaultQuiz: QuizOptions) => {
    defaultQuiz.question = getRandomName();
    return defaultQuiz;
  });
});

Cypress.Commands.add('FixturesUser', () => {
  cy.fixture(usersDefaultPath).then((userDefault: userOptions) => {
    userDefault.name = getRandomName();
    userDefault.email = `${getRandomName()}@cypress.com.br`;
    return userDefault;
  });
});

export function getRandomName() {
  const randomName = Math.random().toString(36).slice(2);
  return randomName.charAt(0).toUpperCase() + randomName.slice(1);
}

export function getRandomNumber() {
  const areaCode = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
  const randomNumber = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
  return `(${areaCode}) ${randomNumber.toString().substring(0, 5)}-${randomNumber.toString().substring(5)}`;
}

Cypress.Commands.add('APIGetNotificationTotalCount', () => {
  return cy
    .keepsApi(`${Cypress.env('url_api')}/user/notification?read=false`, {}, 'GET')
    .then((response) => response.body.count);
});

Cypress.Commands.add('ValidateNotificationIncrease', (initialCount, increaseBy = 4) => {
  const check = () => {
    return cy.APIGetNotificationTotalCount().then((currentCount) => {
      if (currentCount >= initialCount + increaseBy) {
        return cy.log(initialCount.toString(), currentCount.toString());
      }
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(60000); // Wait for 1 minute for the notification
      return check();
    });
  };
  return check();
});

declare global {
  namespace Cypress {
    interface Chainable {
      FixturesCourse(): Chainable<CourseOptions>;
      FixturesContent(): Chainable<FixtureContent>;
      FixturesEnrollment(): Chainable<EnrollmentOptions>;
      FixturesQuiz(): Chainable<QuizOptions>;
      FixturesUser(): Chainable<userOptions>;
      ValidateNotificationIncrease(initialCount: number, increaseBy?: number): Chainable<void>;
      APIGetNotificationTotalCount(): Chainable<number>;
    }
  }
}
