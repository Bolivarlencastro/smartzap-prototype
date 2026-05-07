import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ContentButtonService } from './content-button.service';
import { KpContentFormDialogComponent } from './content-dialog.component';
import { ContentDialogService } from './content-dialog.service';
import { LearnContentType } from './models';
import { ContentButton } from './models/content-button';
import { MatIconTestingModule } from '@angular/material/icon/testing';

function getContentButton(type: LearnContentType = 'PDF'): ContentButton {
  return new ContentButton('', '', '', type, false);
}

describe('KpContentFormDialogComponent', () => {
  let component: KpContentFormDialogComponent;
  let fixture: ComponentFixture<KpContentFormDialogComponent>;
  let contentDialogService: jest.Mocked<ContentDialogService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpContentFormDialogComponent, MatIconTestingModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: '',
        },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: jest.fn().mockImplementation((value) => value),
            bypassSecurityTrustResourceUrl: jest.fn().mockImplementation((value) => value),
          },
        },
        { provide: ContentDialogService, useValue: { displayMessageTypeNotAccepted: jest.fn() } },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(KpContentFormDialogComponent, { set: { providers: [{ provide: ContentButtonService }] } })
      .compileComponents();

    fixture = TestBed.createComponent(KpContentFormDialogComponent);
    component = fixture.componentInstance;
    contentDialogService = TestBed.inject(ContentDialogService) as jest.Mocked<ContentDialogService>;

    fixture.detectChanges();
  });

  describe('onSelectContent', () => {
    const cases: LearnContentType[][] = [
      ['FILE', 'VIDEO'],
      ['FILE', 'IMAGE'],
      ['FILE', 'PODCAST'],
      ['FILE', 'PDF'],
      ['FILE', 'WORD'],
      ['FILE', 'POWERPOINT'],
      ['FILE', 'EXCEL'],
      ['LINK', 'YOUTUBE'],
      ['LINK', 'VIMEO'],
      ['LINK', 'SOUNDCLOUD'],
      ['LINK', 'GOOGLE_DRIVE'],
      ['HTML', 'GENIALLY'],
      ['HTML', 'H5P'],
      ['FILE', 'FILE'],
      ['LINK', 'LINK'],
      ['HTML', 'HTML'],
      ['QUIZ', 'QUIZ'],
    ];

    test.each(cases)('should set selectedType %p for contentButton of type %p', (expectedType, contentButtonType) => {
      const button: ContentButton = getContentButton(contentButtonType);

      component.onSelectContent(button);

      expect(component.selectedType).toEqual(expectedType);
    });

    it('should call clearUploadInput', () => {
      const button: ContentButton = getContentButton();
      const clearUploadInputSpy = jest.spyOn(component, 'clearUploadInput');

      component.onSelectContent(button);

      expect(clearUploadInputSpy).toHaveBeenCalled();
    });

    it('should set the acceptType to the corresponding file MIME type', () => {
      const button: ContentButton = getContentButton();

      component.onSelectContent(button);

      expect(component.acceptType).toEqual(ContentButtonService.ACCEPT_FILE_PDF);
    });
  });

  describe('onSelectFile', () => {
    const mockFile = new File([], 'filename.mp4', { type: 'video/mp4' });
    const mockEvent = {
      target: {
        files: {
          length: 1,
          item: () => mockFile,
        },
      },
    } as any;

    it('should set the selected file name', () => {
      const button: ContentButton = getContentButton('VIDEO');

      component.onSelectContent(button);
      component.onSelectFile(mockEvent);

      expect(component.selectedFileName).toEqual(mockFile.name);
    });

    it('should set the file on the contentForm', () => {
      const button: ContentButton = getContentButton('VIDEO');

      component.onSelectContent(button);
      component.onSelectFile(mockEvent);

      expect(component.contentForm?.value).toEqual({
        name: mockFile.name,
        value: mockFile,
        description: '',
        type: 'FILE',
      });
    });

    it('should call back if the file MIME type does not match the selected button', () => {
      const button: ContentButton = getContentButton('PDF');
      const backSpy = jest.spyOn(component, 'back');

      component.onSelectContent(button);
      component.onSelectFile(mockEvent);

      expect(backSpy).toHaveBeenCalled();
    });

    it('should call displayMessageTypeNotAccepted if the file MIME type does not match the selected button', () => {
      const button: ContentButton = getContentButton('PDF');

      component.onSelectContent(button);
      component.onSelectFile(mockEvent);

      expect(contentDialogService.displayMessageTypeNotAccepted).toHaveBeenCalled();
    });
  });
});
