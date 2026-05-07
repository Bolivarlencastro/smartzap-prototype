import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { CONTENT_DIALOG_APP, CONTENT_DIALOG_MODULE, ContentButton, ContentFormMap, LearnContentType } from './models';

// CONTENT BUTTONS
marker('UI.KP_CONTENT_DIALOG.BUTTON.YOUTUBE');
marker('UI.KP_CONTENT_DIALOG.BUTTON.VIMEO');
marker('UI.KP_CONTENT_DIALOG.BUTTON.SOUNDCLOUD');
marker('UI.KP_CONTENT_DIALOG.BUTTON.GOOGLE_DRIVE');
marker('UI.KP_CONTENT_DIALOG.BUTTON.GENIALLY');

@Injectable()
export class ContentButtonService {
  public static readonly ACCEPT_FILE_TYPES_ZIP = ['application/zip', 'application/x-zip-compressed'];
  public static readonly ACCEPT_FILE_VIDEO = ['video/mp4', 'video/webm'];
  public static readonly ACCEPT_FILE_IMAGE = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  public static readonly ACCEPT_FILE_PODCAST = ['audio/mpeg'];
  public static readonly ACCEPT_FILE_PDF = ['application/pdf'];
  public static readonly ACCEPT_FILE_WORD = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  public static readonly ACCEPT_FILE_POWERPOINT = [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];
  public static readonly ACCEPT_FILE_EXCEL = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  public static readonly ACCEPT_TYPES = new Map<string, string[]>([
    ['VIDEO', ContentButtonService.ACCEPT_FILE_VIDEO],
    ['IMAGE', ContentButtonService.ACCEPT_FILE_IMAGE],
    ['PODCAST', ContentButtonService.ACCEPT_FILE_PODCAST],
    ['PDF', ContentButtonService.ACCEPT_FILE_PDF],
    ['WORD', ContentButtonService.ACCEPT_FILE_WORD],
    ['POWERPOINT', ContentButtonService.ACCEPT_FILE_POWERPOINT],
    ['EXCEL', ContentButtonService.ACCEPT_FILE_EXCEL],
    ['GENIALLY', ContentButtonService.ACCEPT_FILE_TYPES_ZIP],
    ['H5P', ContentButtonService.ACCEPT_FILE_TYPES_ZIP],
    ['SCORM', ContentButtonService.ACCEPT_FILE_TYPES_ZIP],
  ]);

  constructor(private _formBuilder: UntypedFormBuilder) {}

  /**
   * Get buttons
   *
   * @returns array
   */
  getButtons(app: CONTENT_DIALOG_APP, messagesContentEmbed: boolean): ContentButton[] {
    const buttons = [
      new ContentButton(
        marker('UI.KP_CONTENT_DIALOG.BUTTON.FILE'),
        marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.FILE'),
        null,
        'FILE',
        false,
        'file_upload',
      ),
      new ContentButton(
        marker('UI.KP_CONTENT_DIALOG.BUTTON.QUIZ'),
        marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.QUIZ'),
        null,
        'QUIZ',
        false,
        'quiz',
        true,
      ),
    ];

    if (!messagesContentEmbed) {
      buttons.push(
        new ContentButton(
          marker('UI.KP_CONTENT_DIALOG.BUTTON.LINK'),
          marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.LINK'),
          null,
          'LINK',
          false,
          'link',
        ),
      );
    }

    if (app === CONTENT_DIALOG_APP.KONQUEST) {
      buttons.push(
        new ContentButton(
          marker('UI.KP_CONTENT_DIALOG.BUTTON.HTML'),
          marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.HTML'),
          null,
          'HTML',
          false,
          'html',
        ),
      );
    }
    return buttons;
  }

  /**
   * Get upload files buttons
   *
   * @returns array
   */

