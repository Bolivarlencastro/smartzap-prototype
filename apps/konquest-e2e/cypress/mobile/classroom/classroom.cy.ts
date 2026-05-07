/// <reference types="cypress" />
import * as StatusCode from '../../support/constants/status-code';
import { getRandomName } from '../../support/commands';
import ClassroomElements from '../../support/elements/classroom-elements';
import { MissionStageContentOptions } from '../../support/interfaces';
const testFixtures = [];
const missionToDelete = [];

let missionCreated;
let addContentStage;
let newFixtures: MissionStageContentOptions;

describe('Mission with all contents - classroom', () => {
  before(() => {
    cy.viewport(1920, 1080);
    missionToDelete.length = 0;
    cy.Login('admin');
    cy.CreateMissionWithAllContentsTypeFileAndQuiz().then((fixtures) => {
      testFixtures.push(fixtures);
      missionToDelete.push(testFixtures[0].mission.missionUUID);
      cy.ContentManagementPublish(testFixtures[0].mission.name);
      cy.APIMissionEnrollUser(testFixtures[0].enrollment);
    });
    cy.MissionCreateWithAllContentsTypeLink().then((fixtures) => {
      testFixtures.push(fixtures);
      missionToDelete.push(testFixtures[1].mission.missionUUID);
      cy.ContentManagementPublish(testFixtures[1].mission.name);
      cy.APIMissionEnrollUser(testFixtures[1].enrollment);
    });
  });
  it('User should consume a mission with all contents type file and quiz - happy way', () => {
    cy.viewport('iphone-xr');
    cy.Login('user');
    cy.EnrollmentsAccessMobile();
    cy.EnrollmentsSearchMission(testFixtures[0].mission.name);
    cy.EnrollmentsStartCourseMobile();
    cy.ClassroomStartCourseMobile();
    cy.ClassroomNextContentMobile();
    cy.ClassroomPlayContentVideo();
    cy.ClassroomNextContentMobile();
    ClassroomElements.viewImage();
    cy.WaitConsumeContent(15000);
    cy.ClassroomNextContentMobile();
    ClassroomElements.playAudioClassroom();
    cy.WaitConsumeContent(45000);
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(15000);
    cy.ClassroomNextContentQuiz();
    cy.ClassroomQuizOptionCorrect();
    cy.ClassroomNextFinishQuiz();
    ClassroomElements.classroomMenu().click();
    ClassroomElements.classroomStepsList().should('have.length', '12');
    ClassroomElements.classroomEnrollmentProgressSelector().should('contain.text', '99');
    ClassroomElements.classroomCompletedStep().should('have.length', '9');
    ClassroomElements.classroomMenu().click({ force: true });
    cy.ClassroomSurveySatisfaction();
    cy.ClassroomFinishCourse();
    cy.ClassroomVerifyCertificate();
    ClassroomElements.performClassroomFinish().should(($div) => {
      const n = parseFloat($div.text());
      expect(n).to.be.at.least(70);
    });
  });
  it('User should consume a mission with all contents type link - happy way', () => {
    cy.viewport('iphone-xr');
    cy.Login('user');
    cy.EnrollmentsAccessMobile();
    cy.EnrollmentsSearchMission(testFixtures[1].mission.name);
    cy.EnrollmentsStartCourseMobile();
    cy.ClassroomStartCourseMobile();
    cy.ClassroomNextContentMobile();
    cy.ClassroomPlayContentVideo();
    cy.ClassroomNextContentMobile();
    // cy.ClassroomPlayContentVideoVimeo(); TODO: DEV-20080
    // cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(45000);
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(20000);
    cy.ClassroomNextContentMobile();
    ClassroomElements.classroomMenu().click();
    ClassroomElements.classroomStepsList().should('have.length', '8');
    ClassroomElements.classroomEnrollmentProgressSelector().should('contain.text', '99');
    ClassroomElements.classroomCompletedStep().should('have.length', '5');
    ClassroomElements.classroomMenu().click({ force: true });
    cy.ClassroomSurveySatisfaction();
    cy.ClassroomFinishCourse();
    cy.ClassroomVerifyCertificate();
    ClassroomElements.performClassroomFinish().should(($div) => {
      const n = parseFloat($div.text());
      expect(n).to.be.at.least(70);
    });
  });
});

describe('Mission with 5 contents image', () => {
  before(() => {
    missionToDelete.length = 0;
    cy.Login('admin');
    cy.FixturesMissionStageContent()
      .then((fixtures) => {
        newFixtures = fixtures;
        newFixtures.mission.name = getRandomName();
        newFixtures.stage.name = getRandomName();
        newFixtures.content.addContentStage.name = getRandomName();
        addContentStage = newFixtures.content.addContentStage;
      })
      .then(() => {
        return cy.APIMissionCreate(newFixtures.mission);
      })
      .then((mission) => {
        expect(mission.status).eq(StatusCode.Created);
        expect(mission.body.id).not.to.be.empty;
        return mission.body;
      })
      .then((mission) => {
        missionCreated = mission;
        missionToDelete.push(mission.id);
        newFixtures.enrollment.missionUUID = mission.id;
        newFixtures.stage.mission = mission.id;
      })
      .then(() => {
        return cy.APIMissionCreateStage(newFixtures.stage);
      })
      .then((response) => {
        expect(response.status).eq(StatusCode.Created);
        expect(response.body.id).not.to.be.empty;
        return response.body;
      })
      .then((stageCreatedBefore) => {
        cy.APIMissionCreateContentFile(newFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentFile(newFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentFile(newFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentFile(newFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentFile(newFixtures.content.image, addContentStage, stageCreatedBefore);
      })
      .then(() => {
        cy.viewport(1920, 1080);
        cy.ContentManagementPublish(missionCreated.name);
        cy.APIMissionEnrollUser(newFixtures.enrollment);
      });
  });
  it('User should continue the content where stopped previously', () => {
    //TODO: DEV-19847
    cy.viewport('iphone-xr');
    cy.Login('user');
    cy.EnrollmentsAccessMobile();
    cy.EnrollmentsSearchMission(newFixtures.mission.name);
    cy.EnrollmentsStartCourseMobile();
    cy.ClassroomStartCourseMobile();
    cy.ClassroomNextContentMobile();
    ClassroomElements.viewImage();
    cy.ClassroomNextContentMobile();
    ClassroomElements.viewImage();
    cy.ClassroomNextContentMobile();
    cy.WaitConsumeContent(10000);
    ClassroomElements.viewImage();
    ClassroomElements.classroomMenu().click();
    ClassroomElements.buttonExitClassroomMobile().click();
    cy.GetMetaDataSelectorAndClick('button-close-mission-popup-mobile');
    cy.EnrollmentsAccessMobile();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsContinueMissionMobile();
    ClassroomElements.classroomMenu().click();
    ClassroomElements.classroomStepsList().should('have.length', '8');
    ClassroomElements.classroomEnrollmentProgressSelector().should('contain.text', '59');
    ClassroomElements.classroomCompletedStep().should('have.length', '3');
  });
});

after(() => {
  cy.Login('admin');
  missionToDelete.forEach((mission) => {
    cy.APICourseDelete(mission);
  });
});
