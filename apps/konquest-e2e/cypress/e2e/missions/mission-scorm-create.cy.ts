/// <reference types="cypress" />

import { ScormMissionCreate } from '../../support/interfaces/mission-options';
let missionToDelete;
let mission: ScormMissionCreate;
import { getRandomName } from '../../support/commands';
import MissionElements from '../../support/elements/mission-elements';
import * as StatusCode from '../../support/constants/status-code';
import * as util from '../../support/constants/utils';

describe('Scorm tests', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '**/missions/**').as('missionUpdate');
    cy.Login('admin');
    cy.FixturesMission().then((fixture: ScormMissionCreate) => {
      mission = { ...fixture, name: getRandomName() };
    });
  });
  it('Create scorm mission default', () => {
    cy.MissionScormCreate(util.FILE_PATH_SCORM, mission).then((response: ScormMissionCreate) => {
      missionToDelete = response.id;
      cy.MissionPublish();
      cy.MissionVerifyPopup(mission.name);
    });
  });

  it('Create scorm mission closed', () => {
    mission.mission_type.name = 'Fechado';
    cy.MissionScormCreate(util.FILE_PATH_SCORM, mission).then((response: ScormMissionCreate) => {
      missionToDelete = response.id;
      expect(response.mission_type).eq(mission.mission_type.id);
      cy.MissionStepAccess('Finalizar');
      cy.MissionPublish();
      cy.MissionStatusType(util.MISSION_STATUS_TYPE);
    });
  });

  it('Create scorm mission with satisfaction survey disabled', () => {
    cy.MissionScormCreate(util.FILE_PATH_SCORM, mission).then((response: ScormMissionCreate) => {
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

  it('Create mission scorm temporary', () => {
    cy.MissionScormCreate(util.FILE_PATH_SCORM, mission).then((response: ScormMissionCreate) => {
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

  it('Should create inactive scorm mission', () => {
    cy.MissionScormCreate(util.FILE_PATH_SCORM, mission).then((response: ScormMissionCreate) => {
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
});

afterEach(() => {
  if (missionToDelete) {
    cy.APICourseDelete(missionToDelete);
  }
});
