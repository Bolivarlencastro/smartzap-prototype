/// <reference types="cypress" />
import * as StatusCode from '../../support/constants/status-code';
import { getRandomName } from '../../support/commands';
import { getDateToday } from '../../support/commands';
import { getDateTodayBR } from '../../support/commands';
import TrailElements from '../../support/elements/trail-elements';
import * as util from '../../support/constants/utils';
let missionToDelete;
let trailToDelete;
let channelToDelete;
let missionCreatedBefore;
let trailCreatedBefore;
let contentCreatedBefore;
let channelCreatedBefore;
let pulseCreatedBefore;

describe('Trail create with internal mission', () => {
  beforeEach(() => {
    cy.FixturesMission().then((missionDefault) => {
      missionToDelete = {};
      trailToDelete = {};
      missionDefault.name = getRandomName();
      cy.Login('admin');
      cy.APIMissionCreate(missionDefault).then((response) => {
        expect(response.status).eq(StatusCode.Created);
        expect(response.body.id).not.to.be.empty;
        missionCreatedBefore = response.body;
        missionToDelete = response.body.id;
      });
    });
  });
  it('Should create a trail default - open - active', () => {
    cy.FixturesTrail().then((trailDefault) => {
      trailDefault.name = getRandomName();
      trailDefault.contentInTrail = missionCreatedBefore.name;

      cy.TrailCreate(trailDefault).then((response) => {
        trailCreatedBefore = response;
        trailToDelete = trailCreatedBefore.id;
      });
      cy.TrailSearch(trailDefault.name);
      cy.TrailVerifyCardActive();
      cy.TrailOpenCard(trailDefault.name);
      cy.TrailVerifyNumberMissionOnPopUp(util.NUMBER_CONTENTS);
      cy.TrailVerifyTypeCard(util.OPEN_TYPE);
      cy.PressEsc();
      cy.TrailCreatedByMe();
      cy.TrailSearch(trailDefault.name);
      cy.TrailOpenCard(trailDefault.name);
    });
  });

  it('Should create a trail - closed - active', () => {
    cy.FixturesTrail().then((trailDefault) => {
      trailDefault.name = getRandomName();
      trailDefault.contentInTrail = missionCreatedBefore.name;
      trailDefault.type = 'Fechado';

      cy.TrailCreate(trailDefault).then((response) => {
        trailCreatedBefore = response;
        trailToDelete = trailCreatedBefore.id;
        expect(trailCreatedBefore.learning_trail_type).equal(util.TRAIL_CLOSED_TYPE_UUID);
      });
      cy.TrailCreatedByMe();
      cy.TrailSearch(trailDefault.name);
      cy.TrailOpenCard(trailDefault.name);
      cy.TrailVerifyTypeCard(util.CLOSED_TYPE);
    });
  });

  it('Should create a trail - open - inactive', () => {
    cy.FixturesTrail().then((trailDefault) => {
      trailDefault.name = getRandomName();
      trailDefault.is_active = false;
      trailDefault.contentInTrail = missionCreatedBefore.name;

      cy.TrailCreate(trailDefault)
        .then((response) => {
          trailCreatedBefore = response;
          trailToDelete = trailCreatedBefore.id;
          expect(trailCreatedBefore.is_active).equal(trailDefault.is_active);
        })
        .then(() => {
          cy.TrailCreatedByMe();
          cy.TrailSearch(trailDefault.name);
          cy.TrailInactive(util.INATIVO);
          cy.TrailOpenCard(trailDefault.name);
          cy.TrailClickEdit(trailCreatedBefore);
          cy.TrailVerifyCheckboxInactive();
          cy.HomeAccess({ filter: util.COURSES });
          cy.TrailAccess();
          cy.TrailSearch(trailDefault.name);
          cy.TrailNotAvailable(util.TRAIL_NOT_AVAILABLE);
        });
    });
  });

  it('Should create a temporary trail and after remove expiration date', () => {
    cy.FixturesTrail()
      .then((trailDefault) => {
        trailDefault.name = getRandomName();
        trailDefault.contentInTrail = missionCreatedBefore.name;
        trailDefault.expiration_date = getDateTodayBR();
        cy.TrailCreate(trailDefault);
      })
      .then((response) => {
        trailCreatedBefore = response;
        trailToDelete = trailCreatedBefore.id;
        expect(trailCreatedBefore.expiration_date).equal(getDateToday());
      })
      .then(() => {
        cy.intercept(`**/learning-trails/${trailCreatedBefore.id}`).as('trailEdit');
        cy.TrailAccess();
        cy.TrailSearch(trailCreatedBefore.name);
        cy.TrailOpenCard(trailCreatedBefore.name);
        cy.TrailClickEdit(trailCreatedBefore);
        cy.TrailEditExpirationDate();
        cy.TrailClickConfirmInformation();
        cy.wait('@trailEdit');
        cy.TrailCreateStepImage();
        cy.TrailVerifyStep(missionCreatedBefore.name);
        cy.TrailConfirmContent();
        TrailElements.stepFinishTrail().click();
        TrailElements.buttonFinishTrail().click();
        cy.TrailSearch(trailCreatedBefore.name);
        cy.TrailOpenCard(trailCreatedBefore.name);
        TrailElements.trailDetailsExpirationDate().should('not.exist');
      });
  });

  afterEach(() => {
    if (missionToDelete) {
      cy.Login('admin');
      cy.APICourseDelete(missionToDelete);
      cy.APITrailDelete(trailToDelete);
    }
  });
});

