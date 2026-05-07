/// <reference types="cypress" />
import { getFullDateTomorrowBR, getRandomName } from '../../support/commands';
import * as StatusCode from '../../support/constants/status-code';
import * as util from '../../support/constants/utils';
import { LiveMissionCreate } from '../../support/interfaces/live-mission-options';
let missionToDelete;
let mission: LiveMissionCreate;
const PRESENTIAL_STEP = {
  presential_address: 'Rodovia SC 401, 4100 - Saco Grande, Florianópolis - SC, 88032-005',
  vacancies: util.NUMBER_VACANCIES,
};

it('Create a mission presential', () => {
  cy.intercept('PATCH', '**/missions/**').as('missionUpdate');
  cy.Login('admin');
  cy.FixturesMission()
    .then((missionDefault) => {
      mission = missionDefault;
      mission.mission_model = util.PRESENTIAL_EVENT;
      mission.name = getRandomName();
      cy.MissionLivePresentialStepInfo(mission);
    })
    .then((response) => {
      missionToDelete = response.id;
    })
    .then(() => {
      cy.MissionStepAccess('Presencial');
      cy.MissionStepPresential(PRESENTIAL_STEP);

      cy.wait('@missionUpdate').should((response) => {
        expect(response.response.statusCode).eq(StatusCode.OK);
        expect(response.response.body.presential.seats).eq(util.NUMBER_VACANCIES);
        expect(response.response.body.presential.address).eq(PRESENTIAL_STEP.presential_address);
      });

      cy.MissionPublish();
      cy.MissionLivePresentialPopupVerify(mission.name);
      cy.MissionTypeVerifyPopup('presencial');
      cy.MissionEventDataVerify(getFullDateTomorrowBR());
      cy.MissionVacanciesVerify(util.NUMBER_VACANCIES);
    });
});

it('Create a mission presential type closed by gui', () => {
  cy.intercept('PATCH', '**/missions/**').as('missionUpdate');
  cy.Login('admin');
  cy.FixturesMission()
    .then((missionDefault) => {
      mission = missionDefault;
      mission.mission_model = util.PRESENTIAL_EVENT;
      mission.mission_type.name = 'Fechado';
      mission.name = getRandomName();
      cy.MissionLivePresentialStepInfo(mission);
    })
    .then((response) => {
      missionToDelete = response.id;
      expect(response.mission_type).eq(mission.mission_type.id);
    })
    .then(() => {
      cy.MissionStepAccess('Presencial');
      cy.MissionStepPresential(PRESENTIAL_STEP);

      cy.wait('@missionUpdate').should((response) => {
        expect(response.response.statusCode).eq(StatusCode.OK);
        expect(response.response.body.presential.seats).eq(util.NUMBER_VACANCIES);
        expect(response.response.body.presential.address).eq(PRESENTIAL_STEP.presential_address);
      });

      cy.MissionPublish();
      cy.MissionLivePresentialPopupVerify(mission.name);
      cy.MissionTypeVerifyPopup('presencial');
      cy.MissionEventDataVerify(getFullDateTomorrowBR());
      cy.MissionVacanciesVerify(util.NUMBER_VACANCIES);
    });
});

afterEach(() => {
  if (missionToDelete) {
    cy.APICourseDelete(missionToDelete);
  }
});
