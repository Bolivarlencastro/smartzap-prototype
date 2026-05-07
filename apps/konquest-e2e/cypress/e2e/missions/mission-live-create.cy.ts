/// <reference types="cypress" />
import { getFullDateTomorrowBR, getRandomName } from '../../support/commands';
import * as StatusCode from '../../support/constants/status-code';
import { ADMIN_CY_2, ADMIN_CY_NAME, INSTRUCTOR } from '../../support/constants/users';
import * as util from '../../support/constants/utils';
import MissionElements from '../../support/elements/mission-elements';
import { LiveMissionCreate } from '../../support/interfaces/live-mission-options';
let missionToDelete;
let mission: LiveMissionCreate;

it('Create a mission live', () => {
  cy.intercept('PATCH', '**/missions/**').as('missionUpdate');
  cy.Login('admin');
  cy.FixturesMission()
    .then((missionDefault) => {
      mission = missionDefault;
      mission.name = getRandomName();
      mission.mission_model = util.ONLINE_EVENT;
      cy.MissionLivePresentialStepInfo(mission);
    })
    .then((response) => {
      missionToDelete = response.id;
    })
    .then(() => {
      cy.MissionStepAccess('Live');
      cy.MissionStepLive(util.NUMBER_VACANCIES);

      cy.wait('@missionUpdate').should((response) => {
        expect(response.response.statusCode).eq(StatusCode.OK);
        expect(response.response.body.live.seats).eq(util.NUMBER_VACANCIES);
        expect(response.response.body.live.url).eq(util.util.ONLINE_EVENT_URL_MOCK);
      });

      cy.MissionPublish();
      cy.MissionLivePresentialPopupVerify(mission.name);
      cy.MissionTypeVerifyPopup('live');
      cy.MissionEventDataVerify(getFullDateTomorrowBR());
      cy.MissionVacanciesVerify(util.NUMBER_VACANCIES);
    });
});

it('Create a mission live type closed', () => {
  cy.intercept('PATCH', '**/missions/**').as('missionUpdate');
  cy.Login('admin');
  cy.FixturesMission()
    .then((missionDefault) => {
      mission = missionDefault;
      mission.mission_type.name = 'Fechado';
      mission.name = getRandomName();
      mission.mission_model = util.ONLINE_EVENT;
      cy.MissionLivePresentialStepInfo(mission);
    })
    .then((response) => {
      missionToDelete = response.id;
      expect(response.mission_type).eq(mission.mission_type.id);
    })
    .then(() => {
      cy.MissionStepAccess('Live');
      cy.MissionStepLive(util.NUMBER_VACANCIES);

      cy.wait('@missionUpdate').should((response) => {
        expect(response.response.statusCode).eq(StatusCode.OK);
        expect(response.response.body.live.seats).eq(util.NUMBER_VACANCIES);
        expect(response.response.body.live.url).eq(util.util.ONLINE_EVENT_URL_MOCK);
      });

      cy.MissionPublish();
      cy.MissionLivePresentialPopupVerify(mission.name);
      cy.MissionTypeVerifyPopup('live');
      cy.MissionEventDataVerify(getFullDateTomorrowBR());
      cy.MissionVacanciesVerify(util.NUMBER_VACANCIES);
    });
});

it('Create a mission live with instructor and then remove instructors', () => {
  cy.Login('admin');
  cy.FixturesMission()
    .then((missionDefault) => {
      mission = missionDefault;
      mission.name = getRandomName();
      mission.mission_model = util.ONLINE_EVENT;
      cy.MissionLivePresentialStepInfo(mission);
    })
    .then((response) => {
      missionToDelete = response.id;
    })
    .then(() => {
      cy.MissionStepAccess('Live');
      cy.MissionStepLive(util.NUMBER_VACANCIES);

      cy.MissionAddInternalInstructor(Cypress.env('admin_cy'));
      MissionElements.listInstructors().contains(ADMIN_CY_NAME);
      cy.MissionAddInternalInstructor(Cypress.env('admin_cy2'));
      MissionElements.listInstructors().contains(ADMIN_CY_2);
      cy.MissionAddExternalInstructor(INSTRUCTOR);
      MissionElements.listInstructors().contains(INSTRUCTOR.name);
      MissionElements.ButtonInfoNext().click();
      cy.MissionPublish();

      MissionElements.missionDetailsInstructors().should('have.length', '3');

      cy.MissionButtonEdit();
      cy.MissionStepAccess('Live');
      MissionElements.ButtonInfoNext().click();
      cy.MissionRemoveFirstInstructor();
      cy.MissionRemoveFirstInstructor();
      cy.MissionRemoveFirstInstructor();
      MissionElements.ButtonInfoNext().click();
      cy.MissionPublish();

      MissionElements.missionDetailsInstructors().should('not.exist');
    });
});

it('Create a mission live with two schedules and then edit and remove one', () => {
  cy.Login('admin');
  cy.FixturesMission()
    .then((missionDefault) => {
      mission = missionDefault;
      mission.name = getRandomName();
      mission.mission_model = util.ONLINE_EVENT;
      cy.MissionLivePresentialStepInfo(mission);
    })
    .then((response) => {
      missionToDelete = response.id;
    })
    .then(() => {
      cy.MissionStepAccess('Live');
      MissionElements.inputLiveLink().type(util.util.ONLINE_EVENT_URL_MOCK);
      MissionElements.inputVacancies().clear().type(util.NUMBER_VACANCIES);
      MissionElements.livePresentialAddNewSchedule().click();
      MissionElements.ButtonInfoNext().click();
      cy.MissionPublish();

      cy.MissionEventDataVerify(getFullDateTomorrowBR());

      cy.MissionButtonEdit();
      cy.MissionStepAccess('Live');
      cy.GetMetaDataSelectorAndClick('live-presential-remove-schedule');

      MissionElements.livePresentialDateSelector().should('have.length', '1');
    });
});

afterEach(() => {
  if (missionToDelete) {
    cy.APICourseDelete(missionToDelete);
  }
});
