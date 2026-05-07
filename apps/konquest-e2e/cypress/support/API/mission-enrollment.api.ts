const baseUrl = `${Cypress.env('url_api')}/mission-enrollments`;
import { Interception } from 'cypress/types/net-stubbing';
import { getDateTomorrow } from '../commands';
import { CypressResponse } from '../interfaces/cypress-response';
import * as util from '../constants/utils';

Cypress.Commands.add('APIMissionEnrollmentDelete', (UUID) => {
  return cy.keepsApi(`${baseUrl}/${UUID}`, {}, 'DELETE');
});

Cypress.Commands.add('APIEnrollmentsGetAll', () => {
  return (function fetch(url, accumulator = []) {
    return cy.keepsApi(url, {}, 'GET').then((response) => {
      const next = response.body.next;
      const results = response.body.results || [];
      const combined = [...accumulator, ...results];
      return next ? fetch(next, combined) : cy.wrap(combined);
    });
  })(`${baseUrl}?page=1&per_page=200`);
});

Cypress.Commands.add('APIEnrollmentsDeleteAll', () => {
  cy.APIEnrollmentsGetAll().then((enrollments: any) => {
    enrollments.forEach((e) => cy.APIMissionEnrollmentDelete(e.id));
  });
});

Cypress.Commands.add('APIMissionEnrollUser', (data) =>
  cy.keepsApi(
    baseUrl,
    {
      goal_date: getDateTomorrow(),
      status: data.status,
      required: data.required_mission,
      user: data.userUUID || data.user,
      mission: data.missionUUID || data.mission,
    },
    'POST',
  ),
);

Cypress.Commands.add('APIMissionBatchEnrollments', (data) => {
  cy.keepsApi(
    `${baseUrl}/batch`,
    {
      goal_date: getDateTomorrow(),
      status: data.status,
      required: data.required_mission,
      users: [data.userUUID],
      missions: [data.missionUUID],
    },
    'POST',
  );
});

let url;
const method = 'POST';

Cypress.Commands.add('buildURL', (enrollmentID) => {
  url = `${Cypress.env('url_api')}/mission-enrollments/${enrollmentID}/external-review`;
});

Cypress.Commands.add('APIExternalMissionSendCertificate', (data) => {
  const enrollmentID = data.id;
  const { path, fileName } = data.certificate.file;

  cy.APIMissionEnrollmentRating(data);
  cy.APIMissionEnrollmentEvaluation(data);
  return cy
    .buildURL(enrollmentID)
    .readFile(path, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then((blob) => buildFormData(blob, fileName))
    .then(sendFileCertificate);
});

const buildFormData = (file, fileName) => {
  const formdata = new FormData();
  formdata.append('file', file, fileName);
  return formdata;
};

const sendFileCertificate = (body) => {
  return cy.keepsApi(url, body, method, { 'content-type': 'multipart/form-data' }).then(parseResponseToJson);
};

const parseResponseToJson = (response) => {
  const status = response.status;
  const bodyString = Cypress.Blob.arrayBufferToBinaryString(response.body);
  const body = JSON.parse(bodyString);
  return { status, body };
};

Cypress.Commands.add('APIExternalMissionEvaluateCertificate', (data) => {
  cy.keepsApi(
    `${baseUrl}/${data.id}/external-validate`,
    {
      approved: data.approve.approved,
      performance: data.performance,
      reject_comment: data.approve.reject_comment,
    },
    'POST',
  );
});

Cypress.Commands.add('APIExternalMissionReenroll', (data) => {
  cy.keepsApi(
    baseUrl,
    {
      goal_date: getDateTomorrow(),
      mission: data.missionUUID,
      user: data.userUUID,
    },
    'POST',
  );
});

Cypress.Commands.add('APIMissionEnrollmentManualFinish', (data) => {
  cy.keepsApi(
    `${baseUrl}/${data.id}/manual-finish`,
    {
      performance: data.performance,
    },
    'POST',
  );
});

Cypress.Commands.add('APIMissionEnrollmentGiveUp', (data) => {
  cy.keepsApi(
    `${baseUrl}/${data.id}/give-up`,
    {
      give_up_comment: util.MOTIVE_FOR_GIVE_UP,
    },
    'PATCH',
  );
});

Cypress.Commands.add('APIMissionPresentialLiveBatchEnrollment', (data) => {
  cy.keepsApi(
    `${baseUrl}/batch/sync`,
    {
      missions: [data.missionUUID],
      users: [data.userUUID],
    },
    'POST',
  );
});

Cypress.Commands.add('APIMissionPresentialLiveEnrollment', (data) => {
  cy.keepsApi(
    `${baseUrl}/sync`,
    {
      mission: data.missionUUID,
      user: data.userUUID,
    },
    'POST',
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      APIMissionEnrollmentDelete(UUID: string): Chainable<Interception>;
      APIEnrollmentsGetAll(): Chainable<Interception>;
      APIEnrollmentsDeleteAll(): Chainable<Interception>;
      APIMissionEnrollUser(data): Chainable<CypressResponse>;
      APIMissionBatchEnrollments(data): Chainable<Interception>;
      buildURL(enrollmentID: string): Chainable<Interception>;
      APIExternalMissionSendCertificate(data): any;
      APIExternalMissionEvaluateCertificate(data): Chainable<Interception>;
      APIExternalMissionReenroll(data): Chainable<Interception>;
      APIMissionEnrollmentManualFinish(data): Chainable<Interception>;
      APIMissionEnrollmentGiveUp(data): Chainable<Interception>;
      APIMissionPresentialLiveBatchEnrollment(data): Chainable<Interception>;
      APIMissionPresentialLiveEnrollment(data): Chainable<Interception>;
    }
  }
}
