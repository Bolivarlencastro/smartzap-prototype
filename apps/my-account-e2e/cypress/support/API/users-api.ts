import { Interception } from 'cypress/types/net-stubbing';
import { CypressResponse } from '../interfaces/cypress-response';
const baseUrl = `${Cypress.env('url_api')}/users`;

Cypress.Commands.add('APIUserDelete', (userId) => {
  return cy.keepsApi(`${Cypress.env('url_api')}/user-roles/${userId}`, {}, 'DELETE');
});

Cypress.Commands.add('APIUserCreate', (data) => {
  cy.keepsApi(
    baseUrl,
    {
      name: data.name,
      email: data.email,
      language: data.api.languageID,
      permissions: [data.api.permissions],
    },
    'POST',
  );
});

Cypress.Commands.add('CreateBinaryFile', (binaryImage) => {
  const blob = Cypress.Blob.binaryStringToBlob(binaryImage, 'image/png');
  const formData = new FormData();
  formData.append('file', blob, 'image.png');
  return formData;
});

Cypress.Commands.add('APICreateAvatar', (binaryImage) => {
  cy.CreateBinaryFile(binaryImage)
    .then((response) => response)
    .then((formData) => {
      return cy.keepsApi(`${Cypress.env('url_api')}/user-avatar`, formData, 'POST', {
        'content-type': 'multipart/form-data',
      });
    })
    .then(parseResponseToJson);
});

Cypress.Commands.add('APIUpdateUserAvatar', (userId, link) => {
  return cy.keepsApi(`${baseUrl}/${userId}`, { avatar: link }, 'PATCH');
});

const parseResponseToJson = (response) => {
  const status = response.status;
  const bodyString = Cypress.Blob.arrayBufferToBinaryString(response.body);
  const body = JSON.parse(bodyString);
  return { status, body };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      APIUserDelete(userId: string): Chainable<Interception>;
      APIUserCreate(data: any): Chainable<Interception>;
      CreateBinaryFile(binaryImage): Chainable<FormData>;
      APICreateAvatar(binaryImage): Chainable<CypressResponse>;
      APIUpdateUserAvatar(userId, link): Chainable<CypressResponse>;
    }
  }
}
