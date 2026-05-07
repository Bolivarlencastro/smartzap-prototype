import {
  getDateToday,
  getRandomName,
  getStartDateMissionLiveOrPresential,
  getEndDateMissionLiveOrPresential,
} from '../../support/commands';
import MissionElements from '../../support/elements/mission-elements';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import { LiveMissionCreate } from '../../support/interfaces/live-mission-options';
import * as util from '../../support/constants/utils';

let createdMission;
let missionToDelete;

it('User enrolls in a mission presential', () => {
  cy.Login('admin');
  cy.FixturesMission()
    .then((fixture) => {
      const presential_mission_payload: LiveMissionCreate = {
        ...fixture,
        name: getRandomName(),
        mission_type: { id: util.OPEN_TYPE_ID },
        presential: {
          dates: [
            {
              date: getDateToday(),
              start_at: getStartDateMissionLiveOrPresential(),
              end_at: getEndDateMissionLiveOrPresential(),
            },
          ],
          seats: 1,
          address: 'Acate',
        },
      };
      cy.MissionPresentialCreateWithDate(presential_mission_payload).then((mission) => {
        createdMission = mission;
        missionToDelete = createdMission.id;
      });
    })
    .then(() => {
      cy.Login('user');
      cy.MissionDetailAccessDirectly(createdMission.id);
      cy.MissionLiveOrPresencialEnroll();

      MissionElements.missionGiveUp().should('contain.text', 'Desistir');

      cy.MissionDetailAccessDirectly(createdMission.id);
      MissionElements.missionPresentialLiveStatusEnrollment().should('contain.text', 'Matrícula aceita');

      MissionElements.missionPresentialLiveStatusEnrollment().should('contain.text', 'Não há mais vagas');
      MissionElements.closePopupMissionLiveOrPresential().click();

      cy.MissionEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdMission.name);
      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
      MissionElements.MissionNameListEnrollments().should('contain.text', createdMission.name);
    });
});

it('Should batch enrollment at presential mission', () => {
  cy.Login('admin');
  cy.FixturesMission()
    .then((fixture) => {
      const presential_mission_payload: LiveMissionCreate = {
        ...fixture,
        name: getRandomName(),
        mission_type: { id: util.OPEN_TYPE_ID },
        presential: {
          dates: [
            {
              date: getDateToday(),
              start_at: getStartDateMissionLiveOrPresential(),
              end_at: getEndDateMissionLiveOrPresential(),
            },
          ],
          address: 'Acate',
          seats: 2,
        },
      };
      cy.MissionPresentialCreateWithDate(presential_mission_payload).then((mission) => {
        createdMission = mission;
        missionToDelete = createdMission.id;
      });
    })
    .then(() => {
      cy.FixturesMission().then((missionDefault) => {
        missionDefault.name = createdMission.name;
        cy.MissionDetailAccessDirectly(createdMission.id);
        cy.MissionPresentialLiveBatchEnroll();
      });

      MissionElements.popUpResultsEnrollment().contains(util.ONE_LINKED_USER).should('be.visible');
      cy.PressEsc();

      MissionElements.livePresentialDetailsPopup().contains('Lista de matrícula').click();
      MissionElements.statusEnrolledPresentialLive().should('be.visible');
      MissionElements.closeListEnrollmentsPresentialLive().click();
      MissionElements.closePopupMissionLiveOrPresential().click();

      cy.SettingsEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdMission.name);
      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      cy.EnrollmentsVerifyStatus(util.ENROLLED);
    });
});

it('Should reprove presential without attendance mission', () => {
  cy.Login('admin');
  cy.FixturesMission()
    .then((fixture) => {
      const presential_mission_payload: LiveMissionCreate = {
        ...fixture,
        name: getRandomName(),
        mission_type: { id: util.OPEN_TYPE_ID },
        presential: {
          dates: [
            {
              date: getDateToday(),
              start_at: getStartDateMissionLiveOrPresential(),
              end_at: getEndDateMissionLiveOrPresential(),
            },
          ],
          address: 'Acate',
          seats: 2,
        },
      };
      cy.MissionPresentialCreateWithDate(presential_mission_payload).then((mission) => {
        createdMission = mission;
        missionToDelete = createdMission.id;
      });
    })
    .then(() => {
      cy.FixturesMission().then((missionDefault) => {
        missionDefault.name = createdMission.name;
        cy.MissionLiveAccessDirectly(createdMission.id);
        cy.MissionPresentialLiveBatchEnroll();
        MissionElements.batchEnrollmentsPopup().should('be.visible').click();
      });

      MissionElements.closePopupMissionLiveOrPresential().click();
      cy.MissionSearch(createdMission.name);
      cy.MissionOpenCard(createdMission.name);
      cy.MissionPresentialLiveFinish();

      cy.SearchInMissionCreatedByMe(createdMission.name);
      cy.MissionOpenCard(createdMission.name);
      MissionElements.missionButtonDelete();

      MissionElements.closePopupMissionLiveOrPresential().click();
      cy.SettingsEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdMission.name);
      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      cy.EnrollmentsVerifyStatus(util.REPROVED);
    });
});

afterEach(() => {
  if (missionToDelete) {
    cy.Login('admin');
    cy.APICourseDelete(missionToDelete);
  }
});
