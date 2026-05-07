/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import * as StatusCode from '../../support/constants/status-code';
import MissionElements from '../../support/elements/mission-elements';
import * as util from '../../support/constants/utils';
import TransferManagementElements from '../../support/elements/transfer-management-elements';
let missionToDelete;
let createdMission;

describe('Tests to share missions', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMission()
      .then((missionDefault) => ({ ...missionDefault, name: getRandomName() }))
      .then((mission) => cy.APIMissionCreate(mission))
      .then((response) => {
        createdMission = response.body;
        missionToDelete = response.body.id;
      });
  });

  it('Should share a internal mission with another workspace', () => {
    cy.SearchInMissionCreatedByMe(createdMission.name);
    cy.MissionOpenCard(createdMission.name);
    cy.MissionMenuSelectOptionShare('Workspace Cy 2');
    cy.intercept('**/share').as('shareRequest');
    cy.MissionConfirmTransfer()
      .wait('@shareRequest')
      .should((response) => {
        expect(response.response.statusCode).eq(StatusCode.NoContent);
      });

    cy.Login('admin2', 'Workspace Cy 2');
    cy.HomeAccess({ filter: util.COURSES });
    cy.MissionSearch(createdMission.name);
    MissionElements.Card(createdMission.name).should('have.length', 1);
    cy.TransferManagementAccess();
    cy.TransferManagementSearchMission(createdMission.name);
    TransferManagementElements.listFieldsTransfer().contains(createdMission.name);
    TransferManagementElements.listFieldsTransfer().contains('Compartilhada');
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
    }
  });
});
