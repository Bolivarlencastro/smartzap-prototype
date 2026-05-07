import MissionElements from '../../support/elements/mission-elements';
import SettingsEnrollmentsElements from '../../support/elements/settings-enrollments-elements';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import * as USERS from '../../support/constants/users';
import { LiveMissionCreate } from '../../support/interfaces/live-mission-options';
import * as util from '../../support/constants/utils';
let createdMission: LiveMissionCreate;
let missionToDelete;

it('User enrolls in a mission live', () => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    })
    .then(() => {
      cy.Login('user');
      cy.MissionDetailAccessDirectly(createdMission.id);
      cy.MissionLiveOrPresencialEnroll();

      MissionElements.missionGiveUp().should('contain.text', 'Desistir');

      MissionElements.closePopupMissionLiveOrPresential().click();
      cy.MissionDetailAccessDirectly(createdMission.id);
      MissionElements.missionPresentialLiveStatusEnrollment().should('contain.text', 'Matrícula aceita');

      MissionElements.closePopupMissionLiveOrPresential().click();
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

it('Batch enrollments at live mission', () => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    })
    .then(() => {
      cy.MissionDetailAccessDirectly(createdMission.id);
      cy.MissionPresentialLiveBatchEnroll();
      MissionElements.popUpResultsEnrollment().contains(util.ONE_LINKED_USER).should('be.visible');
      cy.PressEsc();

      MissionElements.popUpMissionPresentialLive()
        .contains('1 matrícula confirmada')
        .scrollIntoView()
        .should('be.visible');

      MissionElements.livePresentialDetailsPopup().contains(util.ENROLLMENT_LIST).click();
      MissionElements.statusEnrolledPresentialLive().should('be.visible');

      MissionElements.closeListEnrollmentsPresentialLive().click();
      MissionElements.closePopupMissionLiveOrPresential().click();
      cy.SettingsEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdMission.name);
      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      cy.EnrollmentsVerifyStatus(util.ENROLLED);
    });
});

it('Delete enrollment on live mission', () => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    })
    .then(() => {
      cy.FixturesEnrollment().then((enrollmentDefault) => {
        enrollmentDefault.missionUUID = createdMission.id;
        cy.APIMissionPresentialLiveBatchEnrollment(enrollmentDefault);
      });

      cy.MissionDetailAccessDirectly(createdMission.id);
      MissionElements.livePresentialDetailsPopup().contains(util.ENROLLMENT_LIST).click();
      MissionElements.deleteEnrollmentPresentialLive();

      MissionElements.emptyListEnrollmentsPresentialLive()
        .contains(util.ENROLLMENT_NOT_FOUND_FILTERED)
        .should('be.visible');

      cy.Login('user');
      cy.EnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdMission.name);
      SettingsEnrollmentsElements.fieldEmptyEnrollment().contains(util.ENROLLMENT_NOT_FOUND).should('be.visible');
    });
});

it('Batch enroll on live mission with spreadsheet', () => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    })
    .then(() => {
      cy.FixturesMission().then((missionDefault) => {
        missionDefault.name = createdMission.name;
        cy.MissionPresentialLiveBatchEnrollWithSheet(missionDefault, util.FILE_PATH_BATCH_ENROLL);
        MissionElements.popUpResultsEnrollment().contains(util.ONE_LINKED_USER).should('be.visible');
        cy.PressEsc();
      });

      MissionElements.livePresentialDetailsPopup().contains(util.ENROLLMENT_LIST).click();
      MissionElements.statusEnrolledPresentialLive().should('be.visible');

      MissionElements.closeListEnrollmentsPresentialLive().click();
      MissionElements.closePopupMissionLiveOrPresential().click();
      cy.SettingsEnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdMission.name);
      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.REQUIRED);
      cy.EnrollmentsVerifyStatus(util.ENROLLED);
    });
});

