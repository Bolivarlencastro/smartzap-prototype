import GroupElements from '../elements/group-elements';
import * as StatusCode from '../constants/status-code';
import { Interception } from 'cypress/types/net-stubbing';
import { getDateTodayBR } from '../commands';
import SettingsElements from '../elements/settings-elements';
import SharedCreationElements from '../elements/shared-creation-elements';

Cypress.Commands.add('GroupsListAccess', () => {
  cy.intercept('**/konquest/groups**').as('loadGroups');
  SettingsElements.buttonAdmin().click();
  GroupElements.buttonNavGroups().click();
  return cy.wait('@loadGroups');
});

Cypress.Commands.add('GroupCreate', (groupName, statusCode = StatusCode['Created']) => {
  SharedCreationElements.sharedCreateButton().click();
  GroupElements.createGroupButton().click();
  GroupElements.inputGroupName()
    .clear()
    .type(groupName)
    .blur()
    .then(() => {
      return cy.GroupSaveNew(statusCode);
    });
});

Cypress.Commands.add('GroupSaveNew', (statusCode) => {
  if (statusCode) {
    cy.intercept('POST', '/konquest/groups').as('saveGroup');
    GroupElements.okButtonNewGroup()
      .should('be.visible')
      .click()
      .then(() => {
        cy.wait('@saveGroup').then((request) => {
          expect(request.response.statusCode).eq(statusCode);
        });
      });
  } else {
    return GroupElements.okButtonNewGroup().should('be.disabled');
  }
});

Cypress.Commands.add('GroupCancelNew', () => {
  return GroupElements.cancelButtonNewGroup().should('be.visible').click();
});

Cypress.Commands.add('GroupValidNameCreated', (name) => {
  return GroupElements.columnName(name).then(($column) => {
    const text = $column.text().replace(' ', '');
    expect(text).to.contains(name);
  });
});

Cypress.Commands.add('GroupAddChannel', () => {
  cy.intercept(`${Cypress.env('url_api')}/channels?*`).as('channelModal');
  return GroupElements.floatButton()
    .click()
    .wait('@channelModal')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});

Cypress.Commands.add('GroupAddMission', () => {
  cy.intercept(`${Cypress.env('url_api')}/missions?**search**`).as('missionsModal');
  return GroupElements.floatButton()
    .click()
    .wait('@missionsModal')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});

