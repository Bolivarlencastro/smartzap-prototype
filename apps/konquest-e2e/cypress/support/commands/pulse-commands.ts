import PulseElements from '../elements/pulse-elements';
import { getRandomName } from '../commands';
import { CONTENT_TYPE } from '../constants/cotent-type';
import * as StatusCode from '../constants/status-code';
import { Interception } from 'cypress/types/net-stubbing';
import { CypressResponse } from '../interfaces';
import * as util from '../constants/utils';
import { GOOGLE_DRIVE, SOUND_CLOUD, VIMEO, YOU_TUBE } from '../constants/players';
import MissionElements from '../elements/mission-elements';
const wk = util.WORKSPACE_DEFAULT;

export function isContentTypeOf(type: string) {
  const contentType = CONTENT_TYPE[type.split(' ').join('').toLocaleLowerCase()];
  const isContentType = contentType.type == 'Arquivo';
  const isLinkType = !isContentType;
  return { isContentType, isLinkType };
}

Cypress.Commands.add('PulseCreateInChannel', (name, type, content) => {
  const { isContentType, isLinkType } = isContentTypeOf(type);
  cy.PulseAccess();
  cy.ChannelTabAccess();
  cy.SearchChannelOrPulse(name);
  cy.ChannelCardSelect(name);
  cy.ChannelNewPulse();
  cy.PulseSelectType(type);
  cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, type);
  return cy.PulseSave();
});

Cypress.Commands.add('PulseCreate', (idChannel, type, content = {}) => {
  const { isContentType, isLinkType } = isContentTypeOf(type);
  cy.ChannelAccessOpen(idChannel, wk);
  cy.ChannelNewPulse();
  cy.PulseSelectType(type);
  cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, type);
  return cy.PulseSave();
});

Cypress.Commands.add('PulseCreateWithError', (idChannel, type, content = {}, checkResponse) => {
  const { isContentType, isLinkType } = isContentTypeOf(type);

  return cy
    .ChannelAccessOpen(idChannel, wk)
    .ChannelNewPulse()
    .PulseSelectType(type)
    .PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, type)
    .PulseSaveWithError(checkResponse);
});

Cypress.Commands.add('PulseCreateWithQuiz', (idChannel, type, content = {}) => {
  cy.ChannelAccessOpen(idChannel, wk);
  cy.ChannelNewPulse();
  cy.PulseSelectType(type);
  cy.PulseFillNewQuizContentForm(content);
  cy.PulseSaveWithQuiz();
});

Cypress.Commands.add('PulseAccess', () => {
  return cy
    .intercept('**/search/v1/pulses**')
    .as('pulses')
    .intercept('**/pulses/types')
    .as('typesPulses')
    .visit(`/${util.WORKSPACE_DEFAULT}/pulse`)
    .wait('@pulses')
    .wait('@typesPulses');
});

Cypress.Commands.add('PulseSelectType', (selectType) => {
  cy.log(selectType);
  const { type, value } = CONTENT_TYPE[selectType.split(' ').join('').toLocaleLowerCase()];
  PulseElements.newContentButton(type).click();
  return PulseElements.contentFileType(value).click();
});

Cypress.Commands.add('PulseSelectFileNewFileContent', (file) => {
  return PulseElements.inputFileNewFileContent().selectFile(file, { force: true });
});

Cypress.Commands.add('PulseTypeNameNewContent', (name) => {
  return PulseElements.inputNameNewContent().type('{selectall}{backspace}').type(`${name}`);
});

Cypress.Commands.add('PulseTypeLinkNewContent', (name) => {
  return PulseElements.inputLinkNewContent().clear().type(`${name}`);
});

