/// <reference types="cypress" />

import * as util from '../../support/constants/utils';
import { getRandomName } from '../../support/commands';
import * as StatusCode from '../../support/constants/status-code';
import GroupElements from '../../support/elements/group-elements';
import SharedCreationElements from '../../support/elements/shared-creation-elements';
import { MissionStageContentOptions } from '../../support/interfaces';
let groupToDelete;
let missionToDelete;

describe('Groups user admin actions', () => {
  beforeEach(() => {
    cy.Login('admin');
  });

  it('Should add channel to group', () => {
    const groupName = getRandomName();

    cy.FixturesChannel()
      .then((channelDefault) => {
        channelDefault.name = getRandomName();
        cy.APIChannelCreate(channelDefault);
      })
      .then((channelCreated) => {
        const channel = channelCreated.body;
        cy.GroupCreate(groupName).then((groupCreated) => {
          groupToDelete = groupCreated.response.body.id;
        });
        cy.GroupOpen(groupName);
        cy.GroupChannelLink(groupName, channelCreated.body.name);
        cy.GroupsListAccess();
        cy.GroupsListSearch(groupName);
        GroupElements.columnChannels().should('contain.text', '1');
      });
  });

  it('Should add a mission to group', () => {
    const groupName = getRandomName();
    cy.FixturesMissionStageContent()
      .then((response: MissionStageContentOptions) => {
        response.mission.mission_type.id = util.OPEN_TYPE_ID;
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((mission) => {
        missionToDelete = mission.id;
        cy.GroupCreate(groupName).then((groupCreated) => {
          groupToDelete = groupCreated.response.body.id;
          cy.GroupOpen(groupName);
          cy.GroupMissionLink(groupName, mission.name);
          cy.GroupsListAccess();
          cy.GroupsListSearch(groupName);
          GroupElements.columnMissions().should('contain.text', '1');
        });
      });
  });

  it('Should add a user to group', () => {
    const groupName = getRandomName();

    cy.GroupCreate(groupName).then((groupCreated) => {
      groupToDelete = groupCreated.response.body.id;

      cy.GroupOpen(groupName);
      cy.GroupUserLink(groupName, Cypress.env('user_cy'), false);
      cy.GroupsListAccess();
      cy.GroupsListSearch(groupName);
      cy.GroupVerifyQuantityUsers(1);
    });
  });

  afterEach(() => {
    if (groupToDelete) {
      cy.APIGroupDelete(groupToDelete);
    }
    if (missionToDelete) {
      cy.APICourseDelete(missionToDelete);
    }
    missionToDelete = null;
  });
});

describe('Create groups with invalid name', () => {
  beforeEach(() => {
    cy.Login('admin');
  });

  it('Should get a erro when try to create a group without name', () => {
    cy.fixture(util.FIXTURE_PATH_GROUP_DEFAULT).then((defaultGroup) => {
      defaultGroup.name = '';
      SharedCreationElements.sharedCreateButton().click();
      GroupElements.createGroupButton().click();
      GroupElements.inputGroupName().clear().type('{enter}');
      GroupElements.erroMessageForm().should('have.text', defaultGroup.errorsMessages.requiredField);
    });
  });

  it('Should get a erro when try to create a group with a existent name', () => {
    const groupName = getRandomName();

    cy.APIGroupCreate(groupName)
      .then((response) => {
        expect(response.status).eq(StatusCode.Created);
        return response.body.id;
      })
      .then((groupId) => {
        cy.GroupCreate(groupName, StatusCode.BadRequest);
        cy.APIGroupDelete(groupId);
      });
  });
});
