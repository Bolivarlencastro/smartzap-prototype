/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import * as util from '../../support/constants/utils';
import ClassroomElements from '../../support/elements/classroom-elements';
import MissionElements from '../../support/elements/mission-elements';

let missionToDelete;
let createdMission;

describe('User actions on missions in the mobile viewer', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMission()
      .then((fixtures) => ({
        ...fixtures,
        name: getRandomName(),
        mission_type: { id: util.OPEN_TYPE_ID },
      }))
      .then((fixtures) => cy.APIMissionCreate(fixtures))
      .then((response) => {
        createdMission = response.body;
        missionToDelete = createdMission.id;
      });
  });

  it('User should access the internal mission and enroll in it', () => {
    cy.Login('user');
    cy.MissionSearchMobile(createdMission.name);
    MissionElements.Card(createdMission.name).click();
    cy.MissionEnrollMobile();
    ClassroomElements.classroomMenu().click();
    ClassroomElements.buttonExitClassroomMobile().click();
    cy.GetMetaDataSelectorAndClick('button-close-mission-popup-mobile');
    cy.EnrollmentsAccessMobile();
    cy.EnrollmentsSearchMission(createdMission.name);
    EnrollsMissionsElements.enrollmentStatusMobile()
      .contains(util.ENROLLED.slice(0, -1) + 'a')
      .should('be.visible');
  });

  it('User should check main fields on internal mission', () => {
    const metadataValues = [
      'button-close-mission-popup-mobile',
      'GENERAL.DURATION-mobile',
      'MISSION.MISSION_MIN_PERFORMANCE-mobile',
      'GENERAL.EVALUATION-mobile',
      'mission-title-mobile',
      'created-date-mobile',
      'mission-tag-mobile',
    ];

    cy.Login('user');
    cy.MissionSearchMobile(createdMission.name);
    MissionElements.Card(createdMission.name).click();

    metadataValues.forEach((metadataValue) => {
      cy.VerifyMetadataElementVisible(metadataValue);
    });
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
    }
  });
});
