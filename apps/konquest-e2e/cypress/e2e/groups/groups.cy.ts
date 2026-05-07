/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import * as StatusCode from '../../support/constants/status-code';
import * as util from '../../support/constants/utils';
let missionToDelete = [];
let channelToDelete = [];
let groupToDelete;

describe('Create groups by sheet', () => {
  beforeEach(() => {
    cy.Login('admin');
  });

  it('Should create a group', () => {
    const groupName = getRandomName();
    cy.GroupCreate(groupName).then((group) => {
      groupToDelete = group.response.body.id;
    });
    cy.GroupsListAccess();
    cy.GroupsListSearch(groupName);
    cy.GroupValidNameCreated(groupName);
  });

  it('Should import users and create group by sheet', () => {
    cy.GroupsListAccess();
    cy.fixture(pathGroupDefault).then((defaultGroup) => {
      cy.GroupImportUsersBySheet(sheetImportUsers, true);
      cy.GroupsListSearch(defaultGroup.sheetGroup);
      cy.GroupValidNameCreated(defaultGroup.sheetGroup);
      cy.GroupVerifyQuantityUsers(2);
      cy.GroupDeleteName();
    });
  });

  it('Should import missions and create group by sheet ', () => {
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = 'missionDefaultCreatedCy';
      cy.APIMissionCreate(missionDefault).then((response) => {
        expect(response.status).eq(StatusCode.Created);
        missionToDelete.push(response.body.id);
      });
    });
    cy.FixturesMission().then((missionDefault) => {
      cy.fixture(util.FIXTURE_PATH_GROUP_DEFAULT).then((defaultGroup) => {
        missionDefault.name = 'missionDefaultCreatedCy2';
        cy.APIMissionCreate(missionDefault).then((response) => {
          expect(response.status).eq(StatusCode.Created);
          missionToDelete.push(response.body.id);
        });
        cy.GroupImportMissionsBySheet(util.FILE_PATH_SHEET_IMPORT_MISSIONS_GROUPS);
        cy.GroupsListSearch(defaultGroup.sheetGroup);
        cy.GroupVerifyQuantityMissions(defaultGroup.sheetGroup, 2);
        cy.GroupDeleteName();
      });
    });
  });

  it('Should import channels and create group by sheet', () => {
    cy.FixturesChannel().then((channelDefault) => {
      channelDefault.name = 'channelDefaultCreatedCy';
      channelDefault.typeUUID = util.CLOSED_TYPE_ID;
      cy.APIChannelCreate(channelDefault).then((response) => {
        expect(response.status).eq(StatusCode.Created);
        channelToDelete.push(response.body.id);
      });
    });
    cy.FixturesChannel()
      .then((channelDefault) => {
        channelDefault.name = 'channelDefaultCreatedCy2';
        channelDefault.typeUUID = util.CLOSED_TYPE_ID;
        cy.APIChannelCreate(channelDefault).then((response) => {
          expect(response.status).eq(StatusCode.Created);
          channelToDelete.push(response.body.id);
        });
      })
      .then(() => {
        cy.fixture(util.FIXTURE_PATH_GROUP_DEFAULT).then((defaultGroup) => {
          cy.GroupImportChannelsBySheet(util.FILE_PATH_SHEET_IMPORT_CHANNELS_GROUPS).then((response) => {
            cy.log(JSON.stringify(response));
          });
          cy.GroupsListSearch(defaultGroup.sheetGroup);
          cy.GroupVerifyQuantityChannels(2);
          cy.GroupDeleteName();
        });
      });
  });

  afterEach(() => {
    if (channelToDelete) {
      channelToDelete.forEach((channelUUID) => {
        cy.APIChannelDelete(channelUUID);
        channelToDelete = [];
      });
    }
    if (missionToDelete) {
      missionToDelete.forEach((missionUUID) => {
        cy.APICourseDelete(missionUUID);
        missionToDelete = [];
      });
    }
    if (groupToDelete) {
      cy.APIGroupDelete(groupToDelete);
      groupToDelete = null;
    }
  });
});
