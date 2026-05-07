import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ContentButtonService } from './content-button.service';
import { CONTENT_DIALOG_APP, CONTENT_DIALOG_MODULE, LearnContentType } from './models';

describe('ContentButtonService', () => {
  let service: ContentButtonService;
  let formBuilder: UntypedFormBuilder;

  beforeEach(() => {
    formBuilder = new UntypedFormBuilder();
    service = new ContentButtonService(formBuilder);
  });

  describe('Static Properties', () => {
    it('should have correct ACCEPT_FILE_TYPES constants', () => {
      expect(ContentButtonService.ACCEPT_FILE_TYPES_ZIP).toEqual(['application/zip', 'application/x-zip-compressed']);
      expect(ContentButtonService.ACCEPT_FILE_VIDEO).toEqual(['video/mp4', 'video/webm']);
      expect(ContentButtonService.ACCEPT_FILE_IMAGE).toEqual(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    });

    it('should have ACCEPT_TYPES map with correct values', () => {
      const acceptTypes = ContentButtonService.ACCEPT_TYPES;

      expect(acceptTypes.get('VIDEO')).toEqual(ContentButtonService.ACCEPT_FILE_VIDEO);
      expect(acceptTypes.get('IMAGE')).toEqual(ContentButtonService.ACCEPT_FILE_IMAGE);
      expect(acceptTypes.get('PDF')).toEqual(ContentButtonService.ACCEPT_FILE_PDF);
      expect(acceptTypes.get('GENIALLY')).toEqual(ContentButtonService.ACCEPT_FILE_TYPES_ZIP);
    });
  });

  describe('getButtons', () => {
    it('should return FILE, QUIZ and LINK buttons for SMARTZAP app when messagesContentEmbed is false', () => {
      const buttons = service.getButtons(CONTENT_DIALOG_APP.SMARTZAP, false);

      expect(buttons).toHaveLength(3);
      expect(buttons[0].type).toBe('FILE');
      expect(buttons[1].type).toBe('QUIZ');
      expect(buttons[2].type).toBe('LINK');
    });

    it('should return FILE and QUIZ buttons for SMARTZAP app when messagesContentEmbed is true', () => {
      const buttons = service.getButtons(CONTENT_DIALOG_APP.SMARTZAP, true);

      expect(buttons).toHaveLength(2);
      expect(buttons[0].type).toBe('FILE');
      expect(buttons[1].type).toBe('QUIZ');
    });

    it('should include HTML button for KONQUEST app when messagesContentEmbed is false', () => {
      const buttons = service.getButtons(CONTENT_DIALOG_APP.KONQUEST, false);

      expect(buttons).toHaveLength(4);
      expect(buttons.map((b) => b.type)).toEqual(['FILE', 'QUIZ', 'LINK', 'HTML']);
    });

    it('should include FILE, QUIZ and HTML buttons for KONQUEST app when messagesContentEmbed is true', () => {
      const buttons = service.getButtons(CONTENT_DIALOG_APP.KONQUEST, true);

      expect(buttons).toHaveLength(3);
      expect(buttons.map((b) => b.type)).toEqual(['FILE', 'QUIZ', 'HTML']);
    });
  });

  describe('getUploadFileButtons', () => {
    it('should return basic upload buttons for SMARTZAP app', () => {
      const buttons = service.getUploadFileButtons(CONTENT_DIALOG_APP.SMARTZAP);

      expect(buttons).toHaveLength(4);
      expect(buttons.map((b) => b.type)).toEqual(['VIDEO', 'IMAGE', 'PODCAST', 'PDF']);
    });

    it('should include Office buttons for KONQUEST app', () => {
      const buttons = service.getUploadFileButtons(CONTENT_DIALOG_APP.KONQUEST);

      expect(buttons).toHaveLength(7);
      expect(buttons.map((b) => b.type)).toEqual(['VIDEO', 'IMAGE', 'PODCAST', 'PDF', 'WORD', 'POWERPOINT', 'EXCEL']);
    });
  });

  describe('getLinkButtons', () => {
    it('should return only YouTube and Vimeo for SMARTZAP app', () => {
      const buttons = service.getLinkButtons(CONTENT_DIALOG_APP.SMARTZAP);

      expect(buttons).toHaveLength(2);
      expect(buttons[0].type).toBe('YOUTUBE');
      expect(buttons[1].type).toBe('VIMEO');
    });

    it('should include external link for pulse module', () => {
      const buttons = service.getLinkButtons(CONTENT_DIALOG_APP.KONQUEST, 'pulse' as CONTENT_DIALOG_MODULE);

      expect(buttons).toHaveLength(5);
      expect(buttons[2].type).toBe('EXTERNAL_LINK');
    });

    it('should include SoundCloud and Google Drive for non-SMARTZAP apps', () => {
      const buttons = service.getLinkButtons(CONTENT_DIALOG_APP.KONQUEST);

      expect(buttons.length).toBeGreaterThan(2);
      const types = buttons.map((b) => b.type);
      expect(types).toContain('SOUNDCLOUD');
      expect(types).toContain('GOOGLE_DRIVE');
    });
  });

  describe('getHTMLButtons', () => {
    it('should return Genially and H5P for any module', () => {
      const buttons = service.getHTMLButtons(CONTENT_DIALOG_MODULE.MISSION);

      expect(buttons.length).toBeGreaterThanOrEqual(2);
      expect(buttons[0].type).toBe('GENIALLY');
      expect(buttons[1].type).toBe('H5P');
    });

    it('should include SCORM for MISSION module', () => {
      const buttons = service.getHTMLButtons(CONTENT_DIALOG_MODULE.MISSION);

      expect(buttons).toHaveLength(3);
      expect(buttons[2].type).toBe('SCORM');
    });

    it('should not include SCORM for non-MISSION modules', () => {
      const buttons = service.getHTMLButtons(CONTENT_DIALOG_MODULE.PULSE);

      expect(buttons).toHaveLength(2);
      expect(buttons.map((b) => b.type)).not.toContain('SCORM');
    });
  });

  describe('createContentForm', () => {
    it('should return form group for valid content type', () => {
      const form = service.createContentForm('FILE' as LearnContentType);

      expect(form).toBeInstanceOf(UntypedFormGroup);
    });

    it('should return undefined for invalid content type', () => {
      const form = service.createContentForm('INVALID_TYPE' as LearnContentType);

      expect(form).toBeUndefined();
    });
  });

  describe('getQuizButtons', () => {
    it('should return evaluative and survey quiz buttons', () => {
      const buttons = service.getSmartZapQuizButtons();

      expect(buttons).toHaveLength(2);
      expect(buttons[0].type).toBe('EVALUATIVE_QUIZ');
      expect(buttons[1].type).toBe('SURVEY_QUIZ');
    });

    it('should have correct icons for quiz buttons', () => {
      const buttons = service.getSmartZapQuizButtons();

      expect(buttons[0].icon).toBe('quiz');
      expect(buttons[1].icon).toBe('poll');
    });
  });
});
