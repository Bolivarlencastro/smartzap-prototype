/// <reference types="cypress" />
import * as StatusCode from '../../support/constants/status-code';
let channelCreatedBefore;
import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import { ERROR_REQUIRED_FIELD } from '../../support/constants/errors-messages-pulse';
import { isContentTypeOf } from '../../support/commands/pulse-commands';
import PulseElements from '../../support/elements/pulse-elements';
import { DOC, IMAGE, PDF, PODCAST, PPT, SHEET, VIDEO } from '../../support/constants/cotent-type';

describe('Pulse File Content - Positive Scenarios', () => {
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
  it('Create a Pulse - File Content - Video - MP4', () => {
    cy.PulseCreate(channelCreatedBefore.id, VIDEO, {
      file: util.FILE_PATH_VIDEO_MP4,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidPlayableContent({ video: true });
    });
  });
  it('Create a Pulse - File Content - Image - PNG', () => {
    cy.PulseCreate(channelCreatedBefore.id, IMAGE, {
      file: util.FILE_PATH_IMAGE_PNG_2,
      thumbnail: util.FILE_PATH_IMAGE_PNG_2,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidImgContent();
    });
  });
  it('Create a Pulse - File Content - Image - JPG', () => {
    cy.PulseCreate(channelCreatedBefore.id, IMAGE, {
      file: util.FILE_PATH_IMAGE_JPG,
      thumbnail: util.FILE_PATH_IMAGE_PNG_2,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidImgContent();
    });
  });
  it('Create a Pulse - File Content - Image - JPEG', () => {
    cy.PulseCreate(channelCreatedBefore.id, IMAGE, {
      file: util.FILE_PATH_IMAGE_JPEG,
      thumbnail: util.FILE_PATH_IMAGE_PNG_2,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidImgContent();
    });
  });

  it('Create a Pulse - File Content- PoadCast - MP3', () => {
    cy.PulseCreate(channelCreatedBefore.id, PODCAST, {
      file: util.FILE_PATH_AUDIO_MP3,
      thumbnail: util.FILE_PATH_IMAGE_PNG_2,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated);
      cy.PulseValidPlayableContent({ audio: true });
    });
  });

  it('Create a Pulse - File Content- PDF', () => {
    cy.PulseCreate(channelCreatedBefore.id, PDF, {
      file: util.FILE_PATH_DOCUMENT_PDF,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated);
      cy.PulseValidPDFContent();
    });
  });

  it('Create a Pulse - File Content- Document - Docx', () => {
    cy.PulseCreate(channelCreatedBefore.id, DOC, {
      file: util.FILE_PATH_DOCUMENT_DOCX,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidDocContent();
    });
  });

  it('Create a Pulse - File Content- PowerPoint', () => {
    cy.PulseCreate(channelCreatedBefore.id, PPT, {
      file: util.FILE_PATH_DOCUMENT_PPTX,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidDocContent();
    });
  });

  it('Create a Pulse - File Content- Excel - XLSX', () => {
    cy.PulseCreate(channelCreatedBefore.id, SHEET, {
      file: util.util.FILE_PATH_DOCUMENT_XLSX,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidDocContent();
    });
  });

  it('Create a Pulse - File Content- Excel - XLS', () => {
    cy.PulseCreate(channelCreatedBefore.id, SHEET, {
      file: util.FILE_PATH_DOCUMENT_XLS,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: getRandomName(),
    }).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated).PulseValidDocContent();
    });
  });

  it('Create a pulse - Genially - File', () => {
    cy.PulseFileGeniallyCreate(channelCreatedBefore.id, util.FILE_PATH_GENIALLY).then((pulseCreated) => {
      cy.OpenPulseContent(pulseCreated);
      cy.PulseValidDocContent();
    });
  });

  afterEach(() => {
    if (channelCreatedBefore.id) {
      cy.APIChannelDelete(channelCreatedBefore.id).then((response) => {
        expect(response.status).eq(StatusCode.NoContent);
      });
    }
    channelCreatedBefore = {};
  });
});