it('"wait vacancies" enrollment on live mission', () => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      response.live.seats = 2;
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    })
    .then(() => {
      const enrollments = [
        {
          userUUID: USERS.USER_CY_2_ID,
          missionUUID: createdMission.id,
        },
        {
          userUUID: USERS.ADMIN_CY_2_ID,
          missionUUID: createdMission.id,
        },
      ];
      cy.APIMissionPresentialLiveBatchEnrollment(enrollments[0]);
      cy.APIMissionPresentialLiveBatchEnrollment(enrollments[1]);
    })
    .then(() => {
      cy.Login('user');
      cy.MissionDetailAccessDirectly(createdMission.id);
      EnrollsMissionsElements.enrollmentWaitingList().should('be.visible').click();

      MissionElements.missionPresentialLiveStatusEnrollment().contains(util.WAITING_LIST).should('be.visible');

      MissionElements.closePopupMissionLiveOrPresential().click();
      cy.EnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdMission.name);
      EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
      cy.EnrollmentsVerifyStatus(util.WAITING_VACANCY);
    });
});

it('"refuse" enrollment on live mission', () => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      response.live.allow_any_enrollment = false;
      response.live.seats = 2;
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    })
    .then(() => {
      cy.Login('user');
      cy.MissionDetailAccessDirectly(createdMission.id);
      cy.MissionLiveOrPresencialEnroll();
    })
    .then(() => {
      cy.Login('admin');
      cy.MissionDetailAccessDirectly(createdMission.id);
      MissionElements.livePresentialDetailsPopup().contains(util.ENROLLMENT_LIST).click();
      EnrollsMissionsElements.refuseEnrollmentPresentialLive();

      EnrollsMissionsElements.statusRefusedPresentialLive().should('be.visible');
    });
});

it('"approve" enrollment on live mission', () => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      response.live.allow_any_enrollment = false;
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    })
    .then(() => {
      cy.Login('user');
      cy.MissionDetailAccessDirectly(createdMission.id);
      cy.MissionLiveOrPresencialEnroll();
    })
    .then(() => {
      cy.Login('admin');
      cy.MissionDetailAccessDirectly(createdMission.id);
      MissionElements.livePresentialDetailsPopup().contains(util.ENROLLMENT_LIST).click();
      EnrollsMissionsElements.approveEnrollmentPresentialLive();

      EnrollsMissionsElements.statusEnrolledPresentialLive().should('be.visible');
    });
});

it.skip('close attendance list on live mission', () => {
  cy.Login('admin');
  cy.FixturesMissionLive()
    .then((response) => {
      return cy.MissionLiveCreateWithDate(response);
    })
    .then((mission) => {
      createdMission = mission;
      missionToDelete = createdMission.id;
    })
    .then(() => {
      const enrollments = [
        {
          userUUID: USERS.USER_CY_3_ID,
          missionUUID: createdMission.id,
        },
        {
          missionUUID: createdMission.id,
          userUUID: USERS.USER_CY_2_ID,
        },
        {
          userUUID: USERS.ADMIN_CY_2_ID,
          missionUUID: createdMission.id,
        },
      ];
      cy.APIMissionPresentialLiveEnrollment(enrollments[0]);
      cy.APIMissionPresentialLiveEnrollment(enrollments[1]);
      cy.APIMissionPresentialLiveEnrollment(enrollments[2]);
    })
    .then(() => {
      cy.MissionDetailAccessDirectly(createdMission.id);
      MissionElements.livePresentialDetailsPopup().contains(util.ENROLLMENT_LIST).click();

      cy.MissionPresentialLiveEnrollmentSearch(USERS.ADMIN_CY_2);
      EnrollsMissionsElements.refuseEnrollmentPresentialLive().click();
      cy.MissionDetailAccessDirectly(createdMission.id);
      MissionElements.livePresentialDetailsPopup().contains(util.ATTENDANCE_LIST).click();
      MissionElements.buttonCloseAttendanceList().click();
    });
});

afterEach(() => {
  if (missionToDelete) {
    cy.Login('admin');
    cy.APICourseDelete(missionToDelete);
  }
});
