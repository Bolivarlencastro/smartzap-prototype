import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LearningTrailService } from './learning-trail.service';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { LearningTrail } from '@app/main/learning-trail/model/learning-trail';
import { EMPTY, of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImageGeneratorComponent } from '@keeps-platform-frontend-workspace/image-generator';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { navigateToTrail } from '@app/shared/services';

jest.mock('@app/shared/services', () => ({
  navigateToTrail: jest.fn(() => Promise.resolve(true)),
}));

describe('LearningTrailService', () => {
  let service: LearningTrailService;
  let learningTrailAPI: jest.Mocked<LearningTrailAPI>;
  let router: jest.Mocked<Router>;
  let dialogMock: jest.Mocked<MatDialog>;
  let dialogRefMock: jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;

  beforeEach(() => {
    const learningTrailAPIMock = {
      postLearningTrail: jest.fn(),
      updateLearningTrail: jest.fn(),
      postLearningTrailImage: jest.fn(),
      getById: jest.fn(),
      getLearningTrailContents: jest.fn(),
      postLearningTrailContent: jest.fn(),
      reorderLearningTrailContent: jest.fn(),
      deleteLearningTrailContent: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
      url: '/learning-trails/create/1/info',
    } as unknown as jest.Mocked<Router>;

    dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of(EMPTY)),
      componentInstance: {},
    } as unknown as jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;

    dialogMock = {
      open: jest.fn().mockReturnValue(dialogRefMock),
    } as unknown as jest.Mocked<MatDialog>;

    TestBed.configureTestingModule({
      providers: [
        LearningTrailService,
        { provide: LearningTrailAPI, useValue: learningTrailAPIMock },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    service = TestBed.inject(LearningTrailService);
    learningTrailAPI = TestBed.inject(LearningTrailAPI) as jest.Mocked<LearningTrailAPI>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveLearningTrail', () => {
    it('should create a new learning trail', () => {
      const learningTrail = { name: 'mock_learning_trail' } as LearningTrail;
      learningTrailAPI.postLearningTrail.mockReturnValue(of(learningTrail));

      service.saveLearningTrail(learningTrail);

      expect(learningTrailAPI.postLearningTrail).toHaveBeenCalledWith(learningTrail);
    });

    it('should update an existing learning trail', () => {
      const learningTrail = { name: 'mock_learning_trail', id: 'mock_id' } as LearningTrail;
      learningTrailAPI.updateLearningTrail.mockReturnValue(of(learningTrail));

      service.saveLearningTrail(learningTrail);

      expect(learningTrailAPI.updateLearningTrail).toHaveBeenCalledWith(learningTrail);
    });
  });

  describe('uploadLearningTrailImage', () => {
    it('should call postLearningTrailImage with the correct parameters', () => {
      const file = new File([''], 'image.png');
      const imageType = 'holder_image';
      service.uploadLearningTrailImage(file, imageType);
      expect(learningTrailAPI.postLearningTrailImage).toHaveBeenCalledWith({ file, imageType });
    });
  });

  describe('navigateNextStep', () => {
    it('should navigate to the next step', () => {
      service.navigateNextStep('123');

      expect(router.navigate).toHaveBeenCalledWith(['/learning-trails/create', '123', 'images']);
    });
  });

  describe('getNextStep', () => {
    it('should return the next step route', () => {
      const result = service['getNextStep']('/learning-trails/create/1/info');

      expect(result).toBe('images');
    });
  });

  describe('getPreviousStep', () => {
    it('should return the previous step route', () => {
      const result = service['getPreviousStep']('/learning-trails/create/1/images');

      expect(result).toBe('info');
    });
  });
  describe('uploadLearningTrailImage', () => {
    it('should call postLearningTrailImage with the correct parameters', () => {
      const file = new File([''], 'image.png');
      const imageType = 'holder_image';
      service.uploadLearningTrailImage(file, imageType);
      expect(learningTrailAPI.postLearningTrailImage).toHaveBeenCalledWith({ file, imageType });
    });
  });

  describe('getLearningTrailById', () => {
    it('should call getById with the correct id', () => {
      const id = '123';
      service.getLearningTrailById(id);
      expect(learningTrailAPI.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('getLearningTrailContents', () => {
    it('should call getLearningTrailContents with the correct parameters', () => {
      const learningTrailId = '123';
      const search = 'test';
      service.getLearningTrailContents(learningTrailId, search);
      expect(learningTrailAPI.getLearningTrailContents).toHaveBeenCalledWith(learningTrailId, { search });
    });
  });

  describe('postLearningTrailContent', () => {
    it('should call postLearningTrailContent with the correct parameters', () => {
      const content = { learning_trail: '123', mission: 'test', pulse: 'test', order: 1 };
      service.postLearningTrailContent(content);
      expect(learningTrailAPI.postLearningTrailContent).toHaveBeenCalledWith(content);
    });
  });

  describe('reorderLearningTrailContent', () => {
    it('should call reorderLearningTrailContent with the correct parameters', () => {
      const learningTrailId = '123';
      const steps = [{ step_id: '1', order: 1 }];
      service.reorderLearningTrailContent(learningTrailId, steps);
      expect(learningTrailAPI.reorderLearningTrailContent).toHaveBeenCalledWith(learningTrailId, steps);
    });
  });

  describe('deleteLearningTrailContent', () => {
    it('should call deleteLearningTrailContent with the correct id', () => {
      const id = '123';
      service.deleteLearningTrailContent(id);
      expect(learningTrailAPI.deleteLearningTrailContent).toHaveBeenCalledWith(id);
    });
  });

  describe('Image Generator', () => {
    const imageGerenationCases: any[] = [
      ['banner', new File([], 'filename.png'), 'TRAIL_BANNER'],
      ['card', 'https://www.url.com', 'TRAIL_CARD'],
    ];

    const reuseGeneratedImageCases: any[] = [
      ['banner', 'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.BANNER_MESSAGE'],
      ['card', 'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.CARD_MESSAGE'],
    ];

    test.each(imageGerenationCases)(
      'should open the image generation dialog when the type is %p',
      (uploadImageType, rootImage, uploadType) => {
        service.openImageGenDialog(uploadImageType, rootImage);

        expect(dialogMock.open).toHaveBeenCalledWith(ImageGeneratorComponent, {
          autoFocus: 'dialog',
          height: '80vh',
          width: '80vw',
          data: {
            uploadType,
            rootImage,
          },
          disableClose: true,
        });
      },
    );

    test.each(reuseGeneratedImageCases)(
      'should open the reuse generated image dialog when the type is %p',
      (uploadImageType, message) => {
        service.openReuseGeneratedImageDialog(uploadImageType);

        expect(dialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
        expect(dialogRefMock.componentInstance.confirmTitle).toBe('LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.TITLE');
        expect(dialogRefMock.componentInstance.confirmMessage).toBe(message);
        expect(dialogRefMock.componentInstance.positiveButtonLabel).toBe(
          'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.POSITIVE_BUTTON_LABEL',
        );
        expect(dialogRefMock.componentInstance.negativeButtonLabel).toBe(
          'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.NEGATIVE_BUTTON_LABEL',
        );
      },
    );
  });

  it('should navigate to learning trail', () => {
    const learningTrailId = '123';

    service.navigateToTrail(learningTrailId);

    expect(navigateToTrail).toHaveBeenCalledWith(router, learningTrailId, false, true);
  });
});
