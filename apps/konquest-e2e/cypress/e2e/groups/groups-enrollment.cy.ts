/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import * as StatusCode from '../../support/constants/status-code';
import * as util from '../../support/constants/utils';
import { CypressResponse } from '../../support/interfaces/cypress-response';
import { MissionStageContentOptions } from '../../support/interfaces/mission-options';
import GroupElements from '../../support/elements/group-elements';

const groupOnSheet = {
  name: 'groupcy',
  id: '',
};
let quantity;
let listCreatedMissions;
let createdMission;
let createdTrail;
let createdGroup;

describe('Enroll user by spreadsheet', () => {
  beforeEach(() => {
    cy.Login('admin');

    cy.APIGroupCreate(groupOnSheet.name).then((response) => {
      groupOnSheet.id = response.body.id;
    });
  });

  it('Enroll users via spreadsheet in multiple missions linked to the group', () => {
    cy.FixturesMissionStageContent().then((fixtures) => {
      cy.MissionCreateMultipleWithContent(2, fixtures.content.video).then((missions) => {
        listCreatedMissions = missions;

        quantity = listCreatedMissions.length;
        const data = {
          missions: listCreatedMissions.map((mission) => mission.id),
          enrollment_goal_date: null,
        };

        cy.APIGroupLinkMission(groupOnSheet.id, data);
        cy.GroupsListAccess();
        cy.GroupsListSearch(groupOnSheet.name);
        cy.GroupVerifyQuantityMissions(quantity);
        cy.GroupImportUsersBySheet(util.FILE_PATH_SHEET_IMPORT_USERS_GROUPS, true);

        cy.Login('user');
        listCreatedMissions.forEach((mission) => {
          cy.EnrollmentsAccess();
          cy.EnrollmentsSearchMission(mission.name);
          EnrollsMissionsElements.missionEnrollmentRequired().should('contain', util.REQUIRED);
        });
      });
    });
  });

  it(`Enroll users via spreadsheet in a group’s trail and its contents`, () => {
    cy.APITrailCreateWithInternalMission().then((response) => {
      createdTrail = response[0];
      createdMission = response[1];

      cy.GroupOpen(groupOnSheet.name);
      cy.GroupTrailLink(groupOnSheet.name, createdTrail.name);

      cy.GroupsListAccess();
      cy.GroupsListSearch(groupOnSheet.name);
      cy.GroupVerifyQuantityTrails(1);
      cy.GroupImportUsersBySheet(util.FILE_PATH_SHEET_IMPORT_USERS_GROUPS, true);

      cy.Login('user');
      cy.EnrollmentsAccess();
      cy.EnrollmentsSearchMission(createdMission.name);
      EnrollsMissionsElements.missionEnrollmentRequired().should('contain', util.REQUIRED);

      cy.EnrollmentsAccessTrail();
      cy.EnrollmentsSearchTrail(createdTrail.name);
      cy.EnrollmentsVerifyTrail(createdTrail.name);
      EnrollsMissionsElements.missionEnrollmentRequired().should('contain', util.REQUIRED);
    });
  });
});

describe('Enroll user by manually', () => {
  beforeEach(() => {
    listCreatedMissions = undefined; //clean remaining ids
    createdTrail = undefined; //clean remaining id
    createdMission = undefined; //clean remaining id

    cy.Login('admin');
    cy.APIGroupCreate(getRandomName()).then((response) => {
      createdGroup = response.body;
    });
  });
  it('Enroll users manually in multiple missions linked to the group', () => {
    cy.FixturesMissionStageContent().then((fixtures) => {
      cy.MissionCreateMultipleWithContent(2, fixtures.content.video).then((missions) => {
        listCreatedMissions = missions;

        quantity = listCreatedMissions.length;
        const data = {
          missions: listCreatedMissions.map((mission) => mission.id),
          enrollment_goal_date: null,
        };

        cy.APIGroupLinkMission(createdGroup.id, data);
        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        cy.GroupVerifyQuantityMissions(quantity);

        cy.GroupOpenAction(createdGroup.name);
        cy.GroupUserLink(createdGroup.name, Cypress.env('user_cy'), 'free');
        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        cy.GroupVerifyQuantityUsers(1);

        cy.Login('user');
        cy.VerifyUserEnrollmentDetails('mission', listCreatedMissions[0].name, util.ENROLLED, util.HYPHEN);
      });
    });
  });
});

