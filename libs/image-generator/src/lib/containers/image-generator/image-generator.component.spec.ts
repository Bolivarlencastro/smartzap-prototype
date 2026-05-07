import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageGeneratorApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ImageWizardService } from '../../services/image-wizard.service';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ImageGeneratorComponent } from './image-generator.component';

describe('ImageGeneratorComponent', () => {
  let component: ImageGeneratorComponent;
  let fixture: ComponentFixture<ImageGeneratorComponent>;
  let imageWizardMock: jest.Mocked<ImageWizardService>;

  beforeEach(async () => {
    imageWizardMock = {
      init: jest.fn(),
      setUploadType: jest.fn(),
      setImage: jest.fn(),
      setStep: jest.fn(),
      setImageToCrop: jest.fn(),
      setImageToCropFromUrl: jest.fn(),
      setCroppedImage: jest.fn(),
      wizardViewMode: signal(null),
      wizardUploadType: signal(null),
      image: signal(null),
      aspectRatio: signal(null),
      wizardType: signal(null),
      wizardStep: signal(null),
    } as unknown as jest.Mocked<ImageWizardService>;

    await TestBed.configureTestingModule({
      imports: [ImageGeneratorComponent, getTranslocoTestingModule()],
    }).compileComponents();

    TestBed.overrideComponent(ImageGeneratorComponent, {
      add: {
        providers: [
          { provide: ImageWizardService, useValue: imageWizardMock },
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: { uploadType: 'COURSE_CARD', rootImage: null } },
          { provide: ImageGeneratorApi, useValue: {} },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      },
    });

    fixture = TestBed.createComponent(ImageGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the core config on init', () => {
    expect(imageWizardMock.init).toHaveBeenCalledWith({ uploadType: 'COURSE_CARD', rootImage: null }, {});
  });

  it('should go to crop step after the initial file', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

    component.goToCrop(file);

    expect(imageWizardMock.setImageToCrop).toHaveBeenCalledWith(file);
    expect(imageWizardMock.setStep).toHaveBeenCalledWith('IMAGE_CROP');
  });

  it('should go back to image definition step', () => {
    component.goToImageDefinition();

    expect(imageWizardMock.setStep).toHaveBeenCalledWith('IMAGE_DEFINITION');
    expect(imageWizardMock.setImageToCrop).toHaveBeenCalledWith(null);
    expect(imageWizardMock.setImageToCropFromUrl).toHaveBeenCalledWith(null);
  });

  it('should go to frame definition step with cropped image', () => {
    const croppedImage = 'data:image/jpeg;base64,test-base64-string';

    component.goToFrameDefinition(croppedImage);

    expect(imageWizardMock.setCroppedImage).toHaveBeenCalledWith(croppedImage);
    expect(imageWizardMock.setStep).toHaveBeenCalledWith('FRAME_SELECTION');
  });
});
