/// <reference types="cypress" />
/// <reference types="cypress-iframe" / >
import { getRandomName } from '../../support/commands';
import { isContentTypeOf } from '../../support/commands/pulse-commands';
import * as ERROR_MSG from '../../support/constants/errors-messages-pulse';
import * as util from '../../support/constants/utils';
import * as StatusCode from '../../support/constants/status-code';
import PulseElements from '../../support/elements/pulse-elements';
import { GOOGLE_DRIVE, SOUND_CLOUD, VIMEO, YOU_TUBE } from '../../support/constants/players';
import { FixtureContent } from '../../support/interfaces/content-options';
import * as CONTENT from '../../support/constants/cotent-type';
import { ChannelOptions } from '../../support/interfaces';
let channelCreatedBefore: ChannelOptions;

describe('Pulse link content - Positives scenarios', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesChannel().then((channelDefault) => {
      channelDefault.name = getRandomName();
      cy.APIChannelCreate(channelDefault).then((response) => {
        expect(response.status).eq(StatusCode.Created);
        expect(response.body.id).not.to.be.empty;
        channelCreatedBefore = response.body;
      });
    });
  });

  it('like a admin i would like create a pulse link with youtube type', () => {
    cy.PulseCreate(channelCreatedBefore.id, YOU_TUBE, {
      name: getRandomName(),
      link: { id: CONTENT.CONTENT_YOU_TUBE_LINK_ID },
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidPlayableContent({
        link: { id: CONTENT.CONTENT_YOU_TUBE_LINK_ID, player: 'youTube' },
      });
    });
  });

  it('like a admin i would like create a pulse link with vimeo type', () => {
    cy.PulseCreate(channelCreatedBefore.id, VIMEO, {
      name: getRandomName(),
      link: { id: CONTENT.CONTENT_VIMEO_ID },
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidPlayableContent({
        link: { id: CONTENT.CONTENT_VIMEO_ID, player: VIMEO },
      });
    });
  });
  it('like a admin i would like create a pulse link with soundcloud type', () => {
    cy.PulseCreate(channelCreatedBefore.id, SOUND_CLOUD, {
      name: getRandomName(),
      link: { id: CONTENT.CONTENT_SOUND_CLOUD_ID },
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidPlayableContent({
        link: { id: CONTENT.CONTENT_SOUND_CLOUD_ID, player: 'soundCloud' },
      });
    });
  });
  it('like a admin i would like create a pulse link with googledrive doc', () => {
    cy.PulseCreate(channelCreatedBefore.id, GOOGLE_DRIVE, {
      name: getRandomName(),
      link: { id: CONTENT.CONTENT_GDRIVE_DOC_ID },
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidPlayableContent({
        link: { id: CONTENT.CONTENT_GDRIVE_DOC_ID, player: GOOGLE_DRIVE },
      });
    });
  });
  it('like a admin i would like create a pulse link with googledrive sheet', () => {
    cy.PulseCreate(channelCreatedBefore.id, GOOGLE_DRIVE, {
      name: getRandomName(),
      link: { id: CONTENT.CONTENT_GDRIVE_SHEET_ID },
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidPlayableContent({
        link: { id: CONTENT.CONTENT_GDRIVE_SHEET_ID, player: GOOGLE_DRIVE },
      });
    });
  });
  it('like a admin i would like create a pulse link with googledrive presentation', () => {
    cy.PulseCreate(channelCreatedBefore.id, GOOGLE_DRIVE, {
      name: getRandomName(),
      link: { id: CONTENT.CONTENT_GDRIVE_PRESENTATION_ID },
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidPlayableContent({
        link: { id: CONTENT.CONTENT_GDRIVE_PRESENTATION_ID, player: GOOGLE_DRIVE },
      });
    });
  });

  it('Create a pulse - Genially - Link', () => {
    cy.fixture('dev/content/default')
      .then((response: FixtureContent) => {
        return response.genially.link;
      })
      .then((link) => {
        cy.PulseLinkGeniallyCreate(channelCreatedBefore.id, link)
          .then((pulseCreated) => {
            return pulseCreated;
          })
          .then((pulseCreated) => {
            cy.OpenPulseContent(pulseCreated);
            cy.PulseValidDocContent();
          });
      });
  });

  afterEach(() => {
    cy.APIChannelDelete(channelCreatedBefore.id).then((response) => {
      expect(response.status).eq(StatusCode.NoContent);
    });
  });
});

