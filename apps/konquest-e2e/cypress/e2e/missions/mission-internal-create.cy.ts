/// <reference types="cypress" />

import * as StatusCode from '../../support/constants/status-code';
import MissionElements from '../../support/elements/mission-elements';
import { getRandomName } from '../../support/commands';
import { InternalMissionOptions, MissionQuizOptions } from '../../support/interfaces';
import * as util from '../../support/constants/utils';
import { ERROR_INVALID_FIELD_NAME } from '../../support/constants/errors-messages-mission';
let mission: InternalMissionOptions;
let missionToDelete;

describe.skip('Mission create by API', () => {
  it('Create mission by API', () => {
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = getRandomName();
      cy.Login('admin');
      cy.APIMissionCreate(missionDefault).then((missionCreated) => {
        expect(missionCreated.status).eq(StatusCode.Created);
        expect(missionCreated.body.id).not.to.be.empty;
        missionToDelete = missionCreated.body.id;
      });
    });
  });

  it('Create mission with content FILE by API', () => {
    cy.Login('admin');
    cy.FixturesMissionStageContent()
      .then((response) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((missionCreated) => {
        missionToDelete = missionCreated.id;
      });
  });

  it('Create mission with content LINK by API', () => {
    cy.Login('admin');
    cy.FixturesMissionStageContent()
      .then((response) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentLink(fixtures, fixtures.content.link.youtube);
      })
      .then((missionCreated) => {
        missionToDelete = missionCreated.id;
      });
  });

  it('Create mission with content QUIZ by API', () => {
    cy.Login('admin');
    cy.FixturesMissionStageContent()
      .then((response) => {
        response.content.addContentStage.content_type = 'EXAM';
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentQuiz(fixtures);
      })
      .then((missionCreated) => {
        missionToDelete = missionCreated.id;
      });
  });
  it('Create mission with multiple content by API', () => {
    cy.Login('admin');
    cy.FixturesMissionStageContent()
      .then((response) => {
        return response;
      })
      .then((fixtures) => {
        cy.MissionCreateMultipleWithContent(4, fixtures.content.video).then((listMissionsCreated) => {
          cy.log(listMissionsCreated);
        });
      });
  });
});

