import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import * as util from '../../support/constants/utils';
import { getRandomName } from '../../support/commands';
import { MissionStageContentOptions } from '../../support/interfaces';

let testFixture: MissionStageContentOptions;
let missionToDelete;
let createdMission;

describe('Enrollments status mobile', () => {
  describe('Internal Mission - free enrollment', () => {
    beforeEach(() => {
      cy.Login('admin');
      cy.FixturesMissionStageContent()
        .then((response: MissionStageContentOptions) => {
          response.mission.mission_type.id = util.OPEN_TYPE_ID;
          testFixture = response;
          return cy.UpdateFixtToRandom(response);
        })
        .then((fixtures) => {
          cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
        })
        .then((response) => {
          createdMission = response;
          missionToDelete = createdMission.id;
          testFixture.enrollment.missionUUID = createdMission.id;
          testFixture.enrollment.required_mission = false;
          cy.APIMissionEnrollUser(testFixture.enrollment);
        })
        .then((response) => (testFixture.enrollment.id = response.body.id));
    });

    it('Should be enrollment "started"', () => {
      cy.Login('user');

      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      cy.viewport(1920, 1080);
      cy.EnrollmentsOpenClassroomMobile();
      cy.ClassroomNextStep();
      cy.ClassroomNextStep();
      cy.ClassroomPlayContentVideo();
      cy.CloseClassroom();
      cy.MissionClosePopup();

      cy.viewport('iphone-xr');
      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);
      EnrollsMissionsElements.enrollmentStatusMobile().contains(util.STARTED).should('be.visible');
      EnrollsMissionsElements.actionButtonOnEnrollmentMobile(util.CONTINUE_MISSION).click();
      EnrollsMissionsElements.actionButtonOnCardMobile(util.OPEN);
    });

    it('Should be enrollment "enrolled"', () => {
      cy.Login('user');
      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      EnrollsMissionsElements.enrollmentStatusMobile()
        .contains(util.ENROLLED.slice(0, -1) + 'a')
        .should('be.visible');
      EnrollsMissionsElements.actionButtonOnEnrollmentMobile(util.VIEW_MISSION).click();
      EnrollsMissionsElements.actionButtonOnCardMobile(util.OPEN);
    });

    it('Should be enrollment "finished"', () => {
      cy.APIMissionEnrollmentManualFinish(testFixture.enrollment);

      cy.Login('user');
      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      EnrollsMissionsElements.enrollmentStatusMobile()
        .contains(testFixture.content.statusEnrollment.finish)
        .should('be.visible');
      EnrollsMissionsElements.optionEnrollmentListMobile().contains(util.DOWNLOAD_CERTIFICATE).should('be.visible');
    });

    it('Should be enrollment "inactive"', () => {
      cy.APIMissionPublish(createdMission.id);

      cy.Login('user');
      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      EnrollsMissionsElements.enrollmentStatusMobile().contains(util.INACTIVE).should('be.visible');
    });

    it('Should be enrollment "give up"', () => {
      cy.Login('user');
      cy.APIMissionEnrollmentGiveUp(testFixture.enrollment);

      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      EnrollsMissionsElements.enrollmentStatusMobile().contains(util.GIVE_UP).should('be.visible');
    });

    it('Should be enrollment "reproved"', () => {
      testFixture.enrollment.performance = '0.1';
      cy.APIMissionEnrollmentManualFinish(testFixture.enrollment);

      cy.Login('user');
      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      EnrollsMissionsElements.enrollmentStatusMobile().contains(util.REPROVED).should('be.visible');
      EnrollsMissionsElements.actionButtonOnEnrollmentMobile(util.RE_ENROLL).click();
      EnrollsMissionsElements.contentDialogMissionMobile().contains(util.NEW_ENROLL).should('be.visible');
    });
  });

  describe('Internal Mission - required enrollment', () => {
    beforeEach(() => {
      cy.Login('admin');
      cy.FixturesMissionStageContent()
        .then((response: MissionStageContentOptions) => {
          response.mission.mission_type.id = util.OPEN_TYPE_ID;
          testFixture = response;
          return cy.UpdateFixtToRandom(response);
        })
        .then((fixtures) => {
          cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
        })
        .then((response) => {
          createdMission = response;
          missionToDelete = createdMission.id;
          testFixture.enrollment.missionUUID = createdMission.id;
          cy.APIMissionEnrollUser(testFixture.enrollment);
        })
        .then((response) => (testFixture.enrollment.id = response.body.id));
    });
    it('Should be enrollment "reproved"', () => {
      testFixture.enrollment.performance = '0.1';
      cy.APIMissionEnrollmentManualFinish(testFixture.enrollment);

      cy.Login('user');
      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      EnrollsMissionsElements.enrollmentStatusMobile().contains(util.REPROVED).should('be.visible');
      EnrollsMissionsElements.actionButtonOnEnrollmentMobile(util.VIEW_MISSION).click();
      EnrollsMissionsElements.actionButtonOnCardMobile(util.ENROLL);
      EnrollsMissionsElements.buttonCertificateDisabledMobile();
    });
  });

  describe('External Mission - required enrollment', () => {
    let testFixture;
    beforeEach(() => {
      cy.Login('admin');
      cy.FixturesMissionStageContent()
        .then((fixture) => {
          testFixture = fixture;
          testFixture.mission.mission_type.id = util.OPEN_TYPE_ID;
          testFixture.mission.mission_model = 'util.EXTERNAL_PROVIDER';
          testFixture.mission.name = getRandomName();
          return cy.APIMissionExternalCreate(testFixture.mission);
        })
        .then((mission) => {
          createdMission = mission.body;
          missionToDelete = createdMission.id;
          testFixture.enrollment.missionUUID = mission.body.id;
          cy.APIMissionEnrollUser(testFixture.enrollment).then((response) => {
            testFixture.enrollment.id = response.body.id;
          });
        });
    });
    it('Should be enrollment "refused"', () => {
      testFixture.enrollment.approve.approved = false;
      testFixture.enrollment.performance = null;
      testFixture.enrollment.approve.reject_comment = 'refused certificate';
      cy.APIExternalMissionSendCertificate(testFixture.enrollment);
      cy.APIExternalMissionEvaluateCertificate(testFixture.enrollment);

      cy.Login('user');
      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      EnrollsMissionsElements.enrollmentStatusMobile().contains(util.REFUSED).should('be.visible');
      EnrollsMissionsElements.iconExternalMissionMobile().click({ force: true });
      EnrollsMissionsElements.contentDialogMissionMobile().contains(util.EXTERNAL_PROVIDER);
    });

    it('Should be enrollment "waiting approval"', () => {
      cy.APIExternalMissionSendCertificate(testFixture.enrollment);

      cy.Login('user');
      cy.EnrollmentsAccessMobile();
      cy.EnrollmentsSearchMission(createdMission.name);

      EnrollsMissionsElements.enrollmentStatusMobile().contains(util.WAITING_APPROVAL).should('be.visible');
      EnrollsMissionsElements.iconExternalMissionMobile().click({ force: true });
      EnrollsMissionsElements.contentDialogMissionMobile().contains(util.EXTERNAL_PROVIDER);
    });
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
    }
  });
});
