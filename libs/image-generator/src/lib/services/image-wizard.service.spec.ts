import { MatDialogRef } from '@angular/material/dialog';
import { ImageGeneratorComponent } from '../containers/image-generator/image-generator.component';
import { ImageWizardStep } from '../models/image-wizard-step';
import { ImageWizardType } from '../models/image-wizard-type';
import { ImageWizardService } from './image-wizard.service';

describe('ImageWizardService', () => {
  let service: ImageWizardService;
  let dialogRefMock: jest.Mocked<MatDialogRef<ImageGeneratorComponent>>;

  beforeEach(() => {
    dialogRefMock = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<ImageGeneratorComponent>>;

    service = new ImageWizardService();
  });

  describe('Aspect Ratio Calculations', () => {
    it('should return correct aspect ratio for COURSE_CARD', () => {
      service.init({ uploadType: 'COURSE_CARD', rootImage: null }, dialogRefMock);
      expect(service.aspectRatio()).toBeCloseTo(0.563);
    });

    it('should return correct aspect ratio for COURSE_BANNER', () => {
      service.init({ uploadType: 'COURSE_BANNER', rootImage: null }, dialogRefMock);
      expect(service.aspectRatio()).toBe(3);
    });

    it('should return correct aspect ratio for TRAIL_BANNER', () => {
      service.init({ uploadType: 'TRAIL_BANNER', rootImage: null }, dialogRefMock);
      expect(service.aspectRatio()).toBe(3);
    });

    it('should return correct aspect ratio for TRAIL_CARD', () => {
      service.init({ uploadType: 'TRAIL_CARD', rootImage: null }, dialogRefMock);
      expect(service.aspectRatio()).toBeCloseTo(1.778);
    });

    it('should return default aspect ratio for unknown type', () => {
      service.init({ uploadType: 'UNKNOWN_TYPE' as any, rootImage: null }, dialogRefMock);
      expect(service.aspectRatio()).toBe(1);
    });
  });

  describe('Aspect Ratio Labels', () => {
    it('should return correct label for COURSE_CARD', () => {
      service.init({ uploadType: 'COURSE_CARD', rootImage: null }, dialogRefMock);
      expect(service.aspectRatioLabel()).toBe('9:16');
    });

    it('should return correct label for COURSE_BANNER', () => {
      service.init({ uploadType: 'COURSE_BANNER', rootImage: null }, dialogRefMock);
      expect(service.aspectRatioLabel()).toBe('3:1');
    });

    it('should return correct label for TRAIL_BANNER', () => {
      service.init({ uploadType: 'TRAIL_BANNER', rootImage: null }, dialogRefMock);
      expect(service.aspectRatioLabel()).toBe('3:1');
    });

    it('should return correct label for TRAIL_CARD', () => {
      service.init({ uploadType: 'TRAIL_CARD', rootImage: null }, dialogRefMock);
      expect(service.aspectRatioLabel()).toBe('3:1');
    });

    it('should return default label for unknown type', () => {
      service.init({ uploadType: 'UNKNOWN_TYPE' as any, rootImage: null }, dialogRefMock);
      expect(service.aspectRatioLabel()).toBe('1:1');
    });
  });

  describe('Update Methods', () => {
    it('should update the wizard step', () => {
      service.setStep('IMAGE_CROP');

      expect(service.wizardStep()).toBe('IMAGE_CROP');
    });

    it('should update the wizard type', () => {
      service.setType('AI_IMAGE_GEN');

      expect(service.wizardType()).toBe('AI_IMAGE_GEN');
    });
  });

  describe('Init Method', () => {
    it('should set upload type and dialog reference', () => {
      service.init({ uploadType: 'COURSE_CARD', rootImage: null }, dialogRefMock);

      expect(service.wizardUploadType()).toBe('COURSE_CARD');
      expect((service as any).dialogRef).toBe(dialogRefMock);
    });

    describe('verifyReuseGeneratedImage behavior', () => {
      it('should not change step when rootImage is null', () => {
        service.setStep('IMAGE_DEFINITION');
        service.init({ uploadType: 'COURSE_CARD', rootImage: null }, dialogRefMock);

        expect(service.wizardStep()).toBe('IMAGE_DEFINITION');
      });

      it('should set step to IMAGE_CROP and image file when rootImage is a File', () => {
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        service.init({ uploadType: 'COURSE_CARD', rootImage: mockFile }, dialogRefMock);

        expect(service.wizardStep()).toBe('IMAGE_CROP');
        expect(service.imageToCrop()).toBe(mockFile);
        expect(service.imageToCropUrl()).toBeNull();
      });

      it('should set step to IMAGE_CROP and image URL when rootImage is a string', () => {
        const mockUrl = 'https://example.com/image.jpg';
        service.init({ uploadType: 'COURSE_CARD', rootImage: mockUrl }, dialogRefMock);

        expect(service.wizardStep()).toBe('IMAGE_CROP');
        expect(service.imageToCropUrl()).toBe(mockUrl);
        expect(service.imageToCrop()).toBeNull();
      });
    });
  });

  describe('Image Manipulation', () => {
    it('should set image to crop and clear URL', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

      service.setImageToCrop(mockFile);

      expect(service.imageToCrop()).toBe(mockFile);
      expect(service.imageToCropUrl()).toBeNull();
    });

    it('should set image URL to crop and clear file', () => {
      const mockUrl = 'https://example.com/image.jpg';

      service.setImageToCropFromUrl(mockUrl);

      expect(service.imageToCropUrl()).toBe(mockUrl);
      expect(service.imageToCrop()).toBeNull();
    });

    it('should set cropped image', () => {
      const croppedImage = 'data:image/jpeg;base64,test-base64-string';

      service.setCroppedImage(croppedImage);

      expect(service.croppedImage()).toBe(croppedImage);
    });

    it('should clear cropped image when set to null', () => {
      service.setCroppedImage(null);

      expect(service.croppedImage()).toBeNull();
    });
  });

  describe('imageDone', () => {
    it('should close dialog with file and root image when imageToCrop is set', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const rootFile = new File([''], 'root.jpg', { type: 'image/jpeg' });

      service.init({ uploadType: 'COURSE_CARD', rootImage: rootFile }, dialogRefMock);
      service.setImageToCrop(rootFile);
      service.imageDone(mockFile);

      expect(dialogRefMock.close).toHaveBeenCalledWith({
        file: mockFile,
        rootImage: rootFile,
      });
    });

    it('should close dialog with file and root image URL when imageToCropUrl is set', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const rootUrl = 'https://example.com/root-image.jpg';

      service.init({ uploadType: 'COURSE_CARD', rootImage: rootUrl }, dialogRefMock);
      service.setImageToCropFromUrl(rootUrl);
      service.imageDone(mockFile);

      expect(dialogRefMock.close).toHaveBeenCalledWith({
        file: mockFile,
        rootImage: rootUrl,
      });
    });
  });

  describe('wizardViewMode Scenarios', () => {
    describe('when step is IMAGE_DEFINITION', () => {
      const testCases: { type: ImageWizardType; expected: ImageWizardType }[] = [
        { type: 'FILE_UPLOAD', expected: 'FILE_UPLOAD' },
        { type: 'AI_IMAGE_GEN', expected: 'AI_IMAGE_GEN' },
      ];

      testCases.forEach(({ type, expected }) => {
        it(`should return ${expected} when type is ${type} and step is IMAGE_DEFINITION`, () => {
          service.setType(type);
          service.setStep('IMAGE_DEFINITION');

          expect(service.wizardViewMode()).toBe(expected);
        });
      });
    });

    describe('when step is NOT IMAGE_DEFINITION', () => {
      const testCases: { step: ImageWizardStep; type: ImageWizardType }[] = [
        { step: 'IMAGE_CROP', type: 'FILE_UPLOAD' },
        { step: 'IMAGE_CROP', type: 'AI_IMAGE_GEN' },
        { step: 'FRAME_SELECTION', type: 'FILE_UPLOAD' },
        { step: 'FRAME_SELECTION', type: 'AI_IMAGE_GEN' },
      ];

      testCases.forEach(({ step, type }) => {
        it(`should return ${step} when step is ${step} regardless of type (${type})`, () => {
          service.setType(type);
          service.setStep(step);

          expect(service.wizardViewMode()).toBe(step);
        });
      });
    });

    it('should always return a valid ImageWizardViewMode', () => {
      const allSteps: ImageWizardStep[] = ['IMAGE_DEFINITION', 'IMAGE_CROP', 'FRAME_SELECTION'];
      const allTypes: ImageWizardType[] = ['FILE_UPLOAD', 'AI_IMAGE_GEN'];

      allSteps.forEach((step) => {
        allTypes.forEach((type) => {
          service.setType(type);
          service.setStep(step);

          const result = service.wizardViewMode();

          const isValidViewMode =
            result === 'FILE_UPLOAD' ||
            result === 'AI_IMAGE_GEN' ||
            result === 'IMAGE_DEFINITION' ||
            result === 'IMAGE_CROP' ||
            result === 'FRAME_SELECTION';

          expect(isValidViewMode).toBe(true);

          if (step === 'IMAGE_DEFINITION') {
            expect(result).toBe(type);
          } else {
            expect(result).toBe(step);
          }
        });
      });
    });
  });
});