describe('Create mission', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '**/missions/**').as('missionUpdate');
    cy.Login('admin');
    cy.FixturesMission().then((missionDefault) => {
      mission = missionDefault;
      mission.name = getRandomName();
    });
  });

  it('Should create a default mission', () => {
    cy.MissionStepInfo(mission);
    cy.MissionPublish();
    cy.MissionVerifyPopup(mission.name);
  });

  it('Create mission with content QUIZ', () => {
    let fixtureQuiz: MissionQuizOptions;
    cy.fixture(util.FIXTURE_PATH_MISSION_QUIZ).then((fixture) => {
      fixtureQuiz = fixture;
    });
    cy.MissionStepInfo(mission)
      .then((response) => {
        missionToDelete = response.id;
      })
      .then(() => {
        cy.MissionStepAccess(util.CONTENTS);
        cy.MissionAccessInputTopicMission(util.MISSION_TOPIC);
        cy.MissionClickButtonConfirmNewTopic();
        cy.MissionClickFirstButtonNewContent();
        MissionElements.buttonContentQuiz().click();
        MissionElements.FieldTitleLinkYT().type('QuizName');
        MissionElements.ButtonSaveContent().should('be.visible').click();

        cy.MissionFillContentQuiz(fixtureQuiz);
        MissionElements.buttonAddNewQuestion().scrollIntoView().click();
        MissionElements.ExpandNewQuestion().scrollIntoView().click();

        MissionElements.fieldQuestionTextQuiz(2).scrollIntoView().type(fixtureQuiz.question.text);

        MissionElements.fieldAwnserTextQuiz(fixtureQuiz.option1.position).last().type(fixtureQuiz.option1.text);
        MissionElements.buttonCorrectAwnserQuiz(0).last().click();
        MissionElements.buttonAddNewAwnserQuiz().last().click();
        MissionElements.fieldAwnserTextQuiz(fixtureQuiz.option2.position).last().type(fixtureQuiz.option2.text);
        MissionElements.buttonAddNewAwnserQuiz().last().click();
        MissionElements.fieldAwnserTextQuiz(fixtureQuiz.option3.position).last().type(fixtureQuiz.option3.text);
        MissionElements.buttonNextOnCreateQuiz().click();
        cy.MissionSaveQuiz();
      });
  });

  it('Should create a closed mission', () => {
    mission.mission_type.name = 'Fechado';
    cy.MissionStepInfo(mission).then((response) => {
      missionToDelete = response.id;
      expect(response.mission_type).eq(mission.mission_type.id);
      cy.MissionPublish();
      cy.MissionVerifyPopup(mission.name);
    });
  });

  it('Should create a mission with satisfaction survey disabled', () => {
    cy.MissionStepInfo(mission).then((response) => {
      missionToDelete = response.id;
      cy.MissionStepAccess('Configurações');
      cy.MissionStepSettings('satisfaction_survey');
      cy.wait('@missionUpdate').should((response) => {
        expect(response.response.statusCode).eq(StatusCode.OK);
        expect(response.response.body.required_evaluation).eq(false);
      });
      MissionElements.missionNotificationSelector().contains(util.UPDATE_MESSAGE);
      cy.MissionPublish();
      cy.MissionVerifyPopup(mission.name);
    });
  });

  it('Should create a mission with content type assessment', () => {
    mission.assessment_type = 'CONTENT';
    cy.MissionStepInfo(mission).then((response) => {
      missionToDelete = response.id;
      expect(response.assessment_type).equal('CONTENT');
      cy.MissionPublish();
      cy.MissionVerifyPopup(mission.name);
    });
  });

  it('Should create a mission with QUIZ type assessment', () => {
    mission.assessment_type = 'QUIZ';
    cy.MissionStepInfo(mission).then((response) => {
      missionToDelete = response.id;
      expect(response.assessment_type).equal('QUIZ');
      cy.MissionPublish();
      cy.MissionVerifyPopup(mission.name);
    });
  });

  it('Should create temporary mission', () => {
    cy.MissionStepInfo(mission).then((response) => {
      missionToDelete = response.id;
      expect(response.expiration_date).eq(null);
      cy.MissionStepAccess('Configurações');
      cy.MissionStepSettings('mission_temporary');
      cy.wait('@missionUpdate').should((response) => {
        expect(response.response.statusCode).eq(StatusCode.OK);
        expect(response.response.body.expiration_date).to.not.equal(null);
      });
      MissionElements.missionNotificationSelector().contains(util.UPDATE_MESSAGE);
      cy.MissionPublish();
      cy.MissionVerifyPopup(mission.name);
    });
  });

  it('Should create inactive mission', () => {
    cy.MissionStepInfo(mission).then((response) => {
      missionToDelete = response.id;
      cy.MissionStepAccess('Configurações');
      cy.MissionStepSettings('Inactive');
      cy.wait('@missionUpdate').should((response) => {
        expect(response.response.statusCode).eq(StatusCode.OK);
        expect(response.response.body.is_active).eq(false);
      });
      MissionElements.missionNotificationSelector().contains(util.UPDATE_MESSAGE);
      cy.HomeAccess({ filter: util.COURSES });
      cy.MissionInactivatedVerified(mission.name);
    });
  });
  it('Should create a mission with content video', () => {
    const nameVideo = 'video10s.mp4';
    cy.MissionStepInfo(mission).then((response) => {
      missionToDelete = response.id;
      cy.MissionStepAccess(util.CONTENTS);
      cy.MissionAccessInputTopicMission(util.MISSION_TOPIC);
      cy.MissionClickButtonConfirmNewTopic();
      cy.MissionClickFirstButtonNewContent();
      cy.MissionSelectType({ contentType: true, video: true });
      cy.MissionFillContentVideo({ file: util.FILE_PATH_VIDEO_MP4 });
      cy.MissionSaveUploadContent();
      cy.MissionContentFileInTopic(nameVideo);
      cy.ContentManagementPublish(mission.name);
      cy.reload();
      cy.MissionFlagStatus(util.PUBLISHED);
    });
  });

  it('Should create a mission with custom goal date', () => {
    cy.MissionStepInfo(mission)
      .then((response) => {
        missionToDelete = response.id;
        mission.id = response.id;
      })
      .then(() => {
        cy.MissionStepAccess('Configurações');
        cy.intercept(`**/missions/${mission.id}`).as('updateMission');
        MissionElements.toggleGoalDate().scrollIntoView();
        MissionElements.toggleGoalDate().should('be.visible').click();
        MissionElements.inputCustomGoalDateField().type('1');
        cy.wait('@updateMission').then((response) => {
          expect(response.response.statusCode).eq(StatusCode.OK);
          expect(response.response.body.enrollment_goal_duration_days).eq(1);
        });
      });
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
    }
  });
});

