/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import TransferManagementElements from '../../support/elements/transfer-management-elements';
import { InternalMissionOptions } from '../../support/interfaces';
import * as util from '../../support/constants/utils';
import ContentManagementElements from '../../support/elements/content-management-elements';
import GlobalSearchElements from '../../support/elements/global-search-elements';
let createdMission: InternalMissionOptions;
let missionToDelete;

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

it('Admin should be duplicate a internal mission', () => {
  cy.ContentManagementAccess();
  cy.ContentManagementSearch(createdMission.name);
  ContentManagementElements.buttonOpenCourseMenu().click();
  cy.MissionDuplicateSameWorkspace(Cypress.env('admin_cy'), createdMission.name);

  cy.GlobalSearch(createdMission.name);
  GlobalSearchElements.listItems().should('have.length', 2);
  GlobalSearchElements.listItems().first().contains(createdMission.name);
  GlobalSearchElements.listItems().last().contains(createdMission.name);
  cy.HomeAccess();

  cy.TransferManagementAccess();
  cy.TransferManagementSearchMission(createdMission.name);
  TransferManagementElements.listFieldsTransfer().contains(createdMission.name);
  TransferManagementElements.listFieldsTransfer().contains('Duplicada');
});

it('Should duplicate internal mission to another workspace', () => {
  cy.ContentManagementAccess();
  cy.ContentManagementSearch(createdMission.name);
  ContentManagementElements.buttonOpenCourseMenu().click();
  cy.MissionDuplicateAnotherWorkspace(Cypress.env('admin_cy2'), createdMission.name, 'Workspace Cy 2');

  cy.Login('admin2');
  cy.HomeAccess({ workspace: util.WORKSPACE_CY_2 });
  cy.GlobalSearch(createdMission.name);
  GlobalSearchElements.listItems().should('have.length', 1);
  GlobalSearchElements.listItems().contains(createdMission.name);
  cy.HomeAccess({ workspace: util.WORKSPACE_CY_2 });

  cy.TransferManagementAccess();
  cy.TransferManagementSearchMission(createdMission.name);
  TransferManagementElements.listFieldsTransfer().contains(createdMission.name);
  TransferManagementElements.listFieldsTransfer().contains('Duplicada');
});

afterEach(() => {
  cy.Login('admin');
  cy.APICourseDelete(missionToDelete);
});
