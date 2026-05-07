import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CORE_CONFIG } from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ContentButtonService } from './content-button.service';
import { KpContentFormDialogComponent } from './content-dialog.component';
import { ContentDialogService } from './content-dialog.service';
import { CONTENT_DIALOG_APP, CONTENT_DIALOG_MODULE, ContentButton } from './models';

describe('KpContentFormDialogComponent', () => {
  let component: KpContentFormDialogComponent;
  let fixture: ComponentFixture<KpContentFormDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<KpContentFormDialogComponent>>;
  let mockContentDialogService: jest.Mocked<ContentDialogService>;
  let mockContentButtonService: jest.Mocked<ContentButtonService>;
  let mockMatDialog: jest.Mocked<MatDialog>;
  let mockDomSanitizer: jest.Mocked<DomSanitizer>;
  let mockFormGroup: UntypedFormGroup;

  beforeEach(async () => {
    mockFormGroup = new UntypedFormBuilder().group({
      value: [''],
      name: [''],
      time: [''],
    });

    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<KpContentFormDialogComponent>>;

    mockContentDialogService = {
      displayMessageTypeNotAccepted: jest.fn(),
      displayMessageFileSizeExceeded: jest.fn(),
      loadSoundcloud: jest.fn(() => of({ html: '<div>test</div>' })),
      loadVimeo: jest.fn(() => of({ html: '<div>test</div>' })),
      imageUploader: jest.fn(() => of({ url: 'test-url' })),
    } as unknown as jest.Mocked<ContentDialogService>;

    mockContentButtonService = {
      getButtons: jest.fn(() => [
        new ContentButton('File', null, null, 'FILE', false, 'file_upload'),
        new ContentButton('Link', null, null, 'LINK', false, 'link'),
        new ContentButton('Quiz', null, null, 'QUIZ', false, 'quiz', true),
      ]),
      getUploadFileButtons: jest.fn(() => [new ContentButton('Video', null, null, 'VIDEO', false, 'video')]),
      getLinkButtons: jest.fn(() => [new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube')]),
      getHTMLButtons: jest.fn(() => [new ContentButton('Genially', null, null, 'GENIALLY', false, 'genially')]),
      getQuizButtons: jest.fn(() => [
        new ContentButton('Evaluative Quiz', null, 'quiz', 'EVALUATIVE_QUIZ', false),
        new ContentButton('Survey Quiz', null, 'poll', 'SURVEY_QUIZ', false),
      ]),
      createContentForm: jest.fn(() => mockFormGroup),
    } as unknown as jest.Mocked<ContentButtonService>;

    mockMatDialog = {
      open: jest.fn(() => ({
        afterClosed: jest.fn(() => of(null)),
      })),
    } as unknown as jest.Mocked<MatDialog>;

    mockDomSanitizer = {
      bypassSecurityTrustHtml: jest.fn((html) => html),
    } as unknown as jest.Mocked<DomSanitizer>;

    await TestBed.configureTestingModule({
      imports: [KpContentFormDialogComponent, NoopAnimationsModule, getTranslocoTestingModule()],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ContentDialogService, useValue: mockContentDialogService },
        { provide: ContentButtonService, useValue: mockContentButtonService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: DomSanitizer, useValue: mockDomSanitizer },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            app: CONTENT_DIALOG_APP.SMARTZAP,
            moduleName: CONTENT_DIALOG_MODULE.PULSE,
          },
        },

        { provide: HttpClient, useValue: {} },
        { provide: CORE_CONFIG, useValue: { apis: { apiKonquestUrl: '' } } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    TestBed.overrideComponent(KpContentFormDialogComponent, {
      set: {
        providers: [
          { provide: ContentDialogService, useValue: mockContentDialogService },
          { provide: ContentButtonService, useValue: mockContentButtonService },
        ],
      },
    });
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(KpContentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('getters', () => {
    beforeEach(() => {
      createComponent();
      component.contentForm = mockFormGroup;
    });

    it('should return value control', () => {
      expect(component.value).toBe(mockFormGroup.get('value'));
    });

    it('should return name control', () => {
      expect(component.name).toBe(mockFormGroup.get('name'));
    });

    it('should return time control', () => {
      expect(component.time).toBe(mockFormGroup.get('time'));
    });

    it('should return false for isInsideFile when no file selected', () => {
      component.selectedType = 'FILE';
      component.subButtonSelected = new ContentButton('Video', null, null, 'VIDEO', false, 'video');
      component.selectedFileName = '';

      expect(component.isInsideFile).toBe(false);
    });

    it('should return true for isInsideFile when file selected', () => {
      component.selectedType = 'FILE';
      component.subButtonSelected = new ContentButton('Video', null, null, 'VIDEO', false, 'video');
      component.selectedFileName = 'test.mp4';

      expect(component.isInsideFile).toBe(true);
    });

    it('should return correct placeholder for content name', () => {
      component.selectedType = 'QUIZ';
      expect(component.contentNamePlaceholder).toContain('EXAM');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should close dialog with form data for SMARTZAP', () => {
      component.contentForm = mockFormGroup;
      component.data.app = CONTENT_DIALOG_APP.SMARTZAP;

      component.onSubmit();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should close dialog with form data for KONQUEST', () => {
      component.contentForm = mockFormGroup;
      component.data.app = CONTENT_DIALOG_APP.KONQUEST;
      component.coverImage = 'test-cover.jpg';

      component.onSubmit();

      const formData = mockDialogRef.close.mock.calls[0][0];
      expect(formData.coverImage).toBe('test-cover.jpg');
    });
  });

  describe('back', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should reset component state when messagesContentEmbed is false', () => {
      component.selectedType = 'FILE';
      component.subButtonSelected = new ContentButton('Video', null, null, 'VIDEO', false, 'video');
      component.selectedFileName = 'test.mp4';
      component.contentForm = mockFormGroup;
      component.coverImage = 'test-cover.jpg';

      component.back();

      expect(component.selectedType).toBeUndefined();
      expect(component.subButtonSelected).toBeUndefined();
      expect(component.selectedFileName).toBe('');
      expect(component.coverImage).toBe('');
      expect(component.contentForm).toBeUndefined();
    });

    it('should reset state when messagesContentEmbed is true', () => {
      component.messagesContentEmbed = true;
      component.selectedType = 'FILE';
      component.subButtonSelected = new ContentButton('Video', null, null, 'VIDEO', false, 'video');
      component.selectedFileName = 'test.mp4';
      component.contentForm = mockFormGroup;
      component.coverImage = 'test-cover.jpg';

      component.back();

      expect(component.selectedType).toBeUndefined();
      expect(component.subButtonSelected).toBeUndefined();
      expect(component.selectedFileName).toBe('');
      expect(component.coverImage).toBe('');
      expect(component.contentForm).toBeUndefined();
      expect(mockContentButtonService.getButtons).toHaveBeenCalled();
      expect(mockContentButtonService.getUploadFileButtons).not.toHaveBeenCalled();
    });
  });

  describe('clearUploadInput', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should clear file input', () => {
      component.selectedFileName = 'test.mp4';

      component.clearUploadInput();

      expect(component.selectedFileName).toBe('');
    });
  });

  describe('onSelectFile', () => {
    const createFileEvent = (file: File): Event => {
      return { target: { files: { length: 1, item: () => file } } } as unknown as Event;
    };

    beforeEach(() => {
      createComponent();
      component.acceptType = ContentButtonService.ACCEPT_FILE_IMAGE;
      component.contentForm = mockFormGroup;
    });

    it('should do nothing when target has no files', () => {
      const event = { target: { files: null } } as unknown as Event;

      component.onSelectFile(event);

      expect(mockContentDialogService.displayMessageTypeNotAccepted).not.toHaveBeenCalled();
    });

    it('should do nothing when FileList is empty', () => {
      const event = { target: { files: { length: 0, item: () => null } } } as unknown as Event;

      component.onSelectFile(event);

      expect(mockContentDialogService.displayMessageTypeNotAccepted).not.toHaveBeenCalled();
    });

    it('should call back and displayMessageTypeNotAccepted when file type is not accepted', () => {
      const file = { name: 'test.mp4', type: ContentButtonService.ACCEPT_FILE_VIDEO[0], size: 100 } as File;
      const displaySpy = jest.spyOn(mockContentDialogService, 'displayMessageTypeNotAccepted');

      component.onSelectFile(createFileEvent(file));

      expect(displaySpy).toHaveBeenCalled();
    });

    it('should set selectedFileName and patch form when file type is valid', () => {
      const file = { name: 'test.jpg', type: ContentButtonService.ACCEPT_FILE_IMAGE[0], size: 100 } as File;

      component.onSelectFile(createFileEvent(file));

      expect(component.selectedFileName).toBe('test.jpg');
    });

    describe('when messagesContentEmbed is true', () => {
      beforeEach(() => {
        component.messagesContentEmbed = true;
      });

      it('should reject image file exceeding 5MB', () => {
        component.subButtonSelected = new ContentButton('Image', null, null, 'IMAGE', false, 'image');
        const file = {
          name: 'large.jpg',
          type: ContentButtonService.ACCEPT_FILE_IMAGE[0],
          size: 6 * 1024 * 1024,
        } as File;

        component.onSelectFile(createFileEvent(file));

        expect(mockContentDialogService.displayMessageFileSizeExceeded).toHaveBeenCalledWith(5);
      });

      it('should reject non-image file exceeding 16MB', () => {
        component.acceptType = ContentButtonService.ACCEPT_FILE_VIDEO;
        component.subButtonSelected = new ContentButton('Video', null, null, 'VIDEO', false, 'video');
        const file = {
          name: 'large.mp4',
          type: ContentButtonService.ACCEPT_FILE_VIDEO[0],
          size: 17 * 1024 * 1024,
        } as File;

        component.onSelectFile(createFileEvent(file));

        expect(mockContentDialogService.displayMessageFileSizeExceeded).toHaveBeenCalledWith(16);
      });

      it('should apply file when size is within limit', () => {
        component.subButtonSelected = new ContentButton('Image', null, null, 'IMAGE', false, 'image');
        const file = { name: 'small.jpg', type: ContentButtonService.ACCEPT_FILE_IMAGE[0], size: 1024 } as File;

        component.onSelectFile(createFileEvent(file));

        expect(component.selectedFileName).toBe('small.jpg');
      });
    });

    it('should update buttons when selectedType is FILE and subButtonSelected is set', () => {
      component.acceptType = ContentButtonService.ACCEPT_FILE_VIDEO;
      const subButton = new ContentButton('Video', null, null, 'VIDEO', false, 'video');
      component.selectedType = 'FILE';
      component.subButtonSelected = subButton;
      const file = { name: 'test.mp4', type: ContentButtonService.ACCEPT_FILE_VIDEO[0], size: 1024 } as File;

      component.onSelectFile(createFileEvent(file));

      expect(component.buttons).toEqual([subButton]);
    });

    it('should disable value control when subButtonSelected type is GENIALLY', () => {
      component.acceptType = ContentButtonService.ACCEPT_FILE_TYPES_ZIP;
      component.subButtonSelected = new ContentButton('Genially', null, null, 'GENIALLY', false, 'genially');
      const file = { name: 'test.zip', type: ContentButtonService.ACCEPT_FILE_TYPES_ZIP[0], size: 1024 } as File;
      jest.spyOn(component.value, 'disable');

      component.onSelectFile(createFileEvent(file));

      expect(component.value.disable).toHaveBeenCalled();
    });
  });

  describe('remaining getters', () => {
    beforeEach(() => {
      createComponent();
      component.contentForm = mockFormGroup;
    });

    describe('isExternalLinkInput', () => {
      it('should be true when selectedType is LINK and subButton is set', () => {
        component.selectedType = 'LINK';
        component.subButtonSelected = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
        component.selectedFileName = '';

        expect(component.isExternalLinkInput).toBe(true);
      });

      it('should be true when subButtonSelected type is GENIALLY', () => {
        component.subButtonSelected = new ContentButton('Genially', null, null, 'GENIALLY', false, 'genially');
        component.selectedFileName = '';

        expect(component.isExternalLinkInput).toBe(true);
      });

      it('should be false when selectedFileName is set', () => {
        component.selectedType = 'LINK';
        component.subButtonSelected = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
        component.selectedFileName = 'file.mp4';

        expect(component.isExternalLinkInput).toBe(false);
      });

      it('should be false when no relevant type or subButton', () => {
        component.selectedType = 'FILE';
        component.subButtonSelected = undefined;

        expect(component.isExternalLinkInput).toBe(false);
      });
    });

    describe('isNameInput', () => {
      it('should be true when selectedType is QUIZ', () => {
        component.selectedType = 'QUIZ';
        expect(component.isNameInput).toBe(true);
      });

      it('should be true when subButtonSelected type is SCORM', () => {
        component.subButtonSelected = new ContentButton('SCORM', null, null, 'SCORM', false, 'scorm');
        expect(component.isNameInput).toBe(true);
      });

      it('should be true when selectedType is LINK and subButton is set', () => {
        component.selectedType = 'LINK';
        component.subButtonSelected = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
        expect(component.isNameInput).toBe(true);
      });

      it('should be false when no relevant type or subButton', () => {
        component.selectedType = 'FILE';
        component.subButtonSelected = undefined;
        expect(component.isNameInput).toBe(false);
      });
    });

    describe('isNameInputReadonly', () => {
      it('should be true when no subButton is selected and selectedType is not QUIZ', () => {
        component.subButtonSelected = undefined;
        component.selectedType = 'FILE';

        expect(component.isNameInputReadonly).toBe(true);
      });

      it('should be false when a subButton is selected', () => {
        component.subButtonSelected = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
        expect(component.isNameInputReadonly).toBe(false);
      });

      it('should be false when selectedType is QUIZ', () => {
        component.subButtonSelected = undefined;
        component.selectedType = 'QUIZ';

        expect(component.isNameInputReadonly).toBe(false);
      });
    });

    describe('isHTMLTypeInput', () => {
      it('should be true when subButtonSelected type is GENIALLY', () => {
        component.subButtonSelected = new ContentButton('Genially', null, null, 'GENIALLY', false, 'genially');
        expect(component.isHTMLTypeInput).toBe(true);
      });

      it('should be true when subButtonSelected type is H5P', () => {
        component.subButtonSelected = new ContentButton('H5P', null, null, 'H5P', false, 'h5p');
        expect(component.isHTMLTypeInput).toBe(true);
      });

      it('should be true when subButtonSelected type is SCORM', () => {
        component.subButtonSelected = new ContentButton('SCORM', null, null, 'SCORM', false, 'scorm');
        expect(component.isHTMLTypeInput).toBe(true);
      });

      it('should be false for other types', () => {
        component.subButtonSelected = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
        expect(component.isHTMLTypeInput).toBe(false);
      });
    });

    describe('gifSrcValue', () => {
      it('should return the correct gif URL for the selected subButton type', () => {
        component.subButtonSelected = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
        expect(component.gifSrcValue).toContain('YOUTUBE');
      });
    });

    describe('showCoverImageUpload', () => {
      it('should be true when moduleName is PULSE and subButtonSelected type is YOUTUBE', () => {
        component.moduleName = CONTENT_DIALOG_MODULE.PULSE;
        component.subButtonSelected = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
        expect(component.showCoverImageUpload).toBe(true);
      });

      it('should be false when moduleName is not PULSE', () => {
        component.moduleName = null;
        component.subButtonSelected = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
        expect(component.showCoverImageUpload).toBe(false);
      });

      it('should be false when subButtonSelected type is not in the allowed list', () => {
        component.moduleName = CONTENT_DIALOG_MODULE.PULSE;
        component.subButtonSelected = new ContentButton('PDF', null, null, 'PDF', false, 'pdf');
        expect(component.showCoverImageUpload).toBe(false);
      });
    });

    describe('isEvaluativeOrSurveyQuiz', () => {
      it('should be true when subButtonSelected type is EVALUATIVE_QUIZ', () => {
        component.subButtonSelected = new ContentButton('Evaluative', null, 'quiz', 'EVALUATIVE_QUIZ', false);
        expect(component.isEvaluativeOrSurveyQuiz).toBe(true);
      });

      it('should be true when subButtonSelected type is SURVEY_QUIZ', () => {
        component.subButtonSelected = new ContentButton('Survey', null, 'poll', 'SURVEY_QUIZ', false);
        expect(component.isEvaluativeOrSurveyQuiz).toBe(true);
      });

      it('should be false for other types', () => {
        component.subButtonSelected = new ContentButton('Quiz', null, null, 'QUIZ', false, 'quiz');
        expect(component.isEvaluativeOrSurveyQuiz).toBe(false);
      });
    });
  });

  describe('onSelectContent', () => {
    beforeEach(() => {
      createComponent();
      jest.spyOn(component.uploadInput.nativeElement, 'click').mockImplementation(() => {});
    });

    it('should set selectedType to FILE and call getUploadFileButtons for FILE button', () => {
      const button = new ContentButton('File', null, null, 'FILE', false, 'file_upload');

      component.onSelectContent(button);

      expect(component.selectedType).toBe('FILE');
      expect(mockContentButtonService.getUploadFileButtons).toHaveBeenCalled();
    });

    it('should set selectedType to LINK and call getLinkButtons for LINK button', () => {
      const button = new ContentButton('Link', null, null, 'LINK', false, 'link');

      component.onSelectContent(button);

      expect(component.selectedType).toBe('LINK');
      expect(mockContentButtonService.getLinkButtons).toHaveBeenCalled();
    });

    it('should set selectedType to HTML and call getHTMLButtons for HTML button', () => {
      const button = new ContentButton('HTML', null, null, 'HTML', false, 'html');

      component.onSelectContent(button);

      expect(component.selectedType).toBe('HTML');
      expect(mockContentButtonService.getHTMLButtons).toHaveBeenCalled();
    });

    it('should set selectedType to FILE and set subButtonSelected for VIDEO button', () => {
      const button = new ContentButton('Video', null, null, 'VIDEO', false, 'video');

      component.onSelectContent(button);

      expect(component.selectedType).toBe('FILE');
      expect(component.subButtonSelected).toBe(button);
    });

    it('should click the upload input for VIDEO button', () => {
      const button = new ContentButton('Video', null, null, 'VIDEO', false, 'video');

      component.onSelectContent(button);

      expect(component.uploadInput.nativeElement.click).toHaveBeenCalled();
    });

    it('should set selectedType to LINK and set subButtonSelected for YOUTUBE button', () => {
      const button = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');

      component.onSelectContent(button);

      expect(component.selectedType).toBe('LINK');
      expect(component.subButtonSelected).toBe(button);
    });

    it('should set selectedType to HTML and set subButtonSelected for GENIALLY button', () => {
      const button = new ContentButton('Genially', null, null, 'GENIALLY', false, 'genially');

      component.onSelectContent(button);

      expect(component.selectedType).toBe('HTML');
      expect(component.subButtonSelected).toBe(button);
    });

    it('should set selectedType to QUIZ and call createContentForm for EVALUATIVE_QUIZ button', () => {
      const button = new ContentButton('Evaluative', null, 'quiz', 'EVALUATIVE_QUIZ', false);

      component.onSelectContent(button);

      expect(component.selectedType).toBe('QUIZ');
      expect(mockContentButtonService.createContentForm).toHaveBeenCalledWith('EVALUATIVE_QUIZ');
    });

    describe('with KONQUEST app', () => {
      it('should close the dialog with type QUIZ when QUIZ button is selected', () => {
        component.data.app = CONTENT_DIALOG_APP.KONQUEST;
        const button = new ContentButton('Quiz', null, null, 'QUIZ', false, 'quiz');

        component.onSelectContent(button);

        expect(mockDialogRef.close).toHaveBeenCalledWith({ type: 'QUIZ' });
      });
    });

    describe('with SMARTZAP app', () => {
      beforeEach(() => {
        (mockContentButtonService as any).getSmartZapQuizButtons = jest.fn(() => []);
      });

      it('should call getSmartZapQuizButtons when QUIZ button is selected', () => {
        const button = new ContentButton('Quiz', null, null, 'QUIZ', false, 'quiz');

        component.onSelectContent(button);

        expect((mockContentButtonService as any).getSmartZapQuizButtons).toHaveBeenCalled();
      });
    });
  });

  describe('handleYouTube', () => {
    beforeEach(() => {
      createComponent();
      component.contentForm = mockFormGroup;
      const youtubeButton = new ContentButton('YouTube', null, null, 'YOUTUBE', false, 'youtube');
      component.onSelectContent(youtubeButton);
    });

    const cases: [string, string][] = [
      ['standard URL', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
      ['standard URL with extra params', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123'],
      ['short URL', 'https://youtu.be/dQw4w9WgXcQ'],
      ['short URL with query params', 'https://youtu.be/dQw4w9WgXcQ?t=30'],
      ['live URL', 'https://www.youtube.com/live/dQw4w9WgXcQ'],
      ['live URL with query params', 'https://www.youtube.com/live/dQw4w9WgXcQ?feature=share'],
    ];

    cases.forEach(([label, url]) => {
      it(`should embed correct video ID for ${label}`, () => {
        mockFormGroup.get('value')!.setValue(url);
        expect(mockDomSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          expect.stringContaining('https://www.youtube.com/embed/dQw4w9WgXcQ'),
        );
      });
    });
  });

  describe('coverImageChange', () => {
    beforeEach(() => createComponent());

    it('should update coverImage with the provided value', () => {
      component.coverImageChange('https://example.com/cover.jpg');

      expect(component.coverImage).toBe('https://example.com/cover.jpg');
    });
  });

  describe('when messagesContentEmbed is true', () => {
    beforeEach(() => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: { app: CONTENT_DIALOG_APP.SMARTZAP, messagesContentEmbed: true },
      });
      createComponent();
    });

    it('should call getButtons instead of getUploadFileButtons on init', () => {
      expect(mockContentButtonService.getButtons).toHaveBeenCalledWith(CONTENT_DIALOG_APP.SMARTZAP, true);
      expect(mockContentButtonService.getUploadFileButtons).not.toHaveBeenCalled();
    });

    it('should not pre-select a type on init', () => {
      expect(component.selectedType).toBeUndefined();
    });

    it('should not pre-set contentForm on init', () => {
      expect(component.contentForm).toBeUndefined();
    });

    it('should not render the back button when no type is selected', () => {
      const backButton = fixture.nativeElement.querySelector('[data-test="button-back"]');

      expect(backButton).toBeNull();
    });
  });
});