describe('Trail create with pulse link youtube', () => {
  beforeEach(() => {
    cy.FixturesPulse().then((pulseDefault) => {
      cy.FixturesContent().then((contentDefault) => {
        cy.FixturesChannel().then((channelDefault) => {
          trailToDelete = {};
          channelToDelete = {};
          pulseDefault.name = getRandomName();
          channelDefault.name = getRandomName();
          contentDefault.addContentStage.name = getRandomName();

          cy.Login('admin');
          cy.APICreateLearnContentLink(contentDefault.link.youtube, contentDefault.addContentStage).then((response) => {
            contentCreatedBefore = response.body;

            cy.APIChannelCreate(channelDefault).then((response) => {
              channelCreatedBefore = response.body;
              channelToDelete = response.body.id;
            });

            pulseDefault.learn_content_uuid = contentCreatedBefore.id;
            cy.APIPulseCreate(pulseDefault).then((response) => {
              pulseCreatedBefore = response.body;
              pulseDefault.pulse_id = pulseCreatedBefore.id;
              pulseDefault.channel_id = channelCreatedBefore.id;

              cy.ChannelLinkToPulse(pulseDefault);
            });
          });
        });
      });
    });
  });

  it('Should create a trail - open - active - with pulse', () => {
    cy.FixturesTrail().then((trailDefault) => {
      trailDefault.name = getRandomName();
      trailDefault.contentInTrail = pulseCreatedBefore.name;

      cy.TrailCreate(trailDefault)
        .then((response) => {
          trailToDelete = response.id;
        })
        .then(() => {
          cy.TrailCreatedByMe();
          cy.TrailSearch(trailDefault.name);
          cy.TrailOpenCard(trailDefault.name);
          cy.TrailVerifyNumberPulseOnPopUp(util.NUMBER_CONTENTS);
        });
    });
  });

  afterEach(() => {
    if (channelToDelete) {
      cy.Login('admin');
      cy.APIChannelDelete(channelToDelete);
      cy.APITrailDelete(trailToDelete);
    }
  });
});

describe('Trail create with external mission', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesMission()
      .then((fixtures) => ({
        ...fixtures,
        name: getRandomName(),
      }))
      .then((fixtures) => {
        return cy.APIMissionExternalCreate(fixtures);
      })
      .then((response) => {
        missionCreatedBefore = response.body;
        missionToDelete = response.body.id;
      });
  });

  it('Creates a trail with external mission', () => {
    cy.FixturesTrail()
      .then((fixtures) => ({
        ...fixtures,
        name: getRandomName(),
        contentInTrail: missionCreatedBefore.name,
      }))
      .then((trailFixtures) => {
        cy.TrailCreate(trailFixtures);
      })

      .then((response) => {
        trailCreatedBefore = response;
        trailToDelete = trailCreatedBefore.id;
        cy.intercept(`**/learning-trails/${trailCreatedBefore.id}`).as('trailOpen');
        cy.TrailCreatedByMe();
        cy.TrailSearch(trailCreatedBefore.name);
        cy.TrailOpenCard(trailCreatedBefore.name);

        cy.wait('@trailOpen').its('response.body.steps[0].mission.mission_model').should('eq', 'EXTERNAL_PROVIDER');
        TrailElements.stageName().first().scrollIntoView().should('be.visible').contains(missionCreatedBefore.name);
      });
  });

  afterEach(() => {
    if (trailToDelete) {
      cy.APITrailDelete(trailToDelete);
    }
    if (missionToDelete) {
      cy.APICourseDelete(missionToDelete);
    }
  });
});
it('Should create trail default by api', () => {
  cy.FixturesTrail().then((trailDefault) => {
    trailDefault.name = getRandomName();

    cy.Login('admin');
    cy.APITrailCreate(trailDefault).then((response: any) => cy.APITrailDelete(response.body.id));
  });
});
