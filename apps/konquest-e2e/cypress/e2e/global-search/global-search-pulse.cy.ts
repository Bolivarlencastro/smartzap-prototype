import GlobalSearchElements from '../../support/elements/global-search-elements';
import * as StatusCode from '../../support/constants/status-code';
import { ChannelOptions, ChannelPulseContentOptions } from '../../support/interfaces';
let createdPulse;
let createdChannel;
let channelFixture;
let channelID;

beforeEach(() => {
  cy.Login('admin');
  cy.FixturesChannelPulseContent()
    .then((fixtures: ChannelPulseContentOptions) => {
      channelFixture = fixtures.channel;
      createdPulse = fixtures.pulse;
      return cy.CreateChannelWithPulseFile(fixtures.content.video, fixtures);
    })
    .then((response) => {
      createdPulse = { ...createdPulse, ...response.pulse, pulse_id: response.pulse.id };
      createdChannel = {
        ...channelFixture,
        id: response.channel.id,
        name: response.channel.name || channelFixture.name,
        description: response.channel.description || channelFixture.description,
      };
      channelID = response.channel.id;
    });
});
it('Should found pulse at global search', () => {
  cy.MissionWaitLoad();
  cy.GlobalSearchAccess();

  cy.GlobalSearchPulseTab();
  cy.GlobalSearch(createdPulse.name);

  cy.intercept(`**/pulses/${createdPulse.pulse_id}`).as('loadPulse');
  GlobalSearchElements.listItems().should('contain', createdPulse.name);
  GlobalSearchElements.buttonOpenItem(createdPulse.name).scrollIntoView().click({ force: true });
  cy.wait('@loadPulse').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.OK);
  });
});

it('As a user, I should not found an inactive pulse at global search', () => {
  cy.Login('user');
  cy.MissionWaitLoad();
  cy.GlobalSearchAccess();
  cy.GlobalSearchPulseTab();
  cy.GlobalSearch(createdPulse.name);
  cy.intercept(`**/pulses/${createdPulse.pulse_id}`).as('loadPulse');
  GlobalSearchElements.listItems().should('contain', createdPulse.name);

  cy.Login('admin');
  const payload: ChannelOptions = {
    name: createdChannel.name,
    channel_type: createdChannel.typeUUID,
    channel_category: createdChannel.categorieUUID,
    description: createdChannel.description,
    is_active: false,
    language: createdChannel.languageID,
  };
  cy.APIChannelUpdate(channelID, payload);

  cy.Login('user');
  cy.MissionWaitLoad();
  cy.GlobalSearchAccess();
  cy.GlobalSearchPulseTab();
  cy.GlobalSearch(createdPulse.name);
  cy.contains('kp-global-search-item', createdPulse.name).should('not.exist');
});

afterEach(() => {
  cy.Login('admin');
  if (channelID) {
    cy.APIChannelDelete(channelID);
  }
});
