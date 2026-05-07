import { getRandomName } from '../../support/commands';
import EnrollsMissionsElements from '../../support/elements/enrolls-missions-elements';
import TrailElements from '../../support/elements/trail-elements';
import * as util from '../../support/constants/utils';
const trailDefaultPath = `${Cypress.env('ENVIRONMENT')}/trail/default`;
let trailToDelete;
let missionToDelete;
let createdTrail;

describe('Trail on mobile screen', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.fixture(trailDefaultPath)
      .then((trailDefault) => {
        trailDefault.name = getRandomName();
        cy.APITrailCreate(trailDefault);
      })
      .then((response) => {
        createdTrail = response.body;
        trailToDelete = createdTrail.id;
      })
      .then(() => {
        cy.FixturesMissionStageContent();
      })
      .then((response) => {
        cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentFile(fixtures, fixtures.content.video);
      })
      .then((missionCreated) => {
        missionToDelete = missionCreated.id;
        cy.APITrailLinkMission(createdTrail.id, missionCreated.id, 1);
      });
  });
  it('Should check the main fields of a created trail', () => {
    const metadataValues = [
      'tab-GENERAL.DURATION',
      'tab-GENERAL.MISSIONS',
      'tab-GENERAL.PULSES',
      'trail-name',
      'created-date',
      'description',
      'step-trail',
      'step-name',
      'trail-certificate',
      'play-circle',
    ];

    cy.Login('user');
    EnrollsMissionsElements.buttonTouchTargetMobile().click();
    cy.TrailAccess();
    cy.TrailSearchMobile(createdTrail.name);
    cy.TrailOpenCardMobile(createdTrail.name);

    TrailElements.trailActionOnCardMobile().contains(util.START).should('be.visible');
    metadataValues.forEach((metadataValue) => {
      cy.VerifyMetadataElementVisible(metadataValue);
    });
  });

  afterEach(() => {
    if (trailToDelete) {
      cy.Login('admin');
      cy.APITrailDelete(trailToDelete);
    }
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
    }
  });
});
