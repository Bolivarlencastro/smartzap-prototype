import GlobalSearchElements from '../../support/elements/global-search-elements';
import * as StatusCode from '../../support/constants/status-code';
import { ChannelPulseContentOptions } from '../../support/interfaces';
let createdPulse;
let channelToDelete;

beforeEach(() => {
  cy.Login('admin');
  cy.FixturesChannelPulseContent()
    .then((fixtures: ChannelPulseContentOptions) => {
      createdPulse = fixtures.pulse;
      fixtures.channel.active = false;
      return cy.CreateChannelWithPulseFile(fixtures.content.video, fixtures);
    })
    .then((response: { channel: string; pulse: string }) => {
      createdPulse = { ...createdPulse, pulse_id: response.pulse };
      channelToDelete = response.channel;
    });
});
it('Should found pulse at global search', () => {
  cy.MissionWaitLoad();
  cy.GlobalSearchAccess();

  cy.intercept('**=pulses').as('loadPulseSearch');
  GlobalSearchElements.buttonPulseOnGlobalSearch().should('be.visible').scrollIntoView().click({ force: true });
  cy.wait('@loadPulseSearch');
  cy.GlobalSearch(createdPulse.name);

  cy.intercept(`**/pulses/${createdPulse.pulse_id}`).as('loadPulse');
  GlobalSearchElements.mobileItemName().should('contain', createdPulse.name).click();
  cy.wait('@loadPulse').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.OK);
  });
});

afterEach(() => {
  if (channelToDelete) {
    cy.APIChannelDelete(channelToDelete);
  }
});
