/// <reference types="cypress" />

import ClassroomElements from '../../support/elements/classroom-elements';
import { ChannelPulseContentOptions } from '../../support/interfaces';

let missionToDelete;
let trailToDelete;
let trailCreatedBefore;
let missionCreatedBefore;
let channelToDelete;

describe('Trail enroll - OPEN', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APITrailCreateWithInternalMission().then((response) => {
      trailCreatedBefore = response[0];
      missionCreatedBefore = response[1];
      trailToDelete = trailCreatedBefore.id;
      missionToDelete = missionCreatedBefore.id;
    });
    cy.FixturesChannelPulseContent()
      .then((fixtures: ChannelPulseContentOptions) => {
        return cy.CreateChannelWithPulseFile(fixtures.content.video, fixtures);
      })
      .then((response: any) => {
        channelToDelete = response.body.channel;
        cy.APITrailLinkPulse(trailCreatedBefore.id, response.body.pulse, 1);
      });
  });
  it('User client should enroll in trail and access the mission and pulse contents on mobile viewer', () => {
    cy.Login('user');
    cy.TrailAccessMobile();
    cy.TrailSearchMobile(trailCreatedBefore.name);
    cy.TrailOpenCardMobile(trailCreatedBefore.name);
    cy.TrailEnrollMobile();

    cy.TrailOpenStepMobile(1);
    cy.VerifyMetadataElementVisible('videoPlayer');
    cy.GetMetaDataSelectorAndClick('button-return-to-trail');
    cy.TrailOpenStepMobile(0);
    cy.VerifyMetadataElementVisible('course-step-content');
    cy.VerifyMetadataElementVisible('mobile-next-content-button');
    ClassroomElements.classroomMenu().click();
    ClassroomElements.buttonExitClassroomMobile().click();
    cy.GetMetaDataSelectorAndClick('button-close-trail-popup-mobile');

    cy.TrailVerifyEnrolledMobile(trailCreatedBefore.name);
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APITrailDelete(trailToDelete);
    cy.APICourseDelete(missionToDelete);
    cy.APIChannelDelete(channelToDelete);
  });
});