describe('Pulse link content - Negatives scenarios', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.FixturesChannel().then((channelDefault) => {
      cy.APIChannelCreate(channelDefault).then((response) => {
        expect(response.status).eq(StatusCode.Created);
        expect(response.body.id).not.to.be.empty;
        channelCreatedBefore = response.body;
      });
    });
  });
  it('Create a Pulse - Link Content - Youtube - Invalid ID', () => {
    cy.PulseCreateWithError(
      channelCreatedBefore.id,
      YOU_TUBE,
      {
        name: getRandomName(),
        link: { id: 'invalid' },
      },
      { checkResponse: true },
    ).then((response) => {
      //The best scenario is 400 code but in the moment the system not have a tratment
      expect(response.statusCode).to.be.greaterThan(399);
      expect(response.statusCode).to.be.lessThan(600);
    });
  });

  it('Create a Pulse - Link Content - Youtube - Invalid Link', () => {
    const { isContentType, isLinkType } = isContentTypeOf(YOU_TUBE);
    const content = {
      name: getRandomName(),
      link: { url: YOU_TUBE },
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(YOU_TUBE);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, YOU_TUBE);
    PulseElements.inputNameNewContent().click();

    cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_YOUTUBE_LINK_FIELD);
  });

  it('Create a Pulse - Link Content - Youtube - Without name', () => {
    const name = getRandomName();
    cy.FixturesContent().then((content: FixtureContent) => {
      cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
      cy.ChannelNewPulse();
      cy.PulseSelectType(YOU_TUBE);
      PulseElements.inputLinkNewContent().clear().type(content.link.youtube.link);
      PulseElements.inputNameContentLink().type(name, { force: true });
      PulseElements.inputNameContentLink().clear();
      PulseElements.inputLinkNewContent().click();

      cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_REQUIRED_FIELD);
    });
  });

  it('Create a Pulse - Link Content - Vimeo - Invalid Link', () => {
    const { isContentType, isLinkType } = isContentTypeOf(VIMEO);
    const content = {
      name: getRandomName(),
      link: { url: 'invalid' },
    };

    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(VIMEO);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, VIMEO);
    PulseElements.inputNameNewContent().click();

    cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_VIMEO_LINK_FIELD);
  });

  it('Create a Pulse - Link Content - Vimeo - Without name', () => {
    const name = getRandomName();
    cy.FixturesContent().then((content: FixtureContent) => {
      cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
      cy.ChannelNewPulse();
      cy.PulseSelectType(VIMEO);
      PulseElements.inputLinkNewContent().clear().type(content.link.vimeo.link);
      PulseElements.inputNameContentLink().type(name, { force: true });
      PulseElements.inputNameContentLink().clear();
      PulseElements.inputLinkNewContent().click();

      cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_REQUIRED_FIELD);
    });
  });

  it('Create a Pulse - Link Content - SoundCloud - Invalid ID', () => {
    cy.PulseCreateWithError(
      channelCreatedBefore.id,
      SOUND_CLOUD,
      {
        name: getRandomName(),
        link: { id: 'invalid/invalid' },
      },
      { checkResponse: true },
    ).then((response) => {
      expect(response.statusCode).eq(400);
      expect(response.body.detail).eq(ERROR_MSG.ERROR_INVALID_LINK);
    });
  });

  it('Create a Pulse - Link Content - SoundCloud - Invalid Link', () => {
    const { isContentType, isLinkType } = isContentTypeOf(SOUND_CLOUD);
    const content = {
      name: getRandomName(),
      link: { url: 'invalid' },
    };

    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(SOUND_CLOUD);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, SOUND_CLOUD);
    PulseElements.inputNameNewContent().click();

    cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_SOUND_CLOUD_LINK_FIELD);
  });

  it('Create a Pulse - Link Content - SoundCloud - Without name', () => {
    const name = getRandomName();
    cy.FixturesContent().then((content: FixtureContent) => {
      cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
      cy.ChannelNewPulse();
      cy.PulseSelectType(SOUND_CLOUD);
      PulseElements.inputLinkNewContent().clear().type(content.link.soundcloud.link);
      PulseElements.inputNameContentLink().type(name, { force: true });
      PulseElements.inputNameContentLink().clear();
      PulseElements.inputLinkNewContent().click();

      cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_REQUIRED_FIELD);
    });
  });

  it('Create a Pulse - Link Content - SoundCloud - Invalid ID', () => {
    cy.PulseCreateWithError(
      channelCreatedBefore.id,
      SOUND_CLOUD,
      {
        name: getRandomName(),
        link: { id: 'invalid/invalid' },
      },
      { checkResponse: true },
    ).then((response) => {
      expect(response.statusCode).eq(StatusCode.BadRequest);
      expect(response.body.detail).eq(ERROR_MSG.ERROR_INVALID_LINK);
    });
  });

  it('Create a Pulse - Link Content - SoundCloud - Invalid Link', () => {
    const { isContentType, isLinkType } = isContentTypeOf(SOUND_CLOUD);
    const content = {
      name: getRandomName(),
      link: { url: 'invalid' },
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(SOUND_CLOUD);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, SOUND_CLOUD);
    PulseElements.inputNameNewContent().click();

    cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_SOUND_CLOUD_LINK_FIELD);
  });

  it('Create a Pulse - Link Content - GoogleDrive - Invalid ID', () => {
    cy.PulseCreateWithError(
      channelCreatedBefore.id,
      GOOGLE_DRIVE,
      {
        name: getRandomName(),
        link: { id: 'document/d/invalid/' },
      },
      { checkResponse: true },
    ).then((response) => {
      expect(response.statusCode).eq(StatusCode.BadRequest);
      expect(response.body.detail).eq(ERROR_MSG.ERROR_SHAREABLE_LINK);
    });
  });

  it('Create a Pulse - Link Content - GoogleDrive - Invalid Link', () => {
    const { isContentType, isLinkType } = isContentTypeOf(GOOGLE_DRIVE);
    const content = {
      name: getRandomName(),
      link: { url: 'invalid' },
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(GOOGLE_DRIVE);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, GOOGLE_DRIVE);
    PulseElements.inputNameNewContent().click();

    cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_GOOGLE_DRIVE_LINK_FIELD);
  });

  it('Create a Pulse - Link Content - GoogleDrive - Without name', () => {
    const name = getRandomName();
    cy.FixturesContent().then((content: FixtureContent) => {
      cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
      cy.ChannelNewPulse();
      cy.PulseSelectType(GOOGLE_DRIVE);
      PulseElements.inputLinkNewContent().clear().type(content.link.googledrive.doc.link);
      PulseElements.inputNameContentLink().type(name, { force: true });
      PulseElements.inputNameContentLink().clear();
      PulseElements.inputLinkNewContent().click();

      cy.PulseValidRequireMessageFileContent(ERROR_MSG.ERROR_REQUIRED_FIELD);
    });
  });

  afterEach(() => {
    cy.APIChannelDelete(channelCreatedBefore.id).then((response) => {
      expect(response.status).eq(StatusCode.NoContent);
    });
  });
});