describe('Pulse File Content - Negatives Scenarios', () => {
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

  it('Create a Pulse - File Content - Invalid Format', () => {
    cy.ChannelAccessOpen(channelCreatedBefore.id)
      .ChannelNewPulse()
      .PulseSelectType(VIDEO)
      .PulseSelectFileNewFileContent(util.FILE_PATH_INVALID)
      .PulseMessageInvalidVerify();
  });

  it('Create a Pulse - File Content - Video - Invalid Name', () => {
    const { isContentType, isLinkType } = isContentTypeOf(VIDEO);
    const content = {
      file: util.FILE_PATH_VIDEO_MP4,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: '{backspace}',
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(VIDEO);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, VIDEO);
    PulseElements.titleContentPulseFile().click();

    cy.PulseValidRequireMessageFileContent(ERROR_REQUIRED_FIELD);
  });

  it('Create a Pulse - File Content- Document - Invalid Name', () => {
    const { isContentType, isLinkType } = isContentTypeOf(DOC);
    const content = {
      file: util.FILE_PATH_DOCUMENT_DOCX,
      thumbnail: util.FILE_PATH_IMAGE_PNG_1,
      name: '{backspace}',
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(DOC);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, DOC);
    PulseElements.titleContentPulseFile().click();

    cy.PulseValidRequireMessageFileContent(ERROR_REQUIRED_FIELD);
  });

  it('Create a Pulse - File Content- PowerPoint - Invalid Name', () => {
    const { isContentType, isLinkType } = isContentTypeOf(PPT);
    const content = {
      file: util.FILE_PATH_DOCUMENT_PPTX,
      name: '{backspace}',
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(PPT);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, PPT);
    PulseElements.titleContentPulseFile().click();

    cy.PulseValidRequireMessageFileContent(ERROR_REQUIRED_FIELD);
  });

  it('Create a Pulse - File Content- Excel - Invalid Name', () => {
    const { isContentType, isLinkType } = isContentTypeOf(SHEET);
    const content = {
      file: util.util.FILE_PATH_DOCUMENT_XLSX,
      name: '{backspace}',
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(SHEET);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, SHEET);
    PulseElements.titleContentPulseFile().click();

    cy.PulseValidRequireMessageFileContent(ERROR_REQUIRED_FIELD);
  });

  it('Create a Pulse - File Content- PDF - Invalid Name', () => {
    const { isContentType, isLinkType } = isContentTypeOf(PDF);
    const content = {
      file: util.FILE_PATH_DOCUMENT_PDF,
      name: '{backspace}',
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(PDF);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, PDF);
    PulseElements.titleContentPulseFile().click();

    cy.PulseValidRequireMessageFileContent(ERROR_REQUIRED_FIELD);
  });

  it('Create a Pulse - File Content- PoadCast - Invalid Name', () => {
    const { isContentType, isLinkType } = isContentTypeOf(PODCAST);
    const content = {
      file: util.FILE_PATH_AUDIO_MP3,
      name: '{backspace}',
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(PODCAST);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, PODCAST);
    PulseElements.titleContentPulseFile().click();

    cy.PulseValidRequireMessageFileContent(ERROR_REQUIRED_FIELD);
  });

  it('Create a Pulse - File Content - Image - Invalid Name', () => {
    const { isContentType, isLinkType } = isContentTypeOf(IMAGE);
    const content = {
      file: util.FILE_PATH_IMAGE_PNG_1,
      name: '{backspace}',
    };
    cy.ChannelAccessOpen(channelCreatedBefore.id, util.WORKSPACE_DEFAULT);
    cy.ChannelNewPulse();
    cy.PulseSelectType(IMAGE);
    cy.PulseFillNewContentForm({ contentType: isContentType, linkType: isLinkType }, content, IMAGE);
    PulseElements.titleContentPulseFile().click();

    cy.PulseValidRequireMessageFileContent(ERROR_REQUIRED_FIELD);
  });

  afterEach(() => {
    if (channelCreatedBefore.id) {
      cy.APIChannelDelete(channelCreatedBefore.id).then((response) => {
        expect(response.status).eq(StatusCode.NoContent);
      });
    }
    channelCreatedBefore = {};
  });
});
