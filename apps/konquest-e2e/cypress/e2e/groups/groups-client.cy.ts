/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import * as StatusCode from '../../support/constants/status-code';
import { USER_CY_ID } from '../../support/constants/users';
import * as util from '../../support/constants/utils';
import ChannelElements from '../../support/elements/channel-elements';
import GroupElements from '../../support/elements/group-elements';
import MissionElements from '../../support/elements/mission-elements';
import { CypressResponse } from '../../support/interfaces';
let channelCreatedBefore;
let groupCreatedBefore;
let trailCreatedBefore;
let missionCreatedBefore;
let channelToDelete;
let groupToDelete;
let trailToDelete;
let missionToDelete;

describe('Action in group', () => {
  beforeEach(() => {
    channelToDelete = undefined;
    trailToDelete = undefined;
    missionToDelete = undefined;
    cy.fixture(util.FIXTURE_PATH_GROUP_DEFAULT).then((defaultGroup) => {
      defaultGroup.name = getRandomName();
      cy.Login('admin');
      cy.APIGroupCreate(defaultGroup.name).then((response: CypressResponse) => {
        expect(response.status).eq(StatusCode.Created);
        groupCreatedBefore = response.body;
        groupToDelete = response.body.id;
      });
    });
  });

  it('Should user access channel because have permission in group', () => {
    cy.FixturesChannel()
      .then((channelDefault) => {
        channelDefault.name = getRandomName();
        channelDefault.typeUUID = util.CLOSED_TYPE_ID;
        cy.APIChannelCreate(channelDefault).then((response) => {
          channelCreatedBefore = response.body;
          channelToDelete = response.body.id;
        });
      })
      .then(() => {
        cy.Login('user');
        cy.PulseAccess();
        cy.ChannelTabAccess();
        cy.SearchChannelOrPulse(channelCreatedBefore.name);
        ChannelElements.channelMessageBox().contains('Nenhum canal encontrado.').should('be.visible');
      })
      .then(() => {
        cy.Login('admin');
        cy.GroupsListAccess();
        cy.GroupChannelLink(groupCreatedBefore.name, channelCreatedBefore.name);
        cy.GroupsListAccess();
        cy.GroupsListSearch(groupCreatedBefore.name);
        cy.GroupVerifyQuantityChannels(1);
      })
      .then(() => {
        cy.GroupUserLink(groupCreatedBefore.name, Cypress.env('user_cy'));
        cy.GroupsListAccess();
        cy.GroupsListSearch(groupCreatedBefore.name);
        cy.GroupVerifyQuantityUsers(1);
      })
      .then(() => {
        cy.Login('user');
        cy.PulseAccess();
        cy.ChannelTabAccess();
        cy.SearchChannelOrPulse(channelCreatedBefore.name);
        ChannelElements.channelCard(channelCreatedBefore.name).click({ force: true });
      });
  });
  it('Should user access trail because have permission in group', () => {
    cy.FixturesTrail().then((trailDefault) => {
      trailDefault.name = getRandomName();
      trailDefault.trail_type = util.TRAIL_CLOSED_TYPE_UUID;
      cy.Login('admin');
      cy.APITrailCreate(trailDefault)
        .then((response: CypressResponse) => {
          trailCreatedBefore = response.body;
          trailToDelete = trailCreatedBefore.id;
        })
        .then(() => {
          cy.GroupsListAccess();
          cy.GroupTrailLink(groupCreatedBefore.name, trailCreatedBefore.name);
          cy.GroupsListAccess();
          cy.GroupsListSearch(groupCreatedBefore.name);
          cy.GroupVerifyQuantityTrails(1);
        })
        .then(() => {
          cy.Login('user');
          cy.TrailAccess();
          cy.TrailSearch(trailDefault.name);
          cy.TrailNotAvailable(util.TRAIL_NOT_AVAILABLE);
        })
        .then(() => {
          cy.Login('admin');
          cy.GroupsListAccess();
          GroupElements.tableItens();
          cy.GroupUserLink(groupCreatedBefore.name, Cypress.env('user_cy'));
          cy.GroupsListAccess();
          cy.GroupsListSearch(groupCreatedBefore.name);
          cy.GroupVerifyQuantityUsers(1);
        })
        .then(() => {
          cy.Login('user');
          cy.TrailAccess();
          cy.TrailSearch(trailDefault.name);
          cy.TrailOpenCard(trailDefault.name);
        });
    });
  });
  it('Should access mission with group permission', () => {
    cy.FixturesMission()
      .then((missionDefault) => {
        missionDefault.name = getRandomName();
        cy.APIMissionCreate(missionDefault).then((response) => {
          missionCreatedBefore = response.body;
          missionToDelete = missionCreatedBefore.id;
        });
      })
      .then(() => {
        cy.GroupsListAccess();
        cy.GroupMissionLink(groupCreatedBefore.name, missionCreatedBefore.name);
        cy.GroupsListAccess();
        cy.GroupsListSearch(groupCreatedBefore.name);
        cy.GroupVerifyQuantityMissions(1);
      })
      .then(() => {
        cy.Login('user');
        cy.MissionSearch(groupCreatedBefore.name);
        MissionElements.missionPageSelector().contains(util.NOT_EXIST_MISSIONS);
      })
      .then(() => {
        cy.Login('admin');
        cy.GroupsListAccess();
        GroupElements.tableItens();
        cy.GroupUserLink(groupCreatedBefore.name, Cypress.env('user_cy'));
        cy.GroupsListAccess();
        cy.GroupsListSearch(groupCreatedBefore.name);
        cy.GroupVerifyQuantityUsers(1);
      })
      .then(() => {
        cy.Login('user');
        cy.MissionSearch(missionCreatedBefore.name);
        cy.MissionOpenCard(missionCreatedBefore.name);
      })
      .then(() => {
        cy.Login('admin');
        cy.APIUserGroupDelete(groupCreatedBefore.id, USER_CY_ID);
      })
      .then(() => {
        cy.Login('user');
        cy.MissionSearch(groupCreatedBefore.name);
        MissionElements.missionPageSelector().contains(util.NOT_EXIST_MISSIONS);
      });
  });
});

afterEach(() => {
  cy.Login('admin');
  if (channelToDelete) {
    cy.APIChannelDelete(channelToDelete);
  }
  if (groupToDelete) {
    cy.APIGroupDelete(groupToDelete);
  }
  if (trailToDelete) {
    cy.APITrailDelete(trailToDelete);
  }
  if (missionToDelete) {
    cy.APICourseDelete(missionToDelete);
  }
});
