import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReferenceImagePreviewComponent } from '../../components/reference-image-preview/reference-image-preview.component';
import { AiImageUploadService } from '../../services/ai-image-upload.service';
import { ImageWizardService } from '../../services/image-wizard.service';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { AiImageGeneratorComponent } from './ai-image-generator.component';

describe('AiImageGeneratorComponent', () => {
  let component: AiImageGeneratorComponent;
  let fixture: ComponentFixture<AiImageGeneratorComponent>;
  let aiServiceMock: jest.Mocked<AiImageUploadService>;
  let wizardServiceMock: jest.Mocked<ImageWizardService>;

  beforeEach(async () => {
    aiServiceMock = {
      data: signal({ url: 'https://www.google.com' }),
      loading: signal(false),
      referenceImage: signal(null),
      sendMessage: jest.fn(),
      removeReferenceImage: jest.fn(),
      addReferenceImage: jest.fn(),
    } as unknown as jest.Mocked<AiImageUploadService>;

    wizardServiceMock = {
      setImageToCropFromUrl: jest.fn(),
      setStep: jest.fn(),
    } as unknown as jest.Mocked<ImageWizardService>;

    await TestBed.configureTestingModule({
      imports: [AiImageGeneratorComponent, getTranslocoTestingModule(), FormsModule, ReferenceImagePreviewComponent],
      providers: [
        { provide: AiImageUploadService, useValue: aiServiceMock },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: ImageWizardService, useValue: wizardServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AiImageGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('sendMessage Method', () => {
    it('should call aiImageService.sendMessage when not disabled', () => {
      component['message'].set('test message');

      component.sendMessage();

      expect(aiServiceMock.sendMessage).toHaveBeenCalledWith('test message');
    });

    it('should not call aiImageService.sendMessage when loading', () => {
      component['message'].set('');

      component.sendMessage();

      expect(aiServiceMock.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('Reference Image Methods', () => {
    it('should trigger file input click when addReferenceImage is called', () => {
      const clickSpy = jest.spyOn(component.fileInput.nativeElement, 'click');

      component.addReferenceImage();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should call removeReferenceImage on service', () => {
      component.removeReferenceImage();

      expect(aiServiceMock.removeReferenceImage).toHaveBeenCalled();
    });

    it('should process file input change and call service', () => {
      const mockFile = new File([''], 'test-image.png', { type: 'image/png' });
      Object.defineProperty(component.fileInput.nativeElement, 'files', {
        value: {
          0: mockFile,
          length: 1,
          item: () => mockFile,
        },
      });

      component.fileInputChange();
      fixture.detectChanges();

      expect(aiServiceMock.addReferenceImage).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('HostListener Events', () => {
    it('should call sendMessage when Enter key is pressed', () => {
      const sendMessageSpy = jest.spyOn(component, 'sendMessage');

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(sendMessageSpy).toHaveBeenCalled();
    });

    it('should not call sendMessage when other keys are pressed', () => {
      const sendMessageSpy = jest.spyOn(component, 'sendMessage');

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

      expect(sendMessageSpy).not.toHaveBeenCalled();
    });
  });

  it('should go to the next step when an image is selected', () => {
    const imageToCropSpy = jest.spyOn(wizardServiceMock, 'setImageToCropFromUrl');
    const setStepSpy = jest.spyOn(wizardServiceMock, 'setStep');

    component.imageSelected();

    expect(imageToCropSpy).toHaveBeenCalledWith('https://www.google.com');
    expect(setStepSpy).toHaveBeenCalledWith('IMAGE_CROP');
  });
});
