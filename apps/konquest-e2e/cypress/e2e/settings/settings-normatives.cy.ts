/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';

let normtiveID;
let normativeName;
let cicleID;
let missionToDelete;
let missionCreated;

describe('Normative tests', () => {
  beforeEach(() => {
    cy.Login('admin');
    normativeName = getRandomName();
    cy.FixturesMissionStageContent()
      .then((response) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentLink(fixtures, fixtures.content.link.youtube);
      })
      .then((response) => {
        missionToDelete = response.id;
        missionCreated = response;
      });
  });

  it('Should create a new normative and Regulatory Compliance Cycle', () => {
    cy.SettingsNormativesAccess();
    cy.SettingsNormativesCreateNormative(normativeName).then((response) => {
      normtiveID = response.body.id;
      cy.GetMetaDataSelectorAndClick('button-close-normative-dialog');
      cy.SettingsNormativesCreateRegulatoryComplianceCycle(normativeName, missionCreated.name).then((response) => {
        cicleID = response.body.id;
        cy.log(response.body);
        cy.SettingsNormativesCreationAccessDirectly();
        cy.SettingsNormativesValidateCycle(normativeName);
      });
    });
  });

  it('Should create a enrollment normative in mission', () => {
    cy.APICreateNormative(getRandomName()).then((response) => {
      normtiveID = response.body.id;
      console.log(response);
      cy.APICreateRegulatoryCompliance(response.body.id).then((response) => {
        cicleID = response.body.id;
        console.log(normtiveID, cicleID);
      });
    });
  });

  it('Should create a enrollment normative in trail', () => {
    cy.APICreateNormative(getRandomName()).then((response) => {
      normtiveID = response.body.id;
      console.log(response);
      cy.APICreateRegulatoryCompliance(response.body.id).then((response) => {
        cicleID = response.body.id;
        console.log(normtiveID, cicleID);
      });
    });
  });

  afterEach(() => {
    cy.APIDeleteCycle(cicleID);
    cy.APIDeleteNormative(normtiveID);
    cy.APICourseDelete(missionToDelete);
  });
});
