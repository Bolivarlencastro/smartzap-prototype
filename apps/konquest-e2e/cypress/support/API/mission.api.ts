import { Interception } from 'cypress/types/net-stubbing';
import * as StatusCode from '../../support/constants/status-code';
import {
  InternalMissionOptions,
  APIMissionEnrollmentEvaluationOp,
  ContentStageOptions,
  CypressResponse,
} from '../interfaces';
import { LiveMissionCreate } from '../interfaces/live-mission-options';
import * as util from '../constants/utils';

const baseUrl = `${Cypress.env('url_api')}/missions`;

// API Commands
Cypress.Commands.add('APIMissionCreate', (data) =>
  cy.keepsApi(
    baseUrl,
    {
      name: data.name,
      mission_category: data.mission_category,
      mission_type: data.mission_type.id,
      description: data.description,
      language_api: data.language,
      is_active: data.is_active,
      user_creator: data.user_creator,
      mission_model: data.mission_model,
      development_status: data.development_status,
      holder_image: data.holder_image,
      vertical_holder_image: data.vertical_holder_image,
      thumb_image: data.thumb_image,
      allow_self_enrollment_renewal: data.allow_self_enrollment_renewal,
      allow_self_reproved_enrollment_renewal: data.allow_self_reproved_enrollment_renewal,
      enrollment_goal_duration_days: data.enrollment_goal_duration_days,
    },
    'POST',
  ),
);

Cypress.Commands.add('APIMissionCreateStage', ({ name, order, mission }) => {
  return cy.keepsApi(`${baseUrl}/stages`, { name, order, mission }, 'POST');
});

Cypress.Commands.add('APIMissionAddContentStage', (data) => {
  cy.keepsApi(
    `${baseUrl}/stages/contents`,
    {
      content_type: data.content_type,
      content_type_id: data.content_type_id,
      created_date: data.created_date,
      description: data.description,
      genially_content_type_id: data.genially_content_type_id,
      id: data.id,
      learn_content_uuid: data.learn_content_uuid,
      mission: data.mission,
      name: data.name,
      order: data.order,
      stage: data.stage,
      updated_date: data.updated_date,
    },
    'POST',
  );
});

Cypress.Commands.add('APICourseDelete', (id) => cy.keepsApi(`${baseUrl}/${id}`, {}, 'DELETE'));

Cypress.Commands.add('APIMissionExternalCreate', (data) => {
  cy.keepsApi(
    `${baseUrl}/external`,
    {
      name: data.name,
      mission_category: data.mission_category,
      mission_type: data.mission_type.id,
      description: data.description,
      language: data.language_api,
      is_active: data.is_active,
      user_creator: data.user_creator,
      mission_model: data.mission_model,
      development_status: data.development_status,
      holder_image: data.holder_image,
      vertical_holder_image: data.vertical_holder_image,
      thumb_image: data.thumb_image,
      duration_time: data.external.duration_time,
      external: {
        course_url: data.external.course_url,
        course_type: data.external.course_type,
        provider: data.external.provider,
      },
    },
    'POST',
  );
});

Cypress.Commands.add('APIMissionExternalUpdate', (data) => {
  cy.keepsApi(
    `${baseUrl}/external/${data.missionUUID}`,
    {
      name: data.name,
      mission_category: data.mission_category,
      mission_type: data.mission_type.id,
      is_active: data.is_active,
    },
    'PATCH',
  );
});

Cypress.Commands.add('APIMissionSettingsUpdate', (data) => {
  cy.keepsApi(
    `${baseUrl}/${data.missionUUID}`,
    {
      is_active: data.is_active,
      required_evaluation: data.required_evaluation,
      allow_self_enrollment_renewal: data.allow_self_enrollment_renewal,
      allow_self_reproved_enrollment_renewal: data.allow_self_reproved_enrollment_renewal,
      minimum_performance: data.minimum_performance,
      expiration_date: data.expiration_date,
      id: data.id,
    },
    'PATCH',
  );
});

Cypress.Commands.add('APIMissionPublish', (data) => {
  cy.keepsApi(`${baseUrl}/${data}/publish`, {}, 'POST');
});

Cypress.Commands.add('APIMissionUpdate', (data) => {
  cy.keepsApi(
    `${baseUrl}/${data.missionUUID}`,
    {
      name: data.name,
      mission_category: data.mission_category,
      is_active: data.is_active,
      development_status: data.development_status,
    },
    'PATCH',
  );
});