  getUploadFileButtons(app: CONTENT_DIALOG_APP): ContentButton[] {
    const buttons = [
      new ContentButton(
        marker('UI.KP_CONTENT_DIALOG.BUTTON.VIDEO'),
        marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.VIDEO'),
        null,
        'VIDEO',
        false,
        'video',
      ),
      new ContentButton(
        marker('UI.KP_CONTENT_DIALOG.BUTTON.IMAGE'),
        marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.IMAGE'),
        null,
        'IMAGE',
        false,
        'image',
      ),
      new ContentButton(
        marker('UI.KP_CONTENT_DIALOG.BUTTON.PODCAST'),
        marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.PODCAST'),
        null,
        'PODCAST',
        false,
        'mic',
      ),
      new ContentButton(
        marker('UI.KP_CONTENT_DIALOG.BUTTON.PDF'),
        marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.PDF'),
        null,
        'PDF',
        false,
        'document-file-pdf',
      ),
    ];

    if (app !== CONTENT_DIALOG_APP.SMARTZAP) {
      buttons.push(
        new ContentButton(
          marker('UI.KP_CONTENT_DIALOG.BUTTON.WORD'),
          marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.WORD'),
          null,
          'WORD',
          false,
          'microsoftword',
        ),
        new ContentButton(
          marker('UI.KP_CONTENT_DIALOG.BUTTON.POWERPOINT'),
          marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.POWERPOINT'),
          null,
          'POWERPOINT',
          false,
          'microsoftpowerpoint',
        ),
        new ContentButton(
          marker('UI.KP_CONTENT_DIALOG.BUTTON.EXCEL'),
          marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.EXCEL'),
          null,
          'EXCEL',
          false,
          'microsoftexcel',
        ),
      );
    }

    return buttons;
  }

  /**
   * Get link buttons
   *
   * @returns array
   */
  getLinkButtons(app: CONTENT_DIALOG_APP, moduleName?: CONTENT_DIALOG_MODULE): ContentButton[] {
    const buttons = [
      new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube'),
      new ContentButton('Vimeo', null, null, 'VIMEO', false, 'vimeo'),
    ];

    if (app === CONTENT_DIALOG_APP.SMARTZAP) {
      return buttons;
    }

    if (moduleName === 'pulse') {
      buttons.push(new ContentButton('Link', null, null, 'EXTERNAL_LINK', false, 'language'));
    }

    buttons.push(
      new ContentButton('SoundCloud', null, null, 'SOUNDCLOUD', false, 'soundcloud'),
      new ContentButton('Google Drive', null, null, 'GOOGLE_DRIVE', false, 'googledrive'),
    );

    return buttons;
  }

  /**
   * Get HTML buttons
   *
   * @returns array
   */
  getHTMLButtons(moduleName: CONTENT_DIALOG_MODULE): ContentButton[] {
    const buttons = [
      new ContentButton('Genially', null, null, 'GENIALLY', false, 'genially'),
      new ContentButton('H5P', null, null, 'H5P', false, 'h5p'),
    ];

    if (moduleName === CONTENT_DIALOG_MODULE.MISSION) {
      buttons.push(new ContentButton('Scorm', null, null, 'SCORM', false, 'scorm'));
    }

    return buttons;
  }

  /**
   *
   * Create content form
   *
   * @param contentType {ContentType}
   * @returns
   */
  createContentForm(contentType: LearnContentType): UntypedFormGroup | undefined {
    const form = ContentFormMap[contentType];
    return form ? this._formBuilder.group(form) : undefined;
  }

  getSmartZapQuizButtons(): ContentButton[] {
    return [
      new ContentButton(
        marker('UI.KP_CONTENT_DIALOG.BUTTON.EVALUATIVE_QUIZ'),
        marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.EVALUATIVE_QUIZ'),
        'quiz',
        'EVALUATIVE_QUIZ',
        false,
      ),
      new ContentButton(
        marker('UI.KP_CONTENT_DIALOG.BUTTON.SURVEY_QUIZ'),
        marker('UI.KP_CONTENT_DIALOG.BUTTON.TOOLTIP.SURVEY_QUIZ'),
        'poll',
        'SURVEY_QUIZ',
        false,
      ),
    ];
  }
}
