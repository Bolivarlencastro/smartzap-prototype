/// <reference types="cypress" />
import ChannelElements from '../support/elements/channel-elements';
import MissionElements from './elements/mission-elements';
import TrailElements from './elements/trail-elements';
import { Interception } from 'cypress/types/net-stubbing';
import { FixtureContent } from './interfaces/content-options';
import { FixtureEnrollment } from './interfaces/enrollment-options';
import { PulseOptions } from './interfaces/pulse-options';
import { ChannelOptions, ChannelPulseContentOptions } from './interfaces/channel-options';
import { TrailOptions } from './interfaces/trail-options';
import { InternalMissionOptions, MissionStageContentOptions } from './interfaces/mission-options';
import { LiveMissionCreate } from './interfaces/live-mission-options';
import * as StatusCode from '../support/constants/status-code';
import PulseElements from './elements/pulse-elements';
import * as util from '../support/constants/utils';
import EnrollsMissionsElements from './elements/enrolls-missions-elements';
import ContentManagementElements from './elements/content-management-elements';

const missionDefaultPath = `${Cypress.env('ENVIRONMENT')}/mission/default`;
const trailDefaultPath = `${Cypress.env('ENVIRONMENT')}/trail/default`;
const contentDefaultPath = `${Cypress.env('ENVIRONMENT')}/content/default`;
const stageDefaultPath = `${Cypress.env('ENVIRONMENT')}/mission/stage`;
const enrollmentDefaultPath = `${Cypress.env('ENVIRONMENT')}/enrollment/default`;
const channelDefaultPath = `${Cypress.env('ENVIRONMENT')}/channel/default`;
const pulseDefaultPath = `${Cypress.env('ENVIRONMENT')}/pulse/default`;
const geniallyPath = `cypress/fixtures/${Cypress.env('ENVIRONMENT')}/content/genially/genially.zip`;

let testFixtures;
let addContentStage;

Cypress.Commands.add('focusBlur', (element) => {
  return element().focus().blur();
});

Cypress.Commands.add('MissionWaitLoad', () => {
  cy.intercept('**/my-recommendations**').as('loadRecommend');
  cy.visit('');
  cy.wait('@loadRecommend');
  return cy.get('[data-test="global-search-trigger"]').should('exist');
});

Cypress.Commands.add('TrailAccess', () => {
  cy.intercept('**/my-recommendations**').as('loadMyRecommendations');
  cy.intercept('**/search/v1/trails?**').as('loadSearchTrails');
  TrailElements.buttonTrailEnrollment();
  cy.wait('@loadMyRecommendations');
  cy.wait('@loadSearchTrails');
  return TrailElements.trailsPageSelector().should('be.visible');
});

Cypress.Commands.add('TrailAccessMobile', () => {
  cy.intercept('**/my-recommendations**').as('loadMyRecommendations');
  cy.intercept('**/search/v1/trails?**').as('loadSearchTrails');
  cy.GetMetaDataSelectorAndClick('button-access-vertical-navigation-menu');
  TrailElements.buttonTrailEnrollment();
  cy.wait('@loadMyRecommendations');
  cy.wait('@loadSearchTrails');
});

Cypress.Commands.add('PressEsc', () => {
  return cy.get('body').type('{esc}', { force: true });
});

Cypress.Commands.add('SearchChannelOrPulse', (search) => {
  cy.intercept(`*search=${search}*`).as('search');
  ChannelElements.searchInput().clear().type(`${search}{enter}`, { delay: 700, force: true });
  return cy.wait('@search');
});

Cypress.Commands.add('SearchMobileChannelAndPulse', (search) => {
  cy.intercept(`*search=${search}*`).as('search');
  ChannelElements.mobileSearchInput().clear().type(search);
  return cy.wait('@search');
});

export function getRandomName() {
  return Math.random().toString(36).slice(2);
}

export function getDateToday() {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  return formattedDate;
}

