import { Interception } from 'cypress/types/net-stubbing';
import ChannelElements from '../elements/channel-elements';
import { ChannelOptions } from '../interfaces/channel-options';
import * as util from '../constants/utils';
import { getRandomName } from '../commands';
import SharedCreationElements from '../elements/shared-creation-elements';

const channelDefaultPath = `${Cypress.env('ENVIRONMENT')}/channel/default`;

Cypress.Commands.add('ChannelTabAccess', () => {
  cy.intercept('**/search/v1/channels**').as('loadChannels');
  return ChannelElements.buttonChannelAccess().click().wait('@loadChannels');
});

Cypress.Commands.add('ChannelEdit', () => {
  return ChannelElements.editOption().click({ force: true }).wait(2000);
});

Cypress.Commands.add('ChannelAddContributor', (user) => {
  cy.intercept('**/channels/**/contributors**').as('channelContributor');
  cy.ChannelContributor();
  cy.ChannelContributorSelectSearchUser(user);
  return cy.wait('@channelContributor').its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add('ChannelContributor', () => {
  return ChannelElements.contributorOption().click({ force: true });
});

Cypress.Commands.add('ChannelContributorSelectSearchUser', (user) => {
  return ChannelElements.inputSearchUserContributor()
    .type('{selectall}{backspace}')
    .type(user)
    .then(() => {
      return cy.ChannelSelectUserInList(user);
    });
});

Cypress.Commands.add('ChannelSelectUserInList', (user) => {
  ChannelElements.ListUsersSearchContributorsChannel().contains(user).should('be.visible').click();
});

Cypress.Commands.add('ChannelCardSelect', (name) => {
  return ChannelElements.channelCard(name).click();
});

Cypress.Commands.add('ChannelVerifyContributorsQuantity', (qtd) => {
  return ChannelElements.contributorsLabelDetail().should('to.contain', qtd);
});

Cypress.Commands.add('ChannelVerifyUserContributorsPanel', (user) => {
  return ChannelElements.contributorsPanel().should('to.contain', user);
});

Cypress.Commands.add('ChannelNewPulse', () => {
  return ChannelElements.createPulseButton().should('be.visible').click({ force: true });
});

Cypress.Commands.add('ChannelNewPulseNotExist', () => {
  return ChannelElements.createPulseButton().should('not.exist');
});

Cypress.Commands.add('ChannelCardSubscribe', (name) => {
  cy.intercept('POST', '**/channels/subscriptions').as('subscription');
  ChannelElements.channelCard(name);
  return ChannelElements.singUpButtonChannelCard()
    .click()
    .wait('@subscription')
    .its('response.statusCode')
    .should('eq', 201);
});

Cypress.Commands.add('ChannelValidRequired', (message) => {
  return ChannelElements.requireMessage().contains(`${message}`).should('be.visible');
});

Cypress.Commands.add('ChannelValidNameRequired', (message) => {
  cy.focusBlur(ChannelElements.nameInput);
  return cy.ChannelValidRequired(message);
});

Cypress.Commands.add('ChannelValidCategorieRequired', (message) => {
  cy.focusBlur(ChannelElements.categorie);
  return cy.ChannelValidRequired(message);
});

Cypress.Commands.add('ChannelValidTypeRequired', (message) => {
  cy.focusBlur(ChannelElements.type);
  return cy.ChannelValidRequired(message);
});

Cypress.Commands.add('ChannelValidDescriptionRequired', (message) => {
  cy.focusBlur(ChannelElements.descriptionInput);
  return cy.ChannelValidRequired(message);
});

Cypress.Commands.add('ChannelValidName', (name) => {
  return ChannelElements.nameInput().should('have.value', name);
});

Cypress.Commands.add('ChannelTypeName', (name) => {
  return ChannelElements.nameInput().type('{selectall}{backspace}').type(`${name}`);
});

Cypress.Commands.add('ChannelValidCategorie', (categorie) => {
  return ChannelElements.categorie()
    .invoke('text')
    .then((text) => {
      expect(text.trim().replace('\n', '')).equal(categorie);
    });
});

Cypress.Commands.add('ChannelSelectCategorie', (categorie) => {
  cy.ChannelSelectOptionCategorie().then(() => {
    ChannelElements.listOptions().contains(categorie).should('be.visible').click();
  });
});

Cypress.Commands.add('ChannelSelectOptionCategorie', () => {
  return ChannelElements.categorie().focus().click();
});

Cypress.Commands.add('ChannelSelectOptionType', () => {
  return ChannelElements.type().focus().click();
});

Cypress.Commands.add('ChannelSelectOptionLanguage', () => {
  return ChannelElements.language().focus().click();
});

Cypress.Commands.add('ChannelValidType', (type) => {
  return ChannelElements.type()
    .invoke('text')
    .then((text) => {
      expect(text.trim().replace('\n', '')).equal(type);
    });
});

Cypress.Commands.add('ChannelSelectType', (type) => {
  cy.ChannelSelectOptionType().then(() => {
    ChannelElements.listOptions().contains(type).should('be.visible').click();
  });
});

Cypress.Commands.add('ChannelValidLanguage', (language) => {
  return ChannelElements.language()
    .invoke('text')
    .then((text) => {
      expect(text.trim().replace('\n', '')).equal(language);
    });
});

Cypress.Commands.add('ChannelSelectLanguage', (language) => {
  cy.ChannelSelectOptionLanguage().then(() => {
    ChannelElements.listOptions().contains(language).should('be.visible').click();
  });
});

Cypress.Commands.add('ChannelValidDescription', (description) => {
  return ChannelElements.descriptionInput().should('have.value', description);
});

Cypress.Commands.add('ChannelValidActive', (value) => {
  if (value) {
    ChannelElements.checkActive();
  } else {
    ChannelElements.checkButtonInactive();
  }
});

Cypress.Commands.add('ChannelTypeDescription', (description) => {
  return ChannelElements.descriptionInput().type('{selectall}{backspace}').type(`${description}`);
});

Cypress.Commands.add('ChannelCheckActive', (active) => {
  if (active == false) {
    ChannelElements.checkActive()
      .click({ force: true })
      .then(() => {
        ChannelElements.checkButtonInactive();
      });
  } else if (active == true) {
    ChannelElements.checkActive()
      .invoke('attr', 'aria-checked')
      .then((ariachecked) => {
        if (ariachecked == 'false') {
          ChannelElements.checkActive().click();
        }
      });
  }
});

Cypress.Commands.add('ChannelSave', (process) => {
  if (process == 'create') {
    cy.intercept('POST', 'channels').as('saveChannel');
  } else {
    cy.intercept('PUT', '*').as('editChannel');
  }

  ChannelElements.save().click();

  if (process == 'create') {
    cy.wait('@saveChannel').then((request) => {
      expect(request.response.statusCode).equal(201);
      cy.log('Channel Created');
      const createdChannel = request.response.body;
      return cy.wrap(createdChannel);
    });
  } else {
    cy.wait('@editChannel').then((request) => {
      expect(request.response.statusCode).equal(200);
      cy.log('Channel Edited');
      const createdChannel = request.response.body;
      return cy.wrap(createdChannel);
    });
  }
});

Cypress.Commands.add('ChannelOpenCreateForm', () => {
  cy.intercept('**/types').as('typesChannelRoutes');
  SharedCreationElements.sharedCreateButton().click();
  ChannelElements.createButton().click();
  return cy.wait('@typesChannelRoutes').then((typesChannelRoutes) => {
    expect(typesChannelRoutes.response.statusCode).equal(200);
  });
});

Cypress.Commands.add('ChannelFillCreateForm', (data) => {
  ChannelElements.channelForm().then(() => {
    if (data.name) cy.ChannelTypeName(data.name);
    if (data.categorie) cy.ChannelSelectCategorie(data.categorie);
    if (data.type) cy.ChannelSelectType(data.type);
    if (data.language) cy.ChannelSelectLanguage(data.language);
    if (data.description) cy.ChannelTypeDescription(data.description);
    if (data.active != null) cy.ChannelCheckActive(data.active);
  });
});

Cypress.Commands.add('ChannelOpenFillCreateForm', (data) => {
  return cy.ChannelOpenCreateForm().ChannelFillCreateForm(data);
});

Cypress.Commands.add('ChannelCreate', (channel = {}) => {
  cy.ChannelOpenCreateForm();
  cy.ChannelFillCreateForm(channel);

  return cy.ChannelSave('create');
});

Cypress.Commands.add('ChannelCreateMultiple', (quantity, recursive = { time: 0, listChannelsCreated: [] }) => {
  cy.fixture(channelDefaultPath).then((channelDefault) => {
    channelDefault.name = getRandomName();
    cy.APIChannelCreate(channelDefault).then((response) => {
      recursive.listChannelsCreated.push(response.body);
      recursive.time++;
    });
  });

  if (recursive.time < quantity - 1) {
    cy.ChannelCreateMultiple(quantity, recursive);
  } else {
    return cy.wrap(recursive.listChannelsCreated);
  }
});

Cypress.Commands.add('ChannelValid', (channelExpect) => {
  channelExpect = channelExpect ? channelExpect : {};
  return cy
    .ChannelValidName(channelExpect.name)
    .ChannelValidCategorie(channelExpect.categorie)
    .ChannelValidType(channelExpect.type)
    .ChannelValidLanguage(channelExpect.language)
    .ChannelValidDescription(channelExpect.description)
    .ChannelValidActive(channelExpect.active);
});

Cypress.Commands.add('ChannelValidCantSave', () => {
  return ChannelElements.save().should('not.be.enabled');
});

/*
 * This function need you be in edit page of a channel
 * You can use the "channel" parameter to pass a function
 * to go a channel edit page
 */
Cypress.Commands.add('ChannelDelete', () => {
  ChannelElements.deleteOption()
    .click()
    .then(() => {
      cy.intercept('DELETE', '**/konquest/channels/**').as('deleteChannel');
      cy.ChannelDialogConfirm(true)
        .wait('@deleteChannel')
        .then((intercept) => {
          expect(intercept.response.statusCode).equal(204);
        });
    });
});

Cypress.Commands.add('ChannelDialogConfirm', (ok = true) => {
  ChannelElements.dialogConfirm();
  if (ok) {
    ChannelElements.dialogConfirmOkButton().click();
  } else {
    ChannelElements.dialogConfirmCancelButton().click();
  }
});

Cypress.Commands.add('ChannelAccessOpen', (UUID, workspace = util.WORKSPACE_DEFAULT) => {
  cy.intercept(`**/channels/${UUID}`).as('loadPulsesInChannel');
  cy.intercept('**/channels/**/subscriptions').as('loadSubsInChannel');
  return cy.visit(`${workspace}/channels/details/${UUID}`).then(() => {
    cy.wait('@loadPulsesInChannel');
    cy.wait('@loadSubsInChannel');
    cy.get('.content').should('be.ok');
  });
});

Cypress.Commands.add('ChannelVerifyMessageBox', (message) => {
  return ChannelElements.channelMessageBox().contains(message).should('be.visible');
});

Cypress.Commands.add('ChannelInactiveNotFound', (channelDefault = {}) => {
  return cy
    .ChannelTabAccess()
    .SearchChannelOrPulse(channelDefault.name)
    .ChannelVerifyMessageBox(channelDefault.messages.channelNotFound);
});

Cypress.Commands.add('ChannelFilterSubscribed', () => {
  cy.intercept('**/channels?page**').as('subscriptions');
  ChannelElements.buttonFilterChannelSubscribed().click();
  return cy.wait('@subscriptions');
});

Cypress.Commands.add('ChannelFilterCreatedWithMe', () => {
  cy.intercept('**/search/v1/channels?page=1&per_page=50&managed=true').as('createdChannels');
  ChannelElements.buttonFilterChannelCreatedWithMe().click();
  return cy.wait('@createdChannels');
});

Cypress.Commands.add('ChannelSubscribedAndVerified', (channelName) => {
  cy.SearchChannelOrPulse(channelName);
  cy.ChannelCardSubscribe(channelName);
  cy.ChannelFilterSubscribed();
});

Cypress.Commands.add('ChannelSelectedAndVerified', (channelName) => {
  cy.ChannelTabAccess();
  cy.SearchChannelOrPulse(channelName);
  cy.ChannelCardSelect(channelName);
});

Cypress.Commands.add('ChannelFinish', () => {
  return ChannelElements.buttonFinishChannel().click();
});

Cypress.Commands.add('ChannelInactive', () => {
  return ChannelElements.statusInactiveChannel().click();
});

Cypress.Commands.add('ChannelInactiveVerified', (channelName) => {
  cy.ChannelTabAccess();
  cy.ChannelFilterCreatedWithMe();
  cy.SearchChannelOrPulse(channelName);
  return cy.ChannelInactive();
});

Cypress.Commands.add('ChannelClosed', (type) => {
  return ChannelElements.statusClosedChannel().contains(type).should('be.visible');
});

Cypress.Commands.add('ChannelTransfer', (owner) => {
  cy.intercept('**/channels/**/change-user-creator').as('loadChannelTransfer');
  ChannelElements.menuOptions().click();
  ChannelElements.buttonChannelTransfer().click();
  ChannelElements.fieldTransferenceChannel().type(owner);
  ChannelElements.listTransferenceChannel().click();
  ChannelElements.confirmTransferenceChannel().click();
  ChannelElements.confirmTransferenceChannel().click();
  cy.wait('@loadChannelTransfer');
});

Cypress.Commands.add('ChannelMobileSearch', (search) => {
  cy.SearchMobileChannelAndPulse(search);
});

Cypress.Commands.add('ChannelMobileCardSubscribe', () => {
  cy.intercept('POST', '**/channels/subscriptions').as('subscription');
  return ChannelElements.mobileSingUpButtonChannelCard()
    .click()
    .wait('@subscription')
    .its('response.statusCode')
    .should('eq', 201);
});

Cypress.Commands.add('ChannelMobileCardSelect', (name) => {
  return ChannelElements.channelMobileCard().contains(name).click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      ChannelTabAccess(): Chainable<Interception>;
      ChannelEdit(): Chainable<JQuery<HTMLElement>>;
      ChannelAddContributor(user: string): Chainable<Interception>;
      ChannelContributor(): Chainable<JQuery<HTMLElement>>;
      ChannelContributorSelectSearchUser(user: string): Chainable<JQuery<HTMLElement>>;
      ChannelSelectUserInList(user: string): Chainable<JQuery<HTMLElement>>;
      ChannelCardSelect(name: string): Chainable<JQuery<HTMLElement>>;
      ChannelVerifyContributorsQuantity(qtd: string): Chainable<JQuery<HTMLElement>>;
      ChannelVerifyUserContributorsPanel(user: string): Chainable<JQuery<HTMLElement>>;
      ChannelNewPulse(): Chainable<JQuery<HTMLElement>>;
      ChannelNewPulseNotExist(): Chainable<JQuery<HTMLElement>>;
      ChannelCardSubscribe(name: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidRequired(message: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidNameRequired(message: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidCategorieRequired(message: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidTypeRequired(message: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidDescriptionRequired(message: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidName(name: string): Chainable<JQuery<HTMLElement>>;
      ChannelTypeName(name: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidCategorie(categorie: string): any;
      ChannelSelectCategorie(categorie: string): Chainable<JQuery<HTMLElement>>;
      ChannelSelectOptionCategorie(): Chainable<JQuery<HTMLElement>>;
      ChannelSelectOptionType(): Chainable<JQuery<HTMLElement>>;
      ChannelSelectOptionLanguage(): Chainable<JQuery<HTMLElement>>;
      ChannelValidType(type: ChannelOptions): any;
      ChannelSelectType(type: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidLanguage(language: string): any;
      ChannelSelectLanguage(language: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidDescription(description: string): Chainable<JQuery<HTMLElement>>;
      ChannelValidActive(value: boolean): Chainable<JQuery<HTMLElement>>;
      ChannelTypeDescription(description: string): Chainable<JQuery<HTMLElement>>;
      ChannelCheckActive(active: any): Chainable<JQuery<HTMLElement>>;
      ChannelSave(process: string): Chainable<Interception>;
      ChannelOpenCreateForm(): any;
      ChannelFillCreateForm(data: ChannelOptions): Chainable<ChannelOptions>;
      ChannelOpenFillCreateForm(data: ChannelOptions): Chainable<ChannelOptions>;
      ChannelCreate(channel): Chainable<Interception>;
      ChannelCreateMultiple(quantity: number, recursive): Chainable<JQuery<HTMLElement>>;
      ChannelValid(channelExpect): Chainable<JQuery<HTMLElement>>;
      ChannelValidCantSave(): Chainable<JQuery<HTMLElement>>;
      ChannelDelete(): Chainable<JQuery<HTMLElement>>;
      ChannelDialogConfirm(ok: boolean): Chainable<JQuery<HTMLElement>>;
      ChannelAccessOpen(UUID: string, workspace?: string): any;
      ChannelVerifyMessageBox(message: string): Chainable<JQuery<HTMLElement>>;
      ChannelInactiveNotFound(channelDefault): Chainable<JQuery<HTMLElement>>;
      ChannelFilterSubscribed(): Chainable<Interception>;
      ChannelFilterCreatedWithMe(): Chainable<Interception>;
      ChannelSubscribedAndVerified(channelName: string): Chainable<Interception>;
      ChannelSelectedAndVerified(channelName: string): Chainable<Interception>;
      ChannelFinish(): Chainable<JQuery<HTMLElement>>;
      ChannelInactive(): Chainable<JQuery<HTMLElement>>;
      ChannelInactiveVerified(channelName: string): Chainable<JQuery<HTMLElement>>;
      ChannelClosed(type: string): Chainable<JQuery<HTMLElement>>;
      ChannelTransfer(owner: string): Chainable<JQuery<HTMLElement>>;
      ChannelMobileSearch(search: string): Chainable<Interception>;
      ChannelMobileCardSubscribe(): Chainable<JQuery<HTMLElement>>;
      ChannelMobileCardSelect(name: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
