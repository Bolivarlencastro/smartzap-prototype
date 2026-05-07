import { ChannelOptions, CypressResponse } from '../interfaces';

const baseUrlChannel = `${Cypress.env('url_api')}/channels`;

Cypress.Commands.add('APIChannelDelete', (id) => cy.keepsApi(`${baseUrlChannel}/${id}`, null, 'DELETE'));

Cypress.Commands.add('ChannelLinkToPulse', (data) =>
  cy.keepsApi(`${baseUrlChannel}/${data.channel_id}/pulses`, { pulse_id: data.pulse_id }, 'POST'),
);

Cypress.Commands.add('APIChannelCreate', (data) =>
  cy.keepsApi(
    baseUrlChannel,
    {
      name: data.name,
      channel_type: data.typeUUID,
      channel_category: data.categorieUUID,
      description: data.description,
      is_active: data.active,
      language: data.languageID,
    },
    'POST',
  ),
);

Cypress.Commands.add('APIChannelUpdate', (channelID, payload) =>
  cy.keepsApi(`${baseUrlChannel}/${channelID}`, payload, 'PUT'),
);

declare global {
  namespace Cypress {
    interface Chainable {
      APIChannelDelete(id: string): Chainable<CypressResponse>;
      ChannelLinkToPulse(data: ChannelOptions): Chainable<CypressResponse<ChannelOptions>>;
      APIChannelCreate(data: ChannelOptions): Chainable<CypressResponse<ChannelOptions>>;
      APIChannelUpdate(channelID: string, payload: ChannelOptions): Chainable<CypressResponse<ChannelOptions>>;
    }
  }
}
