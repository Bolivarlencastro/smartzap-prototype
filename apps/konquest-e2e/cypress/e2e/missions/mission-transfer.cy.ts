/// <reference types="cypress" />
import * as StatusCode from '../../support/constants/status-code';
import { getRandomName } from '../../support/commands';
import MissionElements from '../../support/elements/mission-elements';
import TransferManagementElements from '../../support/elements/transfer-management-elements';
import * as util from '../../support/constants/utils';
let missionToDelete;
let createdMission;
let missionTransferOptions;

describe('Tests to transfer missions', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMission()
      .then((missionDefault) => ({ ...missionDefault, name: getRandomName() }))
      .then((mission) => cy.APIMissionCreate(mission))
      .then((response) => {
        createdMission = response.body;
        missionToDelete = response.body.id;
      });
    cy.fixture(util.FIXTURE_PATH_MISSION_TRANSFER).then((missionTransferFixtures) => {
      missionTransferOptions = missionTransferFixtures;
    });
  });

  it('Should transfer internal mission to another owner in the same workspace', () => {
    cy.SearchInMissionCreatedByMe(createdMission.name);
    cy.MissionOpenCard(createdMission.name);
    cy.MissionMenuSelectOptionTransfer();
    cy.MissionSelectOptionToTransfer(missionTransferOptions.other_user);
    cy.MissionOrTrailSelectUserToTransfer(Cypress.env('admin_cy2'));
    cy.intercept('**/missions/**/transfer').as('transferRequest');
    cy.MissionConfirmTransfer()
      .wait('@transferRequest')
      .should((response) => {
        expect(response.response.statusCode).eq(StatusCode.NoContent);
      });

    cy.Login('admin2');
    cy.HomeAccess({ filter: util.COURSES });
    cy.SearchInMissionCreatedByMe(createdMission.name);
    MissionElements.Card(createdMission.name).should('have.length', 1);
    cy.TransferManagementAccess();
    cy.TransferManagementSearchMission(createdMission.name);
    TransferManagementElements.listFieldsTransfer().contains(createdMission.name);
    TransferManagementElements.listFieldsTransfer().contains('Transferida');
  });

  it('Should transfer internal mission to another workspace', () => {
    cy.SearchInMissionCreatedByMe(createdMission.name);
    cy.MissionOpenCard(createdMission.name);
    cy.MissionMenuSelectOptionTransfer();
    cy.MissionSelectOptionToTransfer(missionTransferOptions.other_workspace);
    cy.MissionSelectWorkspaceToTransfer('Workspace Cy 2');
    cy.MissionOrTrailSelectUserToTransfer(Cypress.env('admin_cy2'));
    cy.intercept('**/missions/**/transfer').as('transferRequest');
    cy.MissionConfirmTransfer()
      .wait('@transferRequest')
      .should((response) => {
        expect(response.response.statusCode).eq(StatusCode.NoContent);
      });

    cy.Login('admin2');
    cy.MissionAccess(util.WORKSPACE_CY_2);
    cy.SearchInMissionCreatedByMe(createdMission.name);
    MissionElements.Card(createdMission.name).should('have.length', 1);
    cy.TransferManagementAccess();
    cy.TransferManagementSearchMission(createdMission.name);
    TransferManagementElements.listFieldsTransfer().contains(createdMission.name);
    TransferManagementElements.listFieldsTransfer().contains('Transferida');
  });

  it('Should not see a mission on the original workspace when it is transferred to another workspace', () => {
    cy.FixturesEnrollment().then((enrollmentDefault) => {
      enrollmentDefault.missionUUID = createdMission.id;
      cy.APIMissionBatchEnrollments(enrollmentDefault);
    });

    cy.SearchInMissionCreatedByMe(createdMission.name);
    cy.MissionOpenCard(createdMission.name);
    cy.MissionMenuSelectOptionTransfer();
    cy.MissionSelectOptionToTransfer(missionTransferOptions.other_workspace);
    cy.MissionSelectWorkspaceToTransfer('Workspace Cy 2');
    cy.MissionOrTrailSelectUserToTransfer(Cypress.env('admin_cy2'));
    cy.intercept('**/missions/**/transfer').as('transferRequest');
    cy.MissionConfirmTransfer()
      .wait('@transferRequest')
      .should((response) => {
        expect(response.response.statusCode).eq(StatusCode.NoContent);
      });
    MissionElements.closePopupMission().scrollIntoView().should('be.visible').click();

    cy.TransferManagementAccess();
    cy.TransferManagementSearchMission(createdMission.name);
    TransferManagementElements.listFieldsTransfer().contains(createdMission.name);
    TransferManagementElements.listFieldsTransfer().contains('Transferida');

    cy.Login('user');
    cy.HomeAccess({ filter: util.COURSES });
    cy.MissionSearch(createdMission.name);
    MissionElements.missionPageSelector().contains(util.NOT_EXIST_MISSIONS);

    cy.EnrollmentsAccess();
    cy.EnrollmentsSearchMission(createdMission.name);
    cy.EnrollmentsVerifyStatus(util.INACTIVE);
  });

  afterEach(() => {
    cy.Login('admin2');
    if (missionToDelete) {
      cy.APICourseDelete(missionToDelete);
    }
  });
});