Cypress.Commands.add('GroupAddUser', () => {
  cy.intercept(`**/users**`).as('usersModal');
  return GroupElements.floatButton().click().wait('@usersModal').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('GroupOpen', (name) => {
  cy.GroupsListAccess();
  cy.GroupsListSearch(name);
  return cy.GroupOpenAction(name);
});

Cypress.Commands.add('GroupOpenAction', (name) => {
  cy.intercept('GET', '**/groups/**').as('groupsOpen');
  GroupElements.actionOpen(name).should('be.visible').click();
  cy.wait('@groupsOpen');
  return GroupElements.groupsNavBarNavigate().first().should('be.visible');
});

Cypress.Commands.add('GroupChannelSearch', (channel) => {
  cy.intercept(`${Cypress.env('url_api')}/channels?**search**`).as('channelModalSearch');
  return GroupElements.modalInputSearch()
    .clear()
    .type(channel)
    .wait('@channelModalSearch')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});

Cypress.Commands.add('GroupTrailSearch', (trail) => {
  cy.intercept(`${Cypress.env('url_api')}/learning-trails?**search**`).as('trailModalSearch');
  return GroupElements.modalInputSearch()
    .clear()
    .type(`${trail}{enter}`, { delay: 300 })
    .wait('@trailModalSearch')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});

Cypress.Commands.add('GroupUsersSearch', (group) => {
  cy.intercept(`**/users?**search**`).as('usersModalSearch');
  return GroupElements.modalInputSearch()
    .clear()
    .type(`${group}{enter}`, { delay: 200 })
    .wait('@usersModalSearch')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});

Cypress.Commands.add('GroupMissionsSearch', (mission) => {
  cy.intercept(`${Cypress.env('url_api')}/missions?**search**`).as('missionsModalSearch');
  return GroupElements.modalInputSearch()
    .clear({ force: true })
    .type(mission, { delay: 100 })
    .wait('@missionsModalSearch')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});
Cypress.Commands.add('GroupModalSelect', () => {
  return GroupElements.modalRowCheckbox().click({ force: true });
});

Cypress.Commands.add('GroupChannelSelect', () => {
  return cy.GroupModalSelect();
});

Cypress.Commands.add('GroupTrailSelect', () => {
  return cy.GroupModalSelect();
});

Cypress.Commands.add('GroupUsersSelect', () => {
  return cy.GroupModalSelect();
});

Cypress.Commands.add('GroupMissionsSelect', () => {
  return cy.GroupModalSelect();
});

Cypress.Commands.add('GroupVerifyQuantityChannels', (num) => {
  return GroupElements.columnChannels().should('contains.text', `${num}`);
});

Cypress.Commands.add('GroupVerifyQuantityTrails', (num) => {
  return GroupElements.columnTrails().should('contains.text', `${num}`);
});

Cypress.Commands.add('GroupVerifyQuantityMissions', (groupName, num) => {
  return GroupElements.columnMissions().should('contain.text', `${num}`);
});

Cypress.Commands.add('GroupVerifyQuantityUsers', (num) => {
  return GroupElements.columnUsers().should('contains.text', `${num}`);
});

Cypress.Commands.add('GroupChannelLink', (group, channel) => {
  cy.intercept('**/groups/**/channels').as('linkChannel');
  cy.GroupSelectChannelTab();
  cy.GroupAddChannel();
  cy.GroupChannelSearch(channel);
  GroupElements.modalFirstRow();
  cy.GroupChannelSelect();
  GroupElements.confirmLinkToGroup().click();
  cy.wait('@linkChannel');
});

Cypress.Commands.add('GroupTrailLink', (group, trail, enroll) => {
  cy.intercept('**/groups/**/learning-trails').as('linkTrail');
  cy.GroupSelectTrailTab();
  GroupElements.floatButton().click();
  cy.GroupTrailSearch(trail);
  GroupElements.modalFirstRow();
  cy.GroupTrailSelect();
  if (enroll) {
    cy.BatchEnrollmentSetting(enroll);
  }
  GroupElements.confirmLinkToGroup().click();
  return cy.wait('@linkTrail');
});

Cypress.Commands.add('GroupUserLink', (group, user, enroll) => {
  cy.intercept('**/groups/**/users').as('linkUser');
  cy.GroupSelectUserTab();
  cy.GroupAddUser();
  cy.GroupUsersSearch(user);

  GroupElements.modalFirstRow();
  cy.GroupUsersSelect();

  if (enroll) {
    cy.BatchEnrollmentSetting(enroll);
  }
  GroupElements.confirmLinkToGroup().click();
  return cy.wait('@linkUser');
});

Cypress.Commands.add('GroupMissionLink', (group, mission, enroll) => {
  cy.intercept('POST', '**/groups/**/missions').as('linkMission');
  cy.GroupSelectMissionsTab();
  cy.GroupAddMission();
  cy.GroupMissionsSearch(mission);

  GroupElements.modalFirstRow();
  cy.GroupModalSelect();

  if (enroll) {
    cy.BatchEnrollmentSetting(enroll);
  }
  GroupElements.confirmLinkToGroup().click();
  return cy.wait('@linkMission');
});

Cypress.Commands.add('GroupSelectUserTab', () => {
  cy.intercept('GET', '**/users**').as('groupsListUsers');
  GroupElements.openChannelsTabs('Usuários vinculados').click({ force: true });
  return cy.get('body').then(($body) => {
    if ($body.find('cdk-table').length > 0) return;
    return cy.wait('@groupsListUsers', { timeout: 15000 });
  });
});
Cypress.Commands.add('GroupOpen', (name) => {
  cy.GroupsListAccess();
  cy.GroupsListSearch(name);
  return cy.GroupOpenAction(name);
});

Cypress.Commands.add('GroupSelectChannelTab', () => {
  cy.intercept('GET', '**/channels?**').as('groupsListChannels');
  GroupElements.openChannelsTabs('Canais vinculados').should('be.visible').click({ force: true });
  return cy.wait('@groupsListChannels').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('GroupSelectTrailTab', () => {
  cy.intercept('**/learning-trails?**').as('groupsListTrails');
  GroupElements.openChannelsTabs('Trilhas vinculadas').click({ force: true });
  cy.wait('@groupsListTrails');
  return GroupElements.groupsTabVisible();
});

Cypress.Commands.add('GroupSelectMissionsTab', () => {
  cy.intercept('GET', '**/missions?**').as('groupsListMissions');
  GroupElements.openChannelsTabs('Cursos vinculados').should('be.visible').click({ force: true });
  return cy.wait('@groupsListMissions').its('response.statusCode').should('eq', StatusCode.OK);
});

Cypress.Commands.add('GroupsListSearch', (name) => {
  cy.intercept('**/groups**search**').as('searchGroup');
  GroupElements.inputSearch().clear().type(`${name}{enter}`);
  return cy.wait('@searchGroup');
});

Cypress.Commands.add('GroupImportUsersBySheet', (file, enrollment = false) => {
  cy.GroupImportUsers();
  cy.GroupUploadSheet(file);
  if (enrollment == true) {
    GroupElements.checkErollmentGroupBySheet().click();
    GroupElements.goalDateEnrollmentGroupBySheet().click({ force: true }).type(getDateTodayBR());
  }
  cy.GroupConfirmImport();
  cy.contains('Fechar').click();
});

Cypress.Commands.add('GroupImportScrollDown', () => {
  let scrolls = 0;
  for (scrolls; scrolls <= 14; scrolls++) {
    GroupElements.importUsers().should('not.be.visible');
    cy.log('notvisible', scrolls);
    GroupElements.groupScroll().click('bottom', { force: true });
    cy.log('visible');
  }
});

Cypress.Commands.add('GroupImportUsers', () => {
  return GroupElements.importUsers().should('be.visible').click();
});

Cypress.Commands.add('GroupImportMissions', () => {
  return GroupElements.importMissions().click();
});

Cypress.Commands.add('GroupImportChannels', (file) => {
  cy.intercept('/konquest/groups/channels/import').as('importChannels');
  return GroupElements.buttonImportChannels()
    .click()
    .then(() => {
      GroupElements.importChannels()
        .selectFile(file, { force: true })
        .wait('@importChannels')
        .then((response) => {
          expect(response.response.statusCode).equal(StatusCode.OK);
          const channelCreated = response.response.body;
          cy.wrap(channelCreated);
        });
    });
});

Cypress.Commands.add('GroupUploadSheet', (file) => {
  return GroupElements.uploadSheet().selectFile(file, { force: true });
});

Cypress.Commands.add('GroupConfirmImport', () => {
  cy.intercept('/konquest/groups*').as('waitLoadgroups');
  cy.intercept('/konquest/groups/users/import').as('waitImportusers');
  return GroupElements.confirmUploadImport()
    .contains('Importar')
    .click()
    .wait('@waitLoadgroups')
    .wait('@waitImportusers')
    .then((request) => {
      expect(request.response.statusCode).eq(StatusCode.OK);
    });
});

Cypress.Commands.add('GroupConfirmImportMissions', () => {
  cy.intercept('/konquest/groups/missions/import').as('waitImportMissions');
  return GroupElements.confirmUploadImport()
    .contains('Importar')
    .click()
    .wait('@waitImportMissions')
    .then((request) => {
      expect(request.response.statusCode).eq(StatusCode.OK);
    });
});

Cypress.Commands.add('GroupDeleteName', () => {
  GroupElements.optionMenuGroup().click();
  GroupElements.buttonDeleteGroup().click();
  GroupElements.buttonConfirmDeleteGroup().click();
});

Cypress.Commands.add('GroupImportMissionsBySheet', (file, enroll) => {
  cy.GroupsListAccess()
    .GroupsListSearch('nothing')
    .GroupImportMissions()
    .GroupUploadSheet(file)
    .then(() => {
      if (enroll) {
        const today = getDateTodayBR();
        GroupElements.checkboxEnrollmentGroupBySheet().check();
        GroupElements.goalDateEnrollmentGroupBySheet().type(today);
      }
    })
    .GroupConfirmImportMissions();
});

Cypress.Commands.add('GroupImportChannelsBySheet', (file) => {
  cy.GroupsListAccess().GroupsListSearch('nothing').GroupImportChannels(file);
});

declare global {
  namespace Cypress {
    interface Chainable {
      GroupsListAccess(): Chainable<Interception>;
      GroupCreate(groupName: string, statusCode?): Chainable<Interception>;
      GroupSaveNew(statusCode): Chainable<JQuery<HTMLElement>>;
      GroupCancelNew(): Chainable<JQuery<HTMLElement>>;
      GroupValidNameCreated(name: string): Chainable<JQuery<HTMLElement>>;
      GroupAddChannel(): Chainable<JQuery<HTMLElement>>;
      GroupAddMission(): Chainable<JQuery<HTMLElement>>;
      GroupAddUser(): Chainable<JQuery<HTMLElement>>;
      GroupOpen(name: string): Chainable<JQuery<HTMLElement>>;
      GroupOpenAction(name: string): Chainable<JQuery<HTMLElement>>;
      GroupChannelSearch(channel: string): Chainable<JQuery<HTMLElement>>;
      GroupTrailSearch(trail: string): Chainable<JQuery<HTMLElement>>;
      GroupUsersSearch(group: string): Chainable<JQuery<HTMLElement>>;
      GroupMissionsSearch(mission: string): Chainable<JQuery<HTMLElement>>;
      GroupChannelSelect(): Chainable<JQuery<HTMLElement>>;
      GroupTrailSelect(): Chainable<JQuery<HTMLElement>>;
      GroupUsersSelect(): Chainable<JQuery<HTMLElement>>;
      GroupMissionsSelect(): Chainable<JQuery<HTMLElement>>;
      GroupModalSelect(): Chainable<JQuery<HTMLElement>>;
      GroupVerifyQuantityChannels(num: number): Chainable<JQuery<HTMLElement>>;
      GroupVerifyQuantityTrails(num: number): Chainable<JQuery<HTMLElement>>;
      GroupVerifyQuantityMissions(num: number): Chainable<JQuery<HTMLElement>>;
      GroupVerifyQuantityUsers(num: number): Chainable<JQuery<HTMLElement>>;
      GroupChannelLink(group, channel): Chainable<JQuery<HTMLElement>>;
      GroupTrailLink(group, trail, enroll?): Chainable<Interception>;
      GroupUserLink(group, user, enroll?): Chainable<Interception>;
      GroupMissionLink(group, mission, enroll?): Chainable<JQuery<HTMLElement>>;
      GroupSelectUserTab(): Chainable<JQuery<HTMLElement>>;
      GroupSelectChannelTab(): Chainable<JQuery<HTMLElement>>;
      GroupSelectTrailTab(): Chainable<JQuery<HTMLElement>>;
      GroupSelectMissionsTab(): Chainable<JQuery<HTMLElement>>;
      GroupsListSearch(name: string): Chainable<JQuery<HTMLElement>>;
      GroupImportScrollDown(): Chainable<JQuery<HTMLElement>>;
      GroupImportUsers(): Chainable<JQuery<HTMLElement>>;
      GroupImportMissions(): Chainable<JQuery<HTMLElement>>;
      GroupImportChannels(file): Chainable<JQuery<HTMLElement>>;
      GroupUploadSheet(file): Chainable<JQuery<HTMLElement>>;
      GroupConfirmImport(): Chainable<Interception>;
      GroupConfirmImportMissions(): Chainable<Interception>;
      GroupDeleteName(): Chainable<JQuery<HTMLElement>>;
      GroupImportUsersBySheet(file, enrollment?: boolean): Chainable<JQuery<HTMLElement>>;
      GroupImportMissionsBySheet(file, enroll?): Chainable<JQuery<HTMLElement>>;
      GroupImportChannelsBySheet(file): Chainable<JQuery<HTMLElement>>;
    }
  }
}