describe('Internal mission create with invalid fields', () => {
  beforeEach(() => {
    cy.FixturesMission().then((missionDefault) => {
      mission = missionDefault;
      mission.name = getRandomName();
      cy.Login('admin');
      cy.TrailAccess(); //todo: DEV-6346
      cy.HomeAccess({ filter: util.COURSES });
      cy.MissionButtonFloatCreate({ timeout: 100000 });
      cy.MissionNew(util.MISSION_CLASS);
    });
  });
  it('Should create a mission with name invalid', () => {
    cy.MissionStepInputInfoNameMission().clear();
    cy.should('contain.text', '');
    cy.MissionStepInputInfoCategory();
    cy.MissionStepInputInfoType();
    cy.MissionStepOptionTextInType(mission.mission_type.name);
    cy.MissionStepSelectInfoLanguage();
    cy.MissionOptionTextInLanguage(mission.language);
    cy.MissionStepInputInfoDescription(mission.description);
    MissionElements.ButtonInfoNext().should('is.disabled');
    cy.MissionMessageError(ERROR_INVALID_FIELD_NAME);
  });

  it('Should create a mission with category invalid', () => {
    cy.MissionStepInputInfoNameMission(mission.name);
    cy.MissionStepInputInfoType();
    cy.MissionStepOptionTextInType(mission.mission_type.name);
    cy.MissionStepSelectInfoLanguage();
    cy.MissionOptionTextInLanguage(mission.language);
    cy.MissionStepInputInfoDescription(mission.description);
    MissionElements.ButtonInfoNext().should('is.disabled');
  });

  it('Should create a mission with type invalid', () => {
    cy.MissionStepInputInfoNameMission(mission.name);
    cy.MissionStepInputInfoCategory();
    cy.MissionStepSelectInfoLanguage();
    cy.MissionOptionTextInLanguage(mission.language);
    cy.MissionStepInputInfoDescription(mission.description);
    MissionElements.ButtonInfoNext().should('is.disabled');
  });

  it('Should create a mission with description invalid', () => {
    cy.MissionStepInputInfoNameMission(mission.name);
    cy.MissionStepInputInfoCategory();
    cy.MissionStepInputInfoType();
    cy.MissionStepOptionTextInType(mission.mission_type.name);
    cy.MissionStepSelectInfoLanguage();
    cy.MissionOptionTextInLanguage(mission.language);
    MissionElements.ButtonInfoNext().should('is.disabled');
  });
});

describe('Mission with changed performance', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '**/missions/**').as('missionUpdate');
    cy.Login('admin');
    cy.FixturesMission()
      .then((missionDefault) => {
        missionDefault.name = getRandomName();
        cy.MissionStepInfo(missionDefault);
      })
      .then((response) => {
        missionToDelete = response.id;
      });
  });

  it('Create mission with specific performance', () => {
    cy.MissionStepAccess('Configurações');
    MissionElements.missionMinimalPerformanceCheckBox().click();
    MissionElements.inputMinimalPerformance().clear().type('50');
    cy.wait('@missionUpdate').should((response) => {
      expect(response.response.statusCode).eq(StatusCode.OK);
    });

    cy.MissionPublish();
    MissionElements.missionPopupResumeSelector().eq(1).contains('Perf. min 50%');
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.APICourseDelete(missionToDelete);
    }
  });
});
