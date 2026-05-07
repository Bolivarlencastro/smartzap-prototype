export default class ChannelElements {
  static channelForm() {
    return cy.get('form', { timeout: 2000 });
  }

  static createPulseButton() {
    return cy.get(`#button-channel-detail-new-button`);
  }

  static topMenuButton(button) {
    return cy.get(`kp-filter #filter-action`, { timeout: 50000 }).filter(`:contains("${button}")`);
  }

  static searchInput() {
    return cy.get('kp-global-search-input [id="filter-input"]').should('be.visible');
  }

  static createButton() {
    return cy.get('[data-test="new-channel"]').should('be.visible');
  }

  static nameInput() {
    return cy.get('#input-channel-form-name').should('be.visible');
  }

  static contributorsLabelDetail() {
    return cy.get('[data-test="btn-add-contributors"]').contains('contribuidor').should('be.visible');
  }

  static contributorsPanel() {
    return ChannelElements.contributorsLabelDetail().click().get('[id^=mat-menu-panel]');
  }

  static categorie() {
    return ChannelElements.selectForm('channel_category').should('be.visible');
  }

  static listOptions() {
    return cy.get('div > mat-option > span');
  }

  static type() {
    return ChannelElements.selectForm('channel_type').should('be.visible');
  }

  static language() {
    return ChannelElements.selectForm('language').should('be.visible');
  }

  static selectForm(formcontrolname) {
    return cy.get(`mat-select[formcontrolname="${formcontrolname}"]`);
  }

  static descriptionInput() {
    return cy.get('mat-form-field').find('textarea').focus();
  }

  static checkActive() {
    cy.scrollTo(0, 500);
    return cy.get('.mdc-form-field > [aria-checked="true"]').should('be.visible');
  }

  static checkButtonInactive() {
    cy.scrollTo(0, 500);
    return cy.get('.mdc-form-field > [aria-checked="false"]').should('be.visible');
  }

  static save() {
    return cy.get('#button-channel-form-save').should('be.visible');
  }

  static menuOptions() {
    return cy.get('[data-test="button-channel-menu"]').should('be.visible');
  }

  static editOption() {
    return this.menuOptions().click().get('#button-channel-detail-edit').should('be.visible');
  }

  static contributorOption() {
    return this.menuOptions().click().get('#button-channel-detail-contributors').should('be.visible');
  }

  static deleteOption() {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    return this.menuOptions().click().get('#button-channel-detail-delete').should('be.visible');
  }

  static dialogConfirm() {
    return cy.get('mat-dialog-container').should('be.visible');
  }

  static dialogConfirmOkButton() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static dialogConfirmCancelButton() {
    return cy.get('#button-confirm-cancel').should('be.visible');
  }

  static listChannels() {
    return cy.get('kp-channel-card');
  }

  static channelCard(name) {
    return cy.get('[data-test="kp-channel-card.channel_name"]').should('be.visible').contains(name);
  }

  static singUpButtonChannelCard() {
    return cy.get('[data-test="kp-channel-card.enroll"]').should('be.visible');
  }

  /*
   * Return a button to open the edit page of a channel
   * this function need you pass a parameter "channel"
   * what need return a channel card on list
   */
  static openButton(channel) {
    return channel().find('#button-card-channel-open').should('be.visible');
  }

  static firstChannel() {
    return ChannelElements.listChannels().should('be.visible').first().should('be.visible');
  }

  static requireMessage() {
    return cy.get('mat-error');
  }

  static inputSearchUserContributor() {
    return cy.get('[id^=mat-input]');
  }

  static channelDetailName() {
    return cy.get('#channel-detail').should('be.visible');
  }

  static statusInactiveChannel() {
    return cy.get('.kp-channel-card-cover> .ng-star-inserted').should('be.visible');
  }

  static buttonChannelAccess() {
    return cy.get('[data-test="button-channel-access"]').should('be.visible');
  }

  static buttonAllChannels() {
    return cy.get('#filter-action-HOME', { timeout: 5000 }).should('be.visible');
  }

  static channelMessageBox() {
    return cy.get('.fuse-alert-container');
  }

  static buttonFilterChannelSubscribed() {
    return cy.get('[data-test="button-channel-subscribed"]').should('be.visible');
  }

  static buttonFilterChannelCreatedWithMe() {
    return cy.get('[data-test="channels-create-by-me-selector"]').should('be.visible');
  }

  static buttonFinishChannel() {
    return cy.get('[data-test="button-channel-finish"]', { timeout: 3000 }).should('be.visible');
  }

  static statusClosedChannel() {
    return cy.get('.gap-8 > .flex-col > .flex');
  }

  static ListUsersSearchContributorsChannel() {
    return cy.get('[role="listbox"]');
  }

  static inputChannelBanner() {
    return cy.get('app-channel-form-cover').find('input');
  }

  static channelSelectBanner() {
    return cy.get('[data-test="kp-channel-card.cover-background"]', { timeout: 3000 }).should('be.visible');
  }

  static numberEnrolledUserChannel() {
    return cy.get('button span > span').contains('1 inscrito').should('be.visible');
  }

  static nameEnrolledUserChannel(enrolledUser) {
    return cy.get(`[ng-reflect-message="${enrolledUser}"]`).should('be.visible');
  }

  static ownerUserChannel() {
    return cy.get('app-channel-detail span strong');
  }

  static verticalButtonPulse() {
    return cy.get('[data-test="pulse"]').should('be.visible');
  }

  static buttonChannelTransfer() {
    return cy.get('#button-channel-detail-transfer').should('be.visible');
  }

  static fieldTransferenceChannel() {
    return cy.get('app-transfer-dialog-filter mat-form-field').should('be.visible');
  }

  static listTransferenceChannel() {
    return cy.get('[role="listbox"] [role="option"]');
  }

  static confirmTransferenceChannel() {
    return cy.get('[data-test="confirm-transfer-trail"]').should('be.visible');
  }

  static mobileButtonChannelTab() {
    return cy.get('[data-test="pulses-navigation-tab"]').eq(1).should('be.visible');
  }

  static mobileSearchInput() {
    return cy.get('#filter-input').should('be.visible');
  }

  static mobileSingUpButtonChannelCard() {
    return cy.get('[data-test="channel-subscribe-button"]').should('be.visible');
  }

  static channelMobileCard() {
    return cy.get('[data-test="channel-card-selector"]').should('be.visible');
  }

  static mobileNumberEnrolledInChannel() {
    return cy.get('[data-test="channel-card-subscribe-selector"]').should('be.visible');
  }

  static mobileChannelSubscribeButton() {
    return cy.get('[data-test="channel-card-button-subscribe"]').should('be.visible');
  }

  static filterConfirmButton() {
    return cy.get('[data-test="filter-confirm-button"]').should('exist');
  }

  static mobileChannelName() {
    return cy.get('[data-test="channel-mobile-name"]').should('be.visible');
  }

  static mobileChannelDescription() {
    return cy.get('[data-test="channel-mobile-description"]').should('be.visible');
  }

  static channelTab() {
    return cy.get('[role="tab"]').should('be.visible');
  }

  static channelInactiveSelector() {
    return cy.get('[data-test="inactive-channel-selector"]');
  }
}