// Commands
Cypress.Commands.add('APIMissionCreateWithContentFile', (fixtures, specificContent) => {
  const { mission, stage, content } = fixtures;
  let missionCreated;
  cy.APIMissionCreate(mission)
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      cy.wrap(response.body);
    })
    .then((response) => {
      missionCreated = response;
      stage.mission = missionCreated.id;
      return cy.APIMissionCreateStage(stage);
    })
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      cy.wrap(response.body);
    })
    .then((stageCreatedBefore) => {
      const payload: InternalMissionOptions = {
        missionUUID: missionCreated.id,
        development_status: util.DEVELOPMENT_STATUS.DONE,
      };
      cy.APIMissionCreateContentFile(specificContent, content.addContentStage, stageCreatedBefore);
      cy.APIMissionPublish(missionCreated.id);
      cy.APIMissionUpdate(payload);
      cy.wrap(missionCreated);
    });
});

Cypress.Commands.add('APIMissionCreateWithContentQuiz', (fixtures) => {
  const { mission, stage, content } = fixtures;
  let missionCreated;
  cy.APIMissionCreate(mission)
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      cy.wrap(response.body);
    })
    .then((response) => {
      missionCreated = response;
      stage.mission = missionCreated.id;
      return cy.APIMissionCreateStage(stage);
    })
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      cy.wrap(response.body);
    })
    .then((stageCreatedBefore) => {
      cy.APICreateLearnContentQuiz(stageCreatedBefore)
        .then((contentQuizCreated) => {
          content.content_type = 'EXAM';
          cy.APILinkContentToStageV2(content, contentQuizCreated.body, stageCreatedBefore);
          return cy.wrap(contentQuizCreated.body);
        })
        .then((payload) => {
          cy.APIQuestionsToExam(payload, content);
        });
      cy.ContentManagementPublish(missionCreated.name);
      cy.wrap(missionCreated);
    });
});

Cypress.Commands.add('APIMissionEnrollmentRating', (data) => {
  cy.keepsApi(
    `${baseUrl}/ratings`,
    {
      mission: data.missionUUID,
      rating: data.rating,
      user: data.userUUID,
    },
    'POST',
  );
});

Cypress.Commands.add('APIMissionEnrollmentEvaluation', (data) => {
  cy.keepsApi(
    `${baseUrl}/evaluations`,
    {
      mission: data.missionUUID,
      nps: data.evaluations.nps,
      user: data.userUUID,
      comment: data.evaluations.comment,
      enrollment: data.id,
      question_1_rating: data.evaluations.question_1_rating,
      question_2_rating: data.evaluations.question_2_rating,
      question_3_rating: data.evaluations.question_3_rating,
      question_4_rating: data.evaluations.question_4_rating,
      question_5_rating: data.evaluations.question_5_rating,
      question_6_rating: data.evaluations.question_6_rating,
      version: 1,
    },
    'POST',
  );
});

Cypress.Commands.add('APIMissionCreateContentFile', (contentData, contentStageInfo, stageCreatedBefore) => {
  cy.APICreateLearnContentFile(contentData).then((contentFileCreated) => {
    cy.APILinkContentToStageV2(contentStageInfo, contentFileCreated.body, stageCreatedBefore);
  });
});

Cypress.Commands.add('APILinkContentToStageV2', (contentStageInfo, contentFileCreated, stageCreatedBefore) => {
  contentStageInfo.content_type_id = contentFileCreated.content_type;
  contentStageInfo.created_date = contentFileCreated.created_date;
  contentStageInfo.description = contentFileCreated.description;
  contentStageInfo.learn_content_uuid = contentFileCreated.id;
  contentStageInfo.order = stageCreatedBefore.order;
  contentStageInfo.stage = stageCreatedBefore.id;
  contentStageInfo.updated_date = contentFileCreated.updated_date;
  cy.APIMissionAddContentStage(contentStageInfo);
});

Cypress.Commands.add('APIMissionCreateContentLink', (contentData, contentStageInfo, stageCreatedBefore) => {
  cy.APICreateLearnContentLink(contentData, contentStageInfo).then((contentLinkCreated) => {
    cy.APILinkContentToStageV2(contentStageInfo, contentLinkCreated.body, stageCreatedBefore);
  });
});

Cypress.Commands.add('APIMissionCreateWithContentLink', (fixtures, specificContent) => {
  const { mission, stage, content } = fixtures;
  let missionCreated;

  cy.APIMissionCreate(mission)
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      cy.wrap(response.body);
    })
    .then((response) => {
      missionCreated = response;
      stage.mission = missionCreated.id;
      return cy.APIMissionCreateStage(stage);
    })
    .then((response) => {
      expect(response.status).eq(StatusCode.Created);
      expect(response.body.id).not.to.be.empty;
      cy.wrap(response.body);
    })
    .then((stageCreatedBefore) => {
      const payload: InternalMissionOptions = {
        missionUUID: missionCreated.id,
        development_status: util.DEVELOPMENT_STATUS.DONE,
      };
      cy.APIMissionCreateContentLink(specificContent, content.addContentStage, stageCreatedBefore);
      cy.APIMissionPublish(missionCreated.id);
      cy.APIMissionUpdate(payload);
      cy.wrap(missionCreated);
    });
});

