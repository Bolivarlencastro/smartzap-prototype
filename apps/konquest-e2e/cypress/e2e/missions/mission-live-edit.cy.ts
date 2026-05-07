/// <reference types="cypress" />

import MissionElements from '../../support/elements/mission-elements';
import { INSTRUCTOR_ID, USER_CY_ID } from '../../support/constants/users';
import * as util from '../../support/constants/utils';
let createdMission;
let missionToDelete;

describe('Administration actions in live mission', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMissionLive()
      .then((fixture) => cy.MissionLiveCreateWithDate(fixture))
      .then((mission) => {
        createdMission = mission;
        missionToDelete = mission.id;
        return cy.FixturesEnrollment();
      })
      .then((enrollmentDefault) => {
        enrollmentDefault.missionUUID = createdMission.id;
        cy.APIMissionPresentialLiveBatchEnrollment(enrollmentDefault);
      });
  });

  it('As an Instructor I should be able to edit a live mission', () => {
    const data = {
      missionUUID: createdMission.id,
      userUUID: INSTRUCTOR_ID,
    };
    cy.APIMissionLiveAddInstructor(data);
    cy.Login('instructor');
    cy.MissionLiveVerifyAbleToEdit(createdMission.id);
    cy.MissionLiveAccessDirectly(createdMission.id);
    cy.MissionLiveManageAttendancesList(false);
    cy.MissionLiveManageEnrollList(false);
    MissionElements.manageLiveAttendanceListButton().should('be.visible').click();
    MissionElements.liveAttendanceListSelector().should('be.visible').contains('0 matrículas confirmadas');
  });

  it('As a Contributor I should be able to edit a live mission', () => {
    const data = {
      missionUUID: createdMission.id,
      userUUID: USER_CY_ID,
    };
    cy.APIMissionLiveAddContributor(data);
    cy.Login('user');
    cy.MissionLiveVerifyAbleToEdit(createdMission.id);
    cy.MissionLiveAccessDirectly(createdMission.id);
    cy.MissionLiveManageAttendancesList(false);
    cy.MissionLiveManageEnrollList(false);
    MissionElements.manageLiveAttendanceListButton().should('be.visible').click();
    MissionElements.liveAttendanceListSelector().should('be.visible').contains('0 matrículas confirmadas');
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
    }
  });
});