describe('Group Scenarios', () => {
  beforeEach(() => {
    listCreatedMissions = undefined; //clean remaining ids
    createdMission = undefined; //clean remaining id
    createdTrail = undefined; //clean remaining id
    cy.fixture(util.FIXTURE_PATH_GROUP_DEFAULT).then((defaultGroup) => {
      defaultGroup.name = getRandomName();
      cy.Login('admin');
      cy.APIGroupCreate(defaultGroup.name).then((response: CypressResponse) => {
        expect(response.status).eq(StatusCode.Created);
        createdGroup = response.body;
      });
    });
  });

  it('Should enroll user in a group with a trail to be subscribe in mission inside the trail - scenario 1', () => {
    cy.FixturesMission()
      .then((missionDefault) => {
        missionDefault.name = getRandomName();
        cy.APIMissionCreate(missionDefault).then((response) => {
          createdMission = response.body;
        });
      })
      .then(() => {
        cy.FixturesTrail().then((trailDefault) => {
          trailDefault.name = getRandomName();
          trailDefault.contentInTrail = createdMission.name;
          cy.TrailCreate(trailDefault).then((response) => {
            createdTrail = response;
          });
        });
      })
      .then(() => {
        cy.GroupsListAccess();
        cy.GroupUserLink(createdGroup.name, Cypress.env('user_cy'));
        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        cy.GroupVerifyQuantityUsers(1);
      })
      .then(() => {
        cy.GroupTrailLink(createdGroup.name, createdTrail.name, 'free');
        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        cy.GroupVerifyQuantityTrails(1);
      })
      .then(() => {
        cy.Login('user');
        cy.EnrollmentsAccess();
        cy.EnrollmentsSearchMission(createdMission.name);
        cy.EnrollmentsVerifyMission(createdMission.name);
        EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
        cy.EnrollmentsAccessTrail();
        cy.EnrollmentsSearchTrail(createdTrail.name);
        cy.EnrollmentsVerifyTrail(createdTrail.name);
        EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
      });
  });

  it('Should enroll user in a group with a trail to be subscribe in mission inside the trail - scenario 2', () => {
    cy.FixturesMission()
      .then((missionDefault) => {
        missionDefault.name = getRandomName();
        cy.APIMissionCreate(missionDefault).then((response) => {
          createdMission = response.body;
        });
      })
      .then(() => {
        cy.FixturesTrail().then((trailDefault) => {
          trailDefault.name = getRandomName();
          trailDefault.contentInTrail = createdMission.name;
          cy.TrailCreate(trailDefault).then((response) => {
            createdTrail = response;
          });
        });
      })
      .then(() => {
        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        cy.GroupTrailLink(createdGroup.name, createdTrail.name);
        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        cy.GroupVerifyQuantityTrails(1);
      })
      .then(() => {
        cy.GroupUserLink(createdGroup.name, Cypress.env('user_cy'), 'free');
        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        cy.GroupVerifyQuantityUsers(1);
      })
      .then(() => {
        cy.Login('user');
        cy.EnrollmentsAccessTrail();
        cy.EnrollmentsSearchTrail(createdTrail.name);
        cy.EnrollmentsVerifyTrail(createdTrail.name);
        EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
        cy.EnrollmentsAccess();
        cy.EnrollmentsSearchMission(createdMission.name);
        cy.EnrollmentsVerifyMission(createdMission.name);
        EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
      });
  });

  it('Should enroll user in a group to be subscribe in a mission - scenario 2', () => {
    cy.FixturesMissionStageContent()
      .then((response: MissionStageContentOptions) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        return cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((mission) => {
        createdMission = mission;

        cy.GroupsListAccess();
        cy.GroupUserLink(createdGroup.name, Cypress.env('user_cy'));
        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        cy.GroupVerifyQuantityUsers(1);

        cy.GroupMissionLink(createdGroup.name, mission.name, 'free');

        cy.GroupsListAccess();
        cy.GroupsListSearch(createdGroup.name);
        GroupElements.columnMissions().should('contain.text', '1');

        cy.Login('user');
        cy.EnrollmentsAccess();
        cy.EnrollmentsSearchMission(mission.name);
        cy.EnrollmentsVerifyMission(mission.name);
        EnrollsMissionsElements.missionEnrollmentRequired().contains(util.HYPHEN);
      });
  });
});

afterEach(() => {
  cy.Login('admin');
  if (listCreatedMissions) {
    listCreatedMissions.forEach((mission) => {
      cy.APICourseDelete(mission.id);
    });
    listCreatedMissions = undefined;
  }
  if (createdGroup) {
    cy.APIGroupDelete(createdGroup.id);
  }
  if (groupOnSheet.id) {
    cy.APIGroupDelete(groupOnSheet.id);
    groupOnSheet.id = undefined;
  }

  if (createdTrail) {
    cy.APITrailDelete(createdTrail.id);
  }
  if (createdMission) {
    cy.APICourseDelete(createdMission.id);
  }
});
