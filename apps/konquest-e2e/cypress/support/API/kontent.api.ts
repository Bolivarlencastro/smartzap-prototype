import { getRandomName } from '../commands';
import { ContentStageOptions, CypressResponse } from '../interfaces';
// Global vars
const baseUrl = `${Cypress.env('url_api_kontent')}/learn-content`;

// Cypress commands
Cypress.Commands.add('APICreateLearnContentLink', (data, contentStageInfo) => {
  const name = contentStageInfo.name;
  const link = data.link;
  const body = { name, link };
  return cy.keepsApi(baseUrl, body, 'POST');
});

Cypress.Commands.add('APICreateLearnContentFile', (data) => {
  const { path, name, fileName } = data;
  return cy
    .readFile(path, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then((blob) => buildFormData(blob, name, fileName))
    .then(createFileLearnContent);
});

// Private Methods
const buildFormData = (file, name, fileName) => {
  const formdata = new FormData();
  formdata.append('file', file, fileName);
  formdata.append('name', name);
  return formdata;
};

const createFileLearnContent = (body) => {
  return cy.keepsApi(baseUrl, body, 'POST', { 'content-type': 'multipart/form-data' }).then(parseResponseToJson);
};

const parseResponseToJson = (response) => {
  const status = response.status;
  const bodyString = Cypress.Blob.arrayBufferToBinaryString(response.body);
  const body = JSON.parse(bodyString);
  return { status, body };
};

Cypress.Commands.add('APICreateLearnContentQuiz', (stageCreatedBefore) => {
  return cy.APICreateExam(stageCreatedBefore);
});

Cypress.Commands.add('APICreateExam', (stageCreatedBefore) => {
  const url = `${Cypress.env('url_api')}/exams`;
  const stage = stageCreatedBefore.id;
  const title = getRandomName();
  const body = { stage, title };
  return cy.keepsApi(url, body, 'POST');
});

Cypress.Commands.add('APIQuestionsToExam', (contentCreatedBefore, contentDefault) => {
  const exam_id = contentCreatedBefore.id;
  const url = `${Cypress.env('url_api')}/exams/${exam_id}/questions`;
  const questions = contentDefault.exam_questions;
  const body = questions;
  return cy.keepsApi(url, body, 'POST');
});

declare global {
  namespace Cypress {
    interface Chainable {
      APICreateLearnContentLink(data, contentStageInfo): Chainable<CypressResponse<ContentStageOptions>>;
      APICreateLearnContentFile(data: { path: string; name: string; fileName: string }): any;
      APICreateLearnContentQuiz(stageCreatedBefore): any;
      APICreateExam(stageCreatedBefore: ContentStageOptions): any;
      APIQuestionsToExam(contentCreatedBefore: ContentStageOptions, contentDefault: ContentStageOptions): any;
    }
  }
}