export function getDateTodayBR() {
  const date = new Date();
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function getDateTomorrow() {
  const date = new Date();
  date.setDate(new Date().getDate() + 1);
  const formattedDate = date.toISOString();
  return formattedDate;
}
export function getStartDateMissionLiveOrPresential() {
  const event = new Date();
  event.setDate(event.getDate() + 1);
  event.setHours(event.getHours() + 1);
  const formattedDate = event.toISOString();
  return formattedDate;
}

export function getEndDateMissionLiveOrPresential() {
  const event = new Date();
  event.setDate(event.getDate() + 1);
  event.setHours(event.getHours() + 2);
  const formattedDate = event.toISOString();
  return formattedDate;
}

export function getDateTodayMissionPresentialLive() {
  const event = new Date();
  event.setDate(event.getDate());
  event.setHours(event.getHours() + 1);
  const startDate = event.toISOString();

  event.setDate(event.getDate());
  event.setHours(event.getHours() + 2);
  const endDate = event.toISOString();
  return { startDate, endDate };
}

export function getDateTomorrowBR() {
  const date = new Date();
  date.setDate(new Date().getDate() + 1);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function getFullDateTomorrowBR() {
  const date = new Date();
  date.setDate(new Date().getDate() + 1);
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(date);
}

export function getDateInFiveDays() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 5);

  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`;
}

Cypress.Commands.add('FixturesMission', () => {
  return cy.fixture(missionDefaultPath).then((mission) => mission);
});

Cypress.Commands.add('FixturesTrail', () => {
  return cy.fixture(trailDefaultPath).then((trail) => trail);
});

Cypress.Commands.add('FixturesChannel', () => {
  return cy.fixture(channelDefaultPath).then((channel) => channel);
});

Cypress.Commands.add('FixturesPulse', () => {
  return cy.fixture(pulseDefaultPath).then((pulse) => pulse);
});

Cypress.Commands.add('FixturesEnrollment', () => {
  return cy.fixture(enrollmentDefaultPath).then((enrollment) => enrollment);
});

Cypress.Commands.add('FixturesMissionStageContent', () => {
  return cy
    .fixture(missionDefaultPath)
    .then((mission) =>
      cy
        .fixture(stageDefaultPath)
        .then((stage) =>
          cy
            .fixture(contentDefaultPath)
            .then((content) =>
              cy.fixture(enrollmentDefaultPath).then((enrollment) => ({ mission, stage, content, enrollment })),
            ),
        ),
    );
});

Cypress.Commands.add('FixturesContent', () => {
  cy.fixture(contentDefaultPath).then((content) => content);
});

Cypress.Commands.add('FixturesChannelPulseContent', () => {
  return cy
    .fixture(channelDefaultPath)
    .then((channel) =>
      cy
        .fixture(pulseDefaultPath)
        .then((pulse) => cy.fixture(contentDefaultPath).then((content) => ({ channel, pulse, content }))),
    );
});

Cypress.Commands.add('FixturesChannelAndPulse', () => {
  return cy
    .fixture(channelDefaultPath)
    .then((channel) => cy.fixture(pulseDefaultPath).then((pulse) => ({ channel, pulse })));
});

Cypress.Commands.add('FixturesMissionLive', () => {
  const date = getDateTodayMissionPresentialLive();

  return cy.fixture(missionDefaultPath).then((fixture) => {
    delete fixture.development_status;
    delete fixture.required_evaluation;

    return {
      ...fixture,
      name: getRandomName(),
      mission_model: 'LIVE',
      language: 'pt-BR',
      mission_type: util.OPEN_TYPE_ID,
      live: {
        dates: [
          {
            date: getDateToday(),
            start_at: date.startDate,
            end_at: date.endDate,
          },
        ],
        seats: 1,
        url: 'https://meet.google.com/odz-hcfm-bny?authuser=0',
      },
    };
  });
});

Cypress.Commands.add('UpdateFixtToRandom', (fixtures) => {
  const { mission, stage, content } = fixtures;
  mission.name = getRandomName();
  stage.name = getRandomName();
  content.link.name = getRandomName();
  content.addContentStage.name = getRandomName();
  return { mission, stage, content };
});

Cypress.Commands.add('CreateChannelWithPulseLink', (pulseContent, fixtures) => {
  const { channel, pulse, content } = fixtures;

  channel.name = getRandomName();
  pulse.name = getRandomName();
  content.addContentStage.name = getRandomName();

  cy.APICreateLearnContentLink(pulseContent, content.addContentStage)
    .then((response) => {
      const contentCreated = response.body;
      pulse.learn_content_uuid = contentCreated.id;
      return contentCreated;
    })
    .then((contentCreated) => cy.APIPulseCreate({ ...pulse, learn_content_uuid: contentCreated.id }))
    .then((response) => {
      const pulseCreated = response.body;
      pulse.pulse_id = response.body.id;
      return pulseCreated;
    })
    .then((pulseCreated) => {
      const { active, categorieUUID, description, name, typeUUID } = channel;
      return cy.APIChannelCreate({ active, categorieUUID, description, name, typeUUID }).then((response) => {
        const channelCreated = response.body;
        return { channel_id: channelCreated.id, pulse_id: pulseCreated.id };
      });
    })
    .then((response) => cy.ChannelLinkToPulse(response));
});

Cypress.Commands.add('CreateChannelWithPulseFile', (pulseContent, fixtures) => {
  const { channel, pulse, content } = fixtures;

  channel.name = getRandomName();
  pulse.name = getRandomName();
  content.addContentStage.name = getRandomName();

  return cy
    .APICreateLearnContentFile(pulseContent)
    .then((response) => {
      const contentCreated = response.body;
      pulse.learn_content_uuid = contentCreated.id;
      return cy.APIPulseCreate({ ...pulse, learn_content_uuid: contentCreated.id });
    })
    .then((response) => {
      const pulseCreated = response.body;
      pulse.pulse_id = pulseCreated.id;

      return cy.APIChannelCreate({
        active: channel.active,
        categorieUUID: channel.categorieUUID,
        description: channel.description,
        name: channel.name,
        typeUUID: channel.typeUUID,
      });
    })
    .then((response) => {
      const channelCreated = response.body;

      return cy
        .ChannelLinkToPulse({
          channel_id: channelCreated.id,
          pulse_id: pulse.pulse_id,
        })
        .then(() => {
          return {
            channel: {
              id: channelCreated.id,
              name: channelCreated.name,
              active: channelCreated.active,
              categorieUUID: channelCreated.categorieUUID,
              description: channelCreated.description,
              typeUUID: channelCreated.typeUUID,
            },
            pulse: {
              id: pulse.pulse_id,
              name: pulse.name,
              learn_content_uuid: pulse.learn_content_uuid,
              description: pulse.description,
              channel_id: pulse.channel_id,
            },
          };
        });
    });
});

Cypress.Commands.add('CreateChannelWithPulseQuiz', (fixtures) => {
  cy.APIChannelCreate(fixtures.channel)
    .then((channelCreated) => {
      return cy.APIPulseCreateQuiz(channelCreated.body.id);
    })
    .then((response) => {
      cy.wrap(response.body);
    });
});

Cypress.Commands.add('GetMetaDataSelectorAndClick', (element) => {
  return cy.get(`[data-test="${element}"]`).should('be.visible').click();
});

Cypress.Commands.add('WaitConsumeContent', (timeConsume) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(timeConsume);
});

Cypress.Commands.add('BatchEnrollmentSetting', (enrollment) => {
  TrailElements.buttonOpenBatchEnrollDialog().click();
  TrailElements.inputGoalDate().clear().type(getDateTodayBR());
  TrailElements.batchEnrollmentType().click();
  if (enrollment == 'required') {
    TrailElements.batchEnrollmentTypeRequired().click();
  }
  if (enrollment == 'free') {
    TrailElements.batchEnrollmentTypeFree().click();
  }
  TrailElements.settingsBatchEnrollmentConfirm().click();
});

Cypress.Commands.add('MissionOrTrailSelectUserToTransfer', (user) => {
  cy.intercept('**/users?filter.roles.role.id**').as('userList');
  MissionElements.inputEmailToTransfer().type(user).wait('@userList');
  return MissionElements.optionSelector().click();
});

Cypress.Commands.add('VerifyMetadataElementVisible', (metadataValue) => {
  cy.get(`[data-test="${metadataValue}"]`).should('be.visible');
});

Cypress.Commands.add('CreateMissionWithAllContentsTypeFileAndQuiz', () => {
  cy.FixturesMissionStageContent()
    .then((fixtures) => {
      testFixtures = fixtures;
      testFixtures.mission.name = getRandomName();
      testFixtures.stage.name = getRandomName();
      testFixtures.content.addContentStage.name = getRandomName();
    })
    .then(() => {
      return cy.APIMissionCreate(testFixtures.mission);
    })
    .then((mission) => {
      expect(mission.status).eq(StatusCode.Created);
      expect(mission.body.id).not.to.be.empty;
      return mission.body;
    })
    .then((mission) => {
      testFixtures.mission.missionUUID = mission.id;
      testFixtures.enrollment.missionUUID = mission.id;
      testFixtures.stage.mission = mission.id;
      addContentStage = testFixtures.content.addContentStage;
    })
    .then(() => {
      return cy.APIMissionCreateStage(testFixtures.stage);
    })
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      return response.body;
    })
    .then((stageCreatedBefore) => {
      cy.APIMissionCreateContentFile(testFixtures.content.video, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentFile(testFixtures.content.image, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentFile(testFixtures.content.audio, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentFile(testFixtures.content.docx, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentFile(testFixtures.content.pdf, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentFile(testFixtures.content.pptx, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentFile(testFixtures.content.xls, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentFile(testFixtures.content.xlsx, addContentStage, stageCreatedBefore);
      cy.APICreateLearnContentQuiz(stageCreatedBefore)
        .then((contentQuizCreated) => {
          testFixtures.content.content_type = 'EXAM';
          cy.APILinkContentToStageV2(testFixtures.content, contentQuizCreated.body, stageCreatedBefore);
          return cy.wrap(contentQuizCreated.body);
        })
        .then((payload) => {
          cy.APIQuestionsToExam(payload, testFixtures.content);
        })
        .then(() => {
          cy.wrap(testFixtures);
        });
    });
});

Cypress.Commands.add('MissionCreateWithAllContentsTypeLink', () => {
  cy.FixturesMissionStageContent()
    .then((fixtures) => {
      testFixtures = fixtures;
      testFixtures.mission.name = getRandomName();
      testFixtures.stage.name = getRandomName();
      testFixtures.content.addContentStage.name = getRandomName();
    })
    .then(() => {
      return cy.APIMissionCreate(testFixtures.mission);
    })
    .then((mission) => {
      expect(mission.status).eq(StatusCode.Created);
      expect(mission.body.id).not.to.be.empty;
      return mission.body;
    })
    .then((mission) => {
      testFixtures.mission.missionUUID = mission.id;
      testFixtures.enrollment.missionUUID = mission.id;
      testFixtures.stage.mission = mission.id;
      addContentStage = testFixtures.content.addContentStage;
    })
    .then(() => {
      return cy.APIMissionCreateStage(testFixtures.stage);
    })
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      return response.body;
    })
    .then((stageCreatedBefore) => {
      cy.APIMissionCreateContentLink(testFixtures.content.link.youtube, addContentStage, stageCreatedBefore);
      // cy.APIMissionCreateContentLink(testFixtures.content.link.vimeo, addContentStage, stageCreatedBefore); TODO: DEV-20080
      cy.APIMissionCreateContentLink(testFixtures.content.link.soundcloud, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentLink(testFixtures.content.link.googledrive.doc, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentLink(testFixtures.content.link.googledrive.sheet, addContentStage, stageCreatedBefore);
      cy.APIMissionCreateContentLink(
        testFixtures.content.link.googledrive.presentation,
        addContentStage,
        stageCreatedBefore,
      ).then(() => {
        const data = { missionUUID: testFixtures.mission.missionUUID, development_status: 'IN_REVIEW' };
        cy.APIMissionUpdate(data);
        cy.wrap(testFixtures);
      });
    });
});

Cypress.Commands.add('CreateMissionWithGeniallyAndQuiz', () => {
  cy.intercept('**/learn-content').as('contentUpload');
  cy.intercept('POST', '**//stages/contents').as('contentCreate');
  cy.intercept('**/stages').as('getMissionContents');

  cy.FixturesMissionStageContent()
    .then((fixtures) => {
      testFixtures = fixtures;
      testFixtures.mission.name = getRandomName();
      testFixtures.stage.name = getRandomName();
      testFixtures.content.addContentStage.name = getRandomName();
    })
    .then(() => {
      return cy.APIMissionCreate(testFixtures.mission);
    })
    .then((mission) => {
      expect(mission.status).eq(StatusCode.Created);
      expect(mission.body.id).not.to.be.empty;
      return mission.body;
    })
    .then((mission) => {
      testFixtures.mission.missionUUID = mission.id;
      testFixtures.enrollment.missionUUID = mission.id;
      testFixtures.stage.mission = mission.id;
      addContentStage = testFixtures.content.addContentStage;
    })
    .then(() => {
      return cy.APIMissionCreateStage(testFixtures.stage);
    })
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      return response.body;
    })
    .then((stageCreatedBefore) => {
      cy.MissionContentEditAccessDirectly(testFixtures.mission.missionUUID);
      MissionElements.ButtonNewContent().should('be.visible').click();
      MissionElements.buttonOptionContentHtml().click();
      MissionElements.buttonOptionGenially().click();
      MissionElements.inputGeniallyField().selectFile(geniallyPath, { force: true });
      MissionElements.inputGeniallyTime().type(testFixtures.content.genially.time);
      MissionElements.ButtonSaveContent().click();
      cy.wait('@contentUpload');
      cy.wait('@contentCreate');
      cy.wait('@getMissionContents');

      cy.APICreateLearnContentQuiz(stageCreatedBefore)
        .then((contentQuizCreated) => {
          testFixtures.content.content_type = 'EXAM';
          cy.APILinkContentToStageV2(testFixtures.content, contentQuizCreated.body, stageCreatedBefore);
          return cy.wrap(contentQuizCreated.body);
        })
        .then((payload) => {
          cy.APIQuestionsToExam(payload, testFixtures.content);
        })
        .then(() => {
          cy.MissionWaitReview(testFixtures.mission);
          cy.wrap(testFixtures);
        });
    });
});

Cypress.Commands.add('ClickBody', () => {
  return cy.get('body').click();
});

Cypress.Commands.add('ConsumePulseTypeQuiz', (pulseID, numberOfQuestions) => {
  cy.PulseTypeQuizAccessDirectly(pulseID);
  for (let i = 0; i < numberOfQuestions; i++) {
    cy.PulseSelectCorrectAnswerOnQuiz();
    if (i !== numberOfQuestions - 1) {
      PulseElements.messageCorrectAnswer().should('be.visible');
      PulseElements.buttonSkipQuestion().should('be.visible').click();
    } else {
      PulseElements.messageCorrectAnswer().should('be.visible');
      PulseElements.topNumberCorrectAnswers().contains(numberOfQuestions);
      cy.GetMetaDataSelectorAndClick('button-next-on-quiz');
    }
  }
});

Cypress.Commands.add('VerifyUserEnrollmentDetails', (enrollmentContext, name, status, type) => {
  switch (enrollmentContext) {
    case 'mission':
      cy.EnrollmentsAccess();
      cy.EnrollmentsSearchMission(name);

      if (type) {
        EnrollsMissionsElements.missionEnrollmentRequired().contains(type);
      }

      if (status) {
        cy.EnrollmentsVerifyStatus(status);
      }
      break;

    case 'trail':
      cy.EnrollmentsAccessTrail();
      cy.EnrollmentsSearchTrail(name);

      if (type) {
        EnrollsMissionsElements.missionEnrollmentRequired().contains(type);
      }

      if (status) {
        cy.EnrollmentsVerifyStatus(status);
      }
      break;
  }
});

Cypress.Commands.add('VerifyCategories', ({ missionId, visibleCategory = [], hiddenCategory = [] }) => {
  cy.MissionEdit(missionId);
  MissionElements.inputInfoCategory().click();

  visibleCategory.forEach((category) => {
    MissionElements.selectorCategory(category).should('contain.text', category);
  });

  hiddenCategory.forEach((category) => {
    MissionElements.selectorCategory(category).should('not.exist');
  });

  cy.ClickBody();
  cy.ContentManagementAccess();
  ContentManagementElements.listFilterCategory().click();

  visibleCategory.forEach((category) => {
    ContentManagementElements.listFilterCategoryOptions().should('contain.text', category);
  });

  hiddenCategory.forEach((category) => {
    ContentManagementElements.listFilterCategoryOptions().should('not.contain.text', category);
  });
});

Cypress.Commands.add(
  'HomeAccess',
  ({ workspace = util.WORKSPACE_DEFAULT, filter = 'highlights' }: { workspace?: string; filter?: string } = {}) => {
    cy.intercept('GET', '**/sections/availables**').as('loadSections');
    cy.intercept('GET', '**/contents').as('loadContents');
    cy.visit(`/${workspace}/home?filter=${filter}`);
    cy.wait('@loadSections');
    return cy.wait('@loadContents');
  },
);

declare global {
  namespace Cypress {
    interface Chainable {
      focusBlur(element): Chainable<JQuery<HTMLElement>>;
      MissionWaitLoad(): Chainable<JQuery<HTMLElement>>;
      TrailAccess(): Chainable<JQuery<HTMLElement>>;
      TrailAccessMobile(): Chainable<JQuery<HTMLElement>>;
      PressEsc(): Chainable<JQuery<HTMLElement>>;
      SearchChannelOrPulse(search: string): Chainable<Interception>;
      SearchMobileChannelAndPulse(search: string): Chainable<Interception>;
      FixturesMission(): Chainable<InternalMissionOptions>;
      FixturesTrail(): Chainable<TrailOptions>;
      FixturesChannel(): Chainable<ChannelOptions>;
      FixturesPulse(): Chainable<PulseOptions>;
      FixturesMissionStageContent(): Chainable<MissionStageContentOptions>;
      FixturesMissionLive(): Chainable<LiveMissionCreate>;
      FixturesChannelPulseContent(): Chainable<ChannelPulseContentOptions>;
      FixturesChannelAndPulse(): Chainable<ChannelPulseContentOptions>;
      GetMetaDataSelectorAndClick(element: string): Chainable<JQuery<HTMLElement>>;
      WaitConsumeContent(timeConsume: number): Chainable<JQuery<HTMLElement>>;
      UpdateFixtToRandom(fixtures): any;
      CreateChannelWithPulseLink(pulseContent, fixtures): Chainable<Interception>;
      CreateChannelWithPulseFile(pulseContent, fixtures): Chainable<any>;
      CreateChannelWithPulseQuiz(fixtures): Chainable<Interception>;
      BatchEnrollmentSetting(enrollmentRequired?: string): Chainable<JQuery<HTMLElement>>;
      MissionOrTrailSelectUserToTransfer(user: string): Chainable<JQuery<HTMLElement>>;
      VerifyMetadataElementVisible(metadataValue: string): Chainable<JQuery<HTMLElement>>;
      FixturesContent(): Chainable<FixtureContent>;
      FixturesEnrollment(): Chainable<FixtureEnrollment>;
      CreateMissionWithAllContentsTypeFileAndQuiz(): Chainable<FixtureEnrollment>;
      MissionCreateWithAllContentsTypeLink(): Chainable<FixtureEnrollment>;
      CreateMissionWithGeniallyAndQuiz(): Chainable<FixtureEnrollment>;
      ClickBody(): Chainable<JQuery<HTMLElement>>;
      ConsumePulseTypeQuiz(pulseID: string, numberOfQuestions: number): Chainable<JQuery<HTMLElement>>;
      VerifyUserEnrollmentDetails(
        enrollmentContext: string,
        name: string,
        status?: string,
        type?: string,
      ): Chainable<JQuery<HTMLElement>>;
      VerifyCategories(params: {
        missionId: string;
        visibleCategory?: string[];
        hiddenCategory?: string[];
      }): Chainable<JQuery<HTMLElement>>;
      HomeAccess(options?: { workspace?: string; filter?: string }): Chainable<Interception>;
    }
  }
}
