/// <reference types="cypress" />

import * as StatusCode from '../../support/constants/status-code';
import { getRandomName } from '../../support/commands';
import ClassroomElements from '../../support/elements/classroom-elements';
import { InternalMissionOptions } from '../../support/interfaces/mission-options';
let missionToDelete;
let testFixtures;
let missionCreated;
let addContentStage;

describe('User consume main contents', () => {
  beforeEach(() => {
    cy.Login('admin');
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
        missionCreated = mission;
        missionToDelete = mission.id;
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
        cy.APIMissionCreateContentLink(testFixtures.content.link.youtube, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentLink(testFixtures.content.link.googledrive.doc, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentLink(
          testFixtures.content.link.googledrive.sheet,
          addContentStage,
          stageCreatedBefore,
        );
        cy.APIMissionCreateContentLink(
          testFixtures.content.link.googledrive.presentation,
          addContentStage,
          stageCreatedBefore,
        );
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
            cy.APIMissionEnrollUser(testFixtures.enrollment);
          });
      });
  });
  it.only('User should consume a mission with main contents - happy way', () => {
    const payload: InternalMissionOptions = {
      missionUUID: missionCreated.id,
      development_status: 'DONE',
    };
    cy.APIMissionUpdate(payload);
    cy.Login('user');
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();
    cy.ClassroomPlayContentVideo();
    cy.ClassroomNextStep();
    ClassroomElements.viewImage();
    cy.ClassroomNextStep();
    ClassroomElements.playAudioClassroom();
    cy.WaitConsumeContent(45000);
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(15000);
    cy.ClassroomNextStep();
    cy.ClassroomPlayContentVideo();
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(5000);
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(5000);
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(5000);
    cy.ClassroomNextContentQuiz();
    cy.ClassroomQuizOptionCorrect();
    cy.ClassroomNextFinishQuiz();
    // ClassroomElements.classroomMenu().click();
    ClassroomElements.classroomStepsList().should('have.length', '16');
    ClassroomElements.classroomCompletedStep().should('have.length', '13');
    cy.GetMetaDataSelectorAndClick('progress-panel-button');
    cy.ClassroomVerifyCertificate();
    cy.ClickBody();
    cy.ClassroomSurveySatisfaction();
    cy.ClassroomFinishCourse();
    cy.ClassroomVerifyCertificate();
  });
});

afterEach(() => {
  cy.Login('admin');
  cy.APICourseDelete(missionToDelete);
});