Cypress.Commands.add('PulseSelectThumbnailNewFileContent', (file) => {
  cy.intercept('**/learn-contents/cover-images-by-size').as('cover-images');
  PulseElements.inputThumbnailNewFileContent().selectFile(file, { force: true });
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  PulseElements.CropperButtonSave().click({ force: true });
  return cy.wait('@cover-images').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('PulseSave', () => {
  const apiUrl = `${Cypress.env('url_api')}/pulses`;

  cy.intercept('POST', apiUrl).as('createPulse');

  PulseElements.saveNewPulseButton().click({ force: true });

  cy.wait('@createPulse').then(({ response }) => {
    expect(response?.statusCode).to.eq(StatusCode.Created);
    cy.get('[data-test="check-in-circle"]').should('exist');
    return cy.wrap(response?.body);
  });
});

Cypress.Commands.add('PulseSaveWithQuiz', () => {
  cy.intercept('**/pulses/exams').as('pulseSave');
  PulseElements.saveNewPulseQuizButton().click({ force: true });
  cy.wait('@pulseSave').then((request) => {
    expect(request.response.statusCode).equal(StatusCode.Created);
    return cy.wrap(request.response.body);
  });
});

Cypress.Commands.add('PulseSaveWithError', (options) => {
  cy.intercept('learn-content').as('pulseError');
  PulseElements.saveNewPulseButton().click();
  if (options.checkResponse) {
    cy.wait('@pulseError').then((request) => {
      return cy.wrap(request.response);
    });
  }
});

Cypress.Commands.add('PulseFillNewContentForm', (typeOptions, content, type) => {
  if (typeOptions.contentType) {
    cy.PulseFillNewFileContentForm(content);
  }
  if (typeOptions.linkType) {
    cy.PulseFillNewLinkContentForm(content, type);

    if (typeOptions.youTube) {
      cy.PulseValidPlayableContent({
        link: {
          id: content.link.id,
          url: content.link.url,
          youTube: type.youTube,
        },
      });
    }
  }
});

Cypress.Commands.add('PulseFillNewQuizContentForm', (options) => {
  cy.PulseTypeNameNewContent(options.name);
  cy.GetMetaDataSelectorAndClick('button-save');
  PulseElements.inputQuestionOnQuiz().type('Question name in automated test');
  cy.GetMetaDataSelectorAndClick('input-option-0').type(getRandomName());
  cy.GetMetaDataSelectorAndClick('add-new-option');
  cy.GetMetaDataSelectorAndClick('input-option-1').type(getRandomName());
  cy.GetMetaDataSelectorAndClick('add-new-option');
  cy.GetMetaDataSelectorAndClick('input-option-2').type(getRandomName());
  cy.GetMetaDataSelectorAndClick('select-option-0');
  PulseElements.nextButtonQuiz().click();
});

Cypress.Commands.add('PulseFillNewFileContentForm', (options = {}) => {
  if (options.file) cy.PulseSelectFileNewFileContent(options.file);
  if (options.thumbnail) cy.PulseSelectThumbnailNewFileContent(options.thumbnail);
  if (options.name) cy.PulseTypeNameNewContent(options.name);
});

Cypress.Commands.add('PulseFillNewLinkContentForm', (options = {}, type) => {
  cy.log(options);
  if (options.name) cy.PulseTypeNameNewContent(options.name);
  if (options.link) {
    let url = '';
    if (options.link.id) {
      if (type === YOU_TUBE) url = `https://www.youtube.com/watch?v=${options.link.id}`;
      if (type === VIMEO) url = `https://vimeo.com/${options.link.id}`;
      if (type === SOUND_CLOUD) url = `https://soundcloud.com/${options.link.id}`;
      if (type === GOOGLE_DRIVE) url = `https://docs.google.com/${options.link.id}`;
    }
    if (options.link.url) url = options.link.url;
    cy.log(url, 'url');
    cy.PulseTypeLinkNewContent(url);
  }
});

Cypress.Commands.add('OpenPulseContent', (pulse) => {
  return cy.NavigateTo('pulse').PulseFilterAll().SearchChannelOrPulse(pulse.name).PulseSelectCard();
});

Cypress.Commands.add('PulseFilterAll', () => {
  cy.intercept('**konquest/pulses?page=1&per_page=**').as('loadPulses');
  PulseElements.allPulses().click();
});

Cypress.Commands.add('PulseSelectCard', () => {
  return PulseElements.pulseCardSelector().click();
});

Cypress.Commands.add('PulseValidRequireMessageFileContent', (message) => {
  return PulseElements.requireMessageNewFileContent().should('have.text', message);
});

Cypress.Commands.add('PulseValidQuizContent', (quizID) => {
  cy.url().should('include', `pulse/${quizID}/quiz`);
  return PulseElements.questionQuizName().contains('Question name in automated test');
});

Cypress.Commands.add(
  'PulseValidPlayableContent',
  (options = { video: true, audio: false, link: { id: null, url: null } }) => {
    let css;
    cy.log(options);
    expect(options).to.not.empty;

    if (options.link) {
      cy.PulseValidPlayableLinkContent(options.link);
    } else {
      if (options.video) css = 'video';
      if (options.audio) css = 'audio';
      cy.log(css);
      return cy.get(css).then(($playable) => {
        $playable[0].play();
        expect($playable[0].paused).false;
        expect($playable[0].ended).false;
      });
    }
  },
);

Cypress.Commands.add('PulseValidPlayableLinkContent', (link = {}) => {
  const elements = {
    youTube: { url: 'https://www.youtube.com/watch?v=', element: '.vds-youtube' },
    vimeo: { url: 'https://vimeo.com/', element: '[data-test="videoPlayer"]' },
    soundCloud: { url: 'https://soundcloud.com/', element: '[data-test="audioPlayer"]' },
    googleDrive: { url: 'https://docs.google.com/', element: '[data-test="docsViewer"]' },
  };

  const externalUrl = elements[link.player].url + link.id;
  const elementToVerification = elements[link.player].element;

  cy.intercept('**/kontent/learn-content/**').as('waitLearnContent');
  cy.wait('@waitLearnContent').then((response) => {
    const urlToVerification = response.response.body.url;
    expect(urlToVerification).equal(externalUrl);
  });

  return cy.get(elementToVerification).should('exist');
});

Cypress.Commands.add('PulseValidImgContent', () => {
  return cy.get('[data-test="imageViewer"]').should('be.visible');
});

Cypress.Commands.add('PulseValidPDFContent', () => {
  return PulseElements.pdfViewer().should('be.visible');
});

Cypress.Commands.add('PulseValidDocContent', () => {
  return PulseElements.docViewer().should('be.visible');
});

Cypress.Commands.add('PulseSearch', (search) => {
  return cy.SearchChannelOrPulse(search);
});

Cypress.Commands.add('PulseMessageInvalidVerify', () => {
  return PulseElements.pulseNotificationElement();
});

Cypress.Commands.add('PulseMobileAccess', () => {
  return cy
    .intercept('**/pulses?**')
    .as('pulses')
    .intercept('**/pulses/types')
    .as('typesPulses')
    .visit(`/${util.WORKSPACE_DEFAULT}/pulse`)
    .wait('@pulses')
    .wait('@typesPulses');
});

Cypress.Commands.add('PulseFavorite', () => {
  cy.intercept('**/bookmarks').as('favoritePulse');
  PulseElements.favoritePulseSelector().click();
  return cy.wait('@favoritePulse');
});

Cypress.Commands.add('PulseUnfavorite', () => {
  cy.intercept('DELETE', '**/bookmarks/**').as('unfavoritePulse');
  PulseElements.favoritePulseSelector().click();
  return cy.wait('@unfavoritePulse');
});

Cypress.Commands.add('PulseFilterFavorites', () => {
  cy.intercept('GET', '**bookmarked=true').as('filterFavorite');
  PulseElements.pulseFilterOptionFavorite().click();
  return cy.wait('@filterFavorite');
});

Cypress.Commands.add('PulseMobileSearch', (search) => {
  cy.SearchMobileChannelAndPulse(search);
});

Cypress.Commands.add('PulseValidateAndAnswerQuiz', () => {
  const PULSE_QUIZ_SELECTORS = [
    'current-and-last-question-number-selector',
    'top-number-correct-answers-selector',
    'top-number-incorrect-answers-selector',
    'kp-quiz-form.question_name',
    'kp-quiz-form.option_text',
    'bottom-number-of-correct-answers-selector',
    'button-back',
    'button-confirm-option-in-pulse-quiz',
  ];
  return PULSE_QUIZ_SELECTORS.forEach((pulseQuizSelector) => {
    cy.VerifyMetadataElementVisible(pulseQuizSelector);
  });
});

Cypress.Commands.add('PulseSelectCorrectAnswerOnQuiz', () => {
  cy.intercept(`**/answers`).as('answerResponse');
  PulseElements.quizOption().contains(util.QUIZ_CORRECT_OPTION).click();
  cy.GetMetaDataSelectorAndClick('button-confirm-option-in-pulse-quiz');
  return cy.wait('@answerResponse');
});

Cypress.Commands.add('PulseSelectIncorrectAnswerOnQuiz', () => {
  cy.intercept(`**/answers`).as('answerResponse');
  PulseElements.quizOption().each((option) => {
    if (!option.text().includes(util.QUIZ_CORRECT_OPTION)) {
      cy.wrap(option).then((element) => {
        element.click();
      });
    }
  });
  cy.GetMetaDataSelectorAndClick('button-confirm-option-in-pulse-quiz');
  return cy.wait('@answerResponse');
});

Cypress.Commands.add('PulseValidatFinishQuiz', () => {
  const PULSE_QUIZ_SELECTORS = [
    'pulse-quiz-congratulations-message',
    'pulse-quiz-name-on-finish-page',
    'pulse-quiz-number-correct-answer',
    'pulse-quiz-number-incorrect-answer',
  ];
  return PULSE_QUIZ_SELECTORS.forEach((pulseQuizSelector) => {
    cy.VerifyMetadataElementVisible(pulseQuizSelector);
  });
});

Cypress.Commands.add('PulseTypeQuizAccessDirectly', (UUID) => {
  cy.intercept(`**/questions`).as('loadPulseTypeQuiz');
  cy.visit(`/${util.WORKSPACE_DEFAULT}/pulse/${UUID}/quiz`);
  cy.wait('@loadPulseTypeQuiz').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('PulseTypeQuizAlreadyAnsweredNavigate', (NumberOfQuestions) => {
  const PULSE_QUIZ_SELECTORS = [
    'current-and-last-question-number-selector',
    'top-number-correct-answers-selector',
    'top-number-incorrect-answers-selector',
    'kp-quiz-form.question_name',
    'kp-quiz-form.option_text',
    'bottom-number-of-correct-answers-selector',
    'button-back',
  ];
  PULSE_QUIZ_SELECTORS.forEach((pulseQuizSelector) => {
    cy.VerifyMetadataElementVisible(pulseQuizSelector);
  });
  for (let i = 0; i < NumberOfQuestions; i++) {
    if (i !== NumberOfQuestions - 1) {
      PulseElements.topNumberCorrectAnswers().contains(NumberOfQuestions);
      PulseElements.currentAndLastQuestionSelector().contains(`Pergunta 0${i + 1} de 0${NumberOfQuestions}`);
      PulseElements.quizOption().should('have.length', 3);
      PulseElements.messageCorrectAnswer().should('be.visible');
      PulseElements.buttonSkipQuestion().should('be.visible').click();
    } else {
      PulseElements.topNumberCorrectAnswers().contains(NumberOfQuestions);
      PulseElements.currentAndLastQuestionSelector().contains(
        `Pergunta 0${NumberOfQuestions} de 0${NumberOfQuestions}`,
      );
      PulseElements.quizOption().should('have.length', 3);
      PulseElements.messageCorrectAnswer().should('be.visible');
      cy.GetMetaDataSelectorAndClick('button-next-on-quiz');
    }
  }
});

Cypress.Commands.add('PulseFileGeniallyCreate', (channelId, geniallyPath) => {
  cy.intercept('**/learn-content').as('contentUpload');
  cy.intercept('**/pulses').as('loadPulses');
  cy.ChannelAccessOpen(channelId);
  cy.ChannelNewPulse();
  MissionElements.buttonOptionContentHtml().click();
  MissionElements.buttonOptionGenially().click();
  MissionElements.inputGeniallyField().selectFile(geniallyPath, { force: true });
  MissionElements.inputGeniallyTime().type('1');
  PulseElements.inputNameContentLink().type(getRandomName());
  MissionElements.ButtonSaveContent().click();
  cy.wait('@contentUpload');
  cy.wait('@loadPulses').then((res) => {
    return res.response.body;
  });
});

Cypress.Commands.add('PulseLinkGeniallyCreate', (channelId, link) => {
  cy.intercept('**/learn-content').as('contentUpload');
  cy.intercept('**/pulses').as('loadPulses');
  cy.ChannelAccessOpen(channelId);
  cy.ChannelNewPulse();
  MissionElements.buttonOptionContentHtml().click();
  MissionElements.buttonOptionGenially().click();
  PulseElements.pulseExternalLink().type(link);
  PulseElements.inputNameContentLink().click({ force: true }).type(getRandomName());
  MissionElements.inputGeniallyTime().type('1', { force: true });
  MissionElements.ButtonSaveContent().click({ force: true });
  cy.wait('@contentUpload');
  cy.wait('@loadPulses').then((res) => {
    return res.response.body;
  });
});
declare global {
  namespace Cypress {
    interface Chainable {
      PulseCreateInChannel(name: string, type: string, content): Chainable<Interception>;
      PulseCreate(idChannel: string, type: string, content): Chainable<Interception>;
      PulseCreateWithError(idChannel: string, type: string, content, { checkResponse }): Chainable<CypressResponse>;
      PulseCreateWithQuiz(idChannel: string, type: string, content): Chainable<Interception>;
      PulseAccess(): Chainable<Interception>;
      PulseSelectType(selectType: string): Chainable<JQuery<HTMLElement>>;
      PulseSelectFileNewFileContent(file): Chainable<JQuery<HTMLElement>>;
      PulseTypeNameNewContent(name: string): Chainable<JQuery<HTMLElement>>;
      PulseTypeLinkNewContent(name: string): Chainable<JQuery<HTMLElement>>;
      PulseSelectThumbnailNewFileContent(file): Chainable<JQuery<HTMLElement>>;
      PulseSave(): Chainable<Interception>;
      PulseSaveWithQuiz(): Chainable<Interception>;
      PulseSaveWithError(options): Chainable<Interception>;
      PulseFillNewContentForm(typeOptions, content, type): Chainable<JQuery<HTMLElement>>;
      PulseFillNewQuizContentForm(options): Chainable<JQuery<HTMLElement>>;
      PulseFillNewFileContentForm(options): Chainable<JQuery<HTMLElement>>;
      PulseFillNewLinkContentForm(options, type): Chainable<JQuery<HTMLElement>>;
      OpenPulseContent(pulse): Chainable<JQuery<HTMLElement>>;
      PulseFilterAll(): Chainable<Interception>;
      PulseSelectCard(): Chainable<JQuery<HTMLElement>>;
      PulseValidRequireMessageFileContent(message: string): Chainable<JQuery<HTMLElement>>;
      PulseValidQuizContent(quizID: string): Chainable<JQuery<HTMLElement>>;
      PulseValidPlayableContent(options): Chainable<JQuery<HTMLElement>>;
      PulseValidPlayableLinkContent(link): Chainable<JQuery<HTMLElement>>;
      PulseValidImgContent(): Chainable<JQuery<HTMLElement>>;
      PulseValidPDFContent(): Chainable<JQuery<HTMLElement>>;
      PulseValidDocContent(): Chainable<JQuery<HTMLElement>>;
      PulseSearch(search: string): Chainable<Interception>;
      PulseMessageInvalidVerify(): Chainable<JQuery<HTMLElement>>;
      PulseCreateChannelWithQuiz(): Chainable<JQuery<HTMLElement>>;
      PulseMobileAccess(): Chainable<Interception>;
      PulseFavorite(): Chainable<Interception>;
      PulseUnfavorite(): Chainable<Interception>;
      PulseFilterFavorites(): Chainable<Interception>;
      PulseMobileSearch(search: string): Chainable<Interception>;
      PulseValidateAndAnswerQuiz(): Chainable<JQuery<HTMLElement>>;
      PulseSelectCorrectAnswerOnQuiz(): Chainable<Interception>;
      PulseSelectIncorrectAnswerOnQuiz(): Chainable<Interception>;
      PulseValidatFinishQuiz(): Chainable<JQuery<HTMLElement>>;
      PulseTypeQuizAccessDirectly(UUID: string): Chainable<Interception>;
      PulseTypeQuizAlreadyAnsweredNavigate(NumberOfQuestions: number): Chainable<Interception>;
      PulseFileGeniallyCreate(channelId: string, geniallyPath: string): Chainable<JQuery<HTMLElement>>;
      PulseLinkGeniallyCreate(channelId: string, link: string);
    }
  }
}