Cypress.Commands.add('APIMissionLiveCreate', (payload) => {
  cy.keepsApi(`${baseUrl}/live`, payload, 'POST');
});

Cypress.Commands.add('APIMissionLiveCreateDate', (payload_live) => {
  cy.keepsApi(`${baseUrl}/live/${payload_live.id}/dates`, payload_live.dates[0], 'POST');
});

Cypress.Commands.add('APIMissionLiveUpdate', (payload) => {
  cy.keepsApi(`${baseUrl}/live/${payload.id}`, payload, 'PATCH');
});

Cypress.Commands.add('APIMissionPresentialCreate', (payload) => {
  cy.keepsApi(`${baseUrl}/presential`, payload, 'POST');
});

Cypress.Commands.add('APIMissionPresentialCreateDate', (payload_presential) => {
  cy.keepsApi(`${baseUrl}/presential/${payload_presential.id}/dates`, payload_presential.dates[0], 'POST');
});

Cypress.Commands.add('APIMissionPresentialUpdate', (data) => {
  cy.keepsApi(
    `${baseUrl}/presential/${data.id}`,
    {
      id: data.id,
      presential: {
        seats: data.presential.seats,
        address: data.presential.address,
      },
    },
    'PATCH',
  );
});

Cypress.Commands.add('APIMissionLiveAddInstructor', (data) => {
  cy.keepsApi(
    `${baseUrl}/sync/${data.missionUUID}/instructor`,
    {
      user_id: data.userUUID,
    },
    'POST',
  );
});

Cypress.Commands.add('APIMissionLiveFinish', (liveMission) => {
  cy.keepsApi(`${baseUrl}/live/${liveMission}/complete`, {}, 'POST');
});

Cypress.Commands.add('APIMissionLiveAddContributor', (data) => {
  cy.keepsApi(`${baseUrl}/${data.missionUUID}/contributors/${data.userUUID}`, {}, 'POST');
});
declare global {
  namespace Cypress {
    interface Chainable {
      APIMissionCreate(data: InternalMissionOptions): Chainable<CypressResponse>;
      APIMissionCreateStage(data: {
        name: string;
        order: string;
        mission: string;
      }): Chainable<CypressResponse<InternalMissionOptions>>;
      APIMissionAddContentStage(data: ContentStageOptions): Chainable<Response<ContentStageOptions>>;
      APICourseDelete(id: string): Chainable<Interception>;
      APIMissionExternalCreate(data: InternalMissionOptions): Chainable<CypressResponse>;
      APIMissionExternalUpdate(data: InternalMissionOptions): Chainable<Interception>;
      APIMissionUpdate(data: InternalMissionOptions): Chainable<Interception>;
      APIMissionCreateWithContentFile(fixtures, specificContent: string): any;
      APILinkContentToStage(
        contentData: { addContentStage: ContentStageOptions },
        kontentData: ContentStageOptions,
        stageCreatedBefore: ContentStageOptions,
      ): Chainable<Interception>;
      APIMissionEnrollmentRating(data: InternalMissionOptions): Chainable<Interception>;
      APIMissionEnrollmentEvaluation(data: APIMissionEnrollmentEvaluationOp): Chainable<Interception>;
      APIMissionCreateContentFile(contentData, contentStageInfo, stageCreatedBefore): Chainable<Interception>;
      APILinkContentToStageV2(contentStageInfo, contentFileCreated, stageCreatedBefore): Chainable<Interception>;
      APIMissionCreateContentLink(contentData, contentStageInfo, stageCreatedBefore): any;
      APIMissionCreateWithContentLink(
        fixtures,
        specificContent: { name: string; link: string },
      ): Chainable<InternalMissionOptions>;
      APIMissionCreateWithContentQuiz(fixtures): any;
      APIMissionSettingsUpdate(data): Chainable<Interception>;
      APIMissionPublish(data): Chainable<Interception>;
      APIMissionLiveCreate(payload: LiveMissionCreate): Chainable<LiveMissionCreate>;
      APIMissionLiveCreateDate(payload: LiveMissionCreate['live']): Chainable<LiveMissionCreate['live']>;
      APIMissionLiveUpdate(payload: LiveMissionCreate): Chainable<LiveMissionCreate>;
      APIMissionPresentialCreate(payload: LiveMissionCreate): Chainable<CypressResponse>;
      APIMissionPresentialCreateDate(
        payload_presential: LiveMissionCreate['presential'],
      ): Chainable<LiveMissionCreate['presential']>;
      APIMissionPresentialUpdate(data): Chainable<Interception>;
      APIMissionLiveAddInstructor(data: { missionUUID: string; userUUID: string }): Chainable<Interception>;
      APIMissionLiveFinish(liveMission: string): Chainable<Interception>;
      APIMissionLiveAddContributor(data: { missionUUID: string; userUUID: string }): Chainable<Interception>;
    }
  }
}
