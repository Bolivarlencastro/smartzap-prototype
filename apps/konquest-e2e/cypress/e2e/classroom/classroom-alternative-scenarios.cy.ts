/// <reference types="cypress" />
import * as StatusCode from '../../support/constants/status-code';
import { getRandomName, getDateInFiveDays } from '../../support/commands';
import ClassroomElements from '../../support/elements/classroom-elements';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
let missionToDelete;
let testFixtures;
let missionCreated;
let addContentStage;

describe('Mission with a video', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMissionStageContent().then((fixtures) => {
      testFixtures = fixtures;
      testFixtures.mission.name = getRandomName();
      cy.APIMissionCreate(testFixtures.mission).then((response) => {
        missionToDelete = response.body.id;
        testFixtures.enrollment.missionUUID = response.body.id;
        testFixtures.enrollment.required_mission = false;
        cy.APIMissionBatchEnrollments(testFixtures.enrollment);
      });
    });
  });

  it('As a user, I should be able to set a custom goal date on the classroom', () => {
    cy.Login('user');
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    cy.EnrollmentsOpenClassroom();
    const newGoalDate = getDateInFiveDays();
    cy.ClassroomChangeGoalDate(newGoalDate);
    cy.EnrollmentsAccessDirectly();
    cy.EnrollmentsSearchMission(testFixtures.mission.name);
    EnrollsMissionsElements.missionEnrollmentGoalDateField().contains(newGoalDate); //TO DO: DEV-28259
  });
});

describe('Mission with 5 contents image', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMissionStageContent()
      .then((fixtures) => {
        testFixtures = fixtures;
        testFixtures.mission.name = getRandomName();
        testFixtures.stage.name = getRandomName();
        testFixtures.content.addContentStage.name = getRandomName();
        addContentStage = testFixtures.content.addContentStage;
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
        cy.APIMissionCreateContentFile(testFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentFile(testFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentFile(testFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentFile(testFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentFile(testFixtures.content.image, addContentStage, stageCreatedBefore);
        cy.ContentManagementPublish(missionCreated.name);
      })
      .then(() => {
        cy.APIMissionEnrollUser(testFixtures.enrollment);
      });
  });
  it.only('User should continue the content where stopped previously', () => {
    cy.Login('user');
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(10000);
    cy.ClassroomNextStep();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(10000);
    cy.ClassroomNextStep();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(10000);
    ClassroomElements.viewImage();
    cy.CloseClassroom();
    cy.MissionClosePopup();
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsContinueMission();
    ClassroomElements.classroomStepsList().should('have.length', '8');
    ClassroomElements.classroomCompletedStep().should('have.length', '3');
    cy.GetMetaDataSelectorAndClick('progress-panel-button');
    ClassroomElements.classroomEnrollmentProgressSelector().should('contain.text', '60');
  });
});

describe('User consume Vimeo and Soundcloud contents', () => {
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
        cy.APIMissionCreateContentLink(testFixtures.content.link.vimeo, addContentStage, stageCreatedBefore);
        cy.APIMissionCreateContentLink(testFixtures.content.link.soundcloud, addContentStage, stageCreatedBefore);
        cy.ContentManagementPublish(missionCreated.name);
      })
      .then(() => {
        cy.APIMissionEnrollUser(testFixtures.enrollment);
      });
  });

  it.skip('User should consume a mission with Vimeo and Soundcloud contents', () => {
    //DEV-28707
    cy.Login('user');
    cy.MissionEnrollmentsAccess();
    cy.EnrollmentsSearchMission(missionCreated.name);
    cy.EnrollmentsOpenClassroom();
    cy.ClassroomNextStep();
    cy.ClassroomNextStep();
    cy.ClassroomPlayContentVideoVimeo();
    cy.ClassroomNextStep();
    cy.WaitConsumeContent(15000);
    cy.ClassroomNextStep();
    ClassroomElements.classroomMenu().click();
    ClassroomElements.classroomStepsList().should('have.length', '5');
    ClassroomElements.classroomCompletedStep().should('have.length', '2');
    cy.GetMetaDataSelectorAndClick('progress-panel-button');
    ClassroomElements.classroomEnrollmentProgressSelector().should('contain.text', '99');
    cy.ClassroomSurveySatisfaction();
    cy.ClassroomFinishCourse();
    cy.ClassroomVerifyCertificate();
  });
});

afterEach(() => {
  cy.Login('admin');
  cy.APICourseDelete(missionToDelete);
});
