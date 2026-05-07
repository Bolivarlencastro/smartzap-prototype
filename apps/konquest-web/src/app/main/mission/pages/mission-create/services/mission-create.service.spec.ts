import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KonquestAPI } from '@core/api';
import { ImageGeneratorComponent } from '@keeps-platform-frontend-workspace/image-generator';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import {
  Mission,
  MissionInformationDate,
  MissionModel,
  MissionProvider,
  MissionStage,
  MissionStageContent,
} from 'app/main/mission/mission.model';
import { ScormSteps } from 'app/main/mission/models';
import { EVENTS_DETAIL_PREFIX, MISSIONS_DETAIL_PREFIX, REDIRECT_TO_CREATION_PARAM } from 'app/shared/services';
import { EMPTY, of, throwError } from 'rxjs';
import { MissionActions } from '../store';
import { FilteredMissionDates, MissionCreateService, MissionImageUpload } from './mission-create.service';

const mockUserId = 'mock_user_id';
const mockMissionId = 'mock_mission_id';

const mockMission = {
  name: 'Mission Detail Dialog',
  description: 'Mission Description',
  mission_category: {
    name: 'Marketing',
    id: 'category_id',
  },
  mission_type: {
    name: 'Open for Workspace',
    id: 'type_id',
  },
  mission_model: MissionModel.INTERNAL,
} as Mission;

const mockMissionDates: Partial<MissionInformationDate>[] = [
  {
    date: '2023-05-31',
    deleted: true,
    end_at: '2023-05-31T14:00:00',
    id: '43f481bd-6965-4229-99cd-6069059ad689',
    start_at: '2023-05-31T10:00:00',
    touched: false,
  },
  {
    date: '2023-05-27',
    deleted: false,
    end_at: '2023-05-27T10:00:00',
    id: '47992120-59b3-44c5-8deb-eb1bf42c367e',
    start_at: '2023-05-27T08:00:00',
    touched: true,
  },
  {
    date: '2023-05-26',
    deleted: false,
    end_at: '2023-05-26T09:00:00',
    id: '',
    start_at: '2023-05-26T08:00:00',
    touched: false,
  },
  {
    date: '2023-05-29',
    deleted: false,
    end_at: '2023-05-26T09:00:00',
    id: 'd0aac477-e7fa-4c5e-aca9-669f5e381aab',
    start_at: '2023-05-26T08:00:00',
    touched: false,
  },
];

const baseUrl = '/missions';

describe('MissionCreateService', () => {
  let service: MissionCreateService;
  let httpMock: jest.Mocked<KonquestAPI>;
  let authServiceMock: jest.Mocked<AuthService>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let routerMock: jest.Mocked<Router>;
  let dialogMock: jest.Mocked<MatDialog>;
  let dialogRefMock: jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn().mockReturnValue(of([])),
      post: jest.fn().mockReturnValue(of(EMPTY)),
      patch: jest.fn().mockReturnValue(of(EMPTY)),
      delete: jest.fn().mockReturnValue(of(EMPTY)),
      postFormData: jest.fn().mockReturnValue(of(EMPTY)),
    } as any;
    authServiceMock = { userId: mockUserId } as any;
    messageServiceMock = { error: jest.fn(), success: jest.fn() } as any;
    routerMock = { navigate: jest.fn(), url: 'missions/create/internal/images', navigateByUrl: jest.fn() } as any;
    dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of(EMPTY)),
      componentInstance: {},
    } as unknown as jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;
    dialogMock = {
      open: jest.fn().mockReturnValue(dialogRefMock),
    } as unknown as jest.Mocked<MatDialog>;
    service = new MissionCreateService(httpMock, authServiceMock, messageServiceMock, routerMock, dialogMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create mission', () => {
    it('should create a new mission', (done) => {
      const expectedPayload = {
        ...mockMission,
        user_creator: mockUserId,
        mission_category: 'category_id',
        mission_type: 'type_id',
      };

      service.createMission(mockMission, MissionModel.INTERNAL).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith(baseUrl, expectedPayload);
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.post.mockReturnValue(throwError(() => {}));

      service.createMission(mockMission, MissionModel.INTERNAL).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith(`MISSION.CREATE.ERROR.CREATE_MISSION`);
          done();
        },
      });
    });

    it('should create a scorm mission', (done) => {
      const mockScormSteps: ScormSteps[] = ['mock_step'] as unknown as ScormSteps[];

      const expectedPayload: Mission = {
        ...mockMission,
        user_creator: mockUserId,
        mission_category: 'category_id',
        mission_type: 'type_id',
        steps: mockScormSteps,
        mission_model: MissionModel.SCORM,
      };

      service.createMission(mockMission, MissionModel.SCORM, mockScormSteps).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/missions/scorm', expectedPayload);
        done();
      });
    });
  });

  describe('update mission', () => {
    const mockMissionWithId = {
      ...mockMission,
      id: mockMissionId,
      mission_category: 'category_id',
      mission_type: 'type_id',
    };

    it('should update an existing mission', (done) => {
      const expectedUrl = `${baseUrl}/${mockMissionId}`;

      service.updateMission(mockMissionWithId).subscribe(() => {
        expect(httpMock.patch).toHaveBeenCalledWith(expectedUrl, mockMissionWithId);
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.patch.mockReturnValue(
        throwError(() => ({
          error: {
            i18n: 'translated_error_message',
          },
        })),
      );

      service.updateMission(mockMissionWithId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith(`MISSION.CREATE.ERROR.translated_error_message`);
          done();
        },
      });
    });

    it('should update an scorm mission using the default endpoint', (done) => {
      const expectedUrl = `${baseUrl}/${mockMissionId}`;
      const mockScormMission = { ...mockMissionWithId, mission_model: MissionModel.SCORM };

      service.updateMission(mockScormMission, MissionModel.SCORM).subscribe(() => {
        expect(httpMock.patch).toHaveBeenCalledWith(expectedUrl, mockScormMission);
        done();
      });
    });

    it('should update an external mission without sending the user creator', (done) => {
      const expectedUrl = `${baseUrl}/external/${mockMissionId}`;
      const mockProvider: MissionProvider = { id: 'mock_provider_id', name: '', icon: '' };
      const mockCreator = { id: 'mock_creator_id' };
      const expecteMission = {
        id: mockMissionId,
        mission_category: 'category_id',
        mission_type: 'type_id',
        mission_model: MissionModel.EXTERNAL_PROVIDER,
        external: { provider: mockProvider.id, course_url: 'mock_course_url' },
      };

      const mockExternalMission = {
        id: mockMissionId,
        mission_category: 'category_id',
        mission_type: 'type_id',
        mission_model: MissionModel.EXTERNAL_PROVIDER,
        user_creator: mockCreator,
        external: { provider: mockProvider, course_url: 'mock_course_url' } as any,
      };

      service.updateMission(mockExternalMission, MissionModel.EXTERNAL_PROVIDER).subscribe(() => {
        expect(httpMock.patch).toHaveBeenCalledWith(expectedUrl, expecteMission);
        done();
      });
    });
  });

  describe('publishMission', () => {
    it('should publish a mission', (done) => {
      const expectedUrl = `${baseUrl}/${mockMissionId}/publish`;

      service.publishMission(mockMissionId).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith(expectedUrl, {});
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      const mockError = { error: { detail: 'mock_detail' } };
      httpMock.post.mockReturnValue(throwError(() => mockError));

      service.publishMission(mockMissionId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith(mockError.error.detail);
          done();
        },
      });
    });
  });

  describe('navigateToMissions', () => {
    it('should navigate to the missions route', () => {
      service.navigateToMissions();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/missions']);
    });
  });

  describe('navigateToMission', () => {
    const missionCases: any[] = [[MissionModel.INTERNAL], [MissionModel.EXTERNAL_PROVIDER], [MissionModel.SCORM]];
    const eventCases: any[] = [[MissionModel.LIVE], [MissionModel.PRESENTIAL]];

    test.each(missionCases)('should navigate to the missions detail dialog', (model) => {
      const mockId = 'mock_mission_id';
      service.navigateToMission(mockId, model);

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
        `${MISSIONS_DETAIL_PREFIX}/${mockId}${REDIRECT_TO_CREATION_PARAM}`,
      );
    });

    test.each(eventCases)('should navigate to the missions detail dialog', (model) => {
      const mockId = 'mock_mission_id';
      service.navigateToMission(mockId, model);

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
        `${EVENTS_DETAIL_PREFIX}/${mockId}${REDIRECT_TO_CREATION_PARAM}`,
      );
    });
  });

  describe('loadStages', () => {
    it('should get the stages', (done) => {
      const expectedUrl = `${baseUrl}/${mockMissionId}/stages`;

      service.loadStages(mockMissionId).subscribe(() => {
        expect(httpMock.get).toHaveBeenCalledWith(expectedUrl);
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.get.mockReturnValue(throwError(() => {}));

      service.loadStages(mockMissionId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.LOAD_STAGES');
          done();
        },
      });
    });
  });

  describe('saveStages', () => {
    const mockStage: MissionStage = { name: 'mock_stage', mission: mockMissionId };
    it('should create a stage', (done) => {
      const expectedUrl = `${baseUrl}/stages`;

      service.saveStage(mockStage, mockMissionId).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith(expectedUrl, mockStage);
        done();
      });
    });

    it('should display an success message on success', (done) => {
      service.saveStage(mockStage, mockMissionId).subscribe({
        next: () => {
          expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.TOPIC.ADD.SUCCESS');
          done();
        },
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.post.mockReturnValue(throwError(() => {}));

      service.saveStage(mockStage, mockMissionId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.ADD_TOPIC');
          done();
        },
      });
    });
  });

  describe('editStage', () => {
    const mockStage: MissionStage = {
      id: 'mock_stage_id',
      name: 'mock_stage',
      description: 'mock_stage_description',
      mission: mockMissionId,
    };
    it('should edit a stage', (done) => {
      const expectedUrl = `${baseUrl}/stages/${mockStage.id}`;

      service.editStage(mockStage).subscribe(() => {
        expect(httpMock.patch).toHaveBeenCalledWith(expectedUrl, {
          name: mockStage.name,
          description: mockStage.description,
        });
        done();
      });
    });

    it('should display an success message on success', (done) => {
      service.editStage(mockStage).subscribe({
        next: () => {
          expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.TOPIC_EDIT');
          done();
        },
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.patch.mockReturnValue(throwError(() => {}));

      service.editStage(mockStage).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.TOPIC_EDIT');
          done();
        },
      });
    });
  });

  describe('removeStage', () => {
    const mockStageID = 'mock_stage_id';

    it('should delete a stage', (done) => {
      const expectedUrl = `${baseUrl}/stages/${mockStageID}`;

      service.removeStage(mockStageID).subscribe(() => {
        expect(httpMock.delete).toHaveBeenCalledWith(expectedUrl);
        done();
      });
    });

    it('should display an success message on success', (done) => {
      service.removeStage(mockStageID).subscribe({
        next: () => {
          expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.TOPIC_REMOVED');
          done();
        },
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.delete.mockReturnValue(throwError(() => {}));

      service.removeStage(mockStageID).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.TOPIC_REMOVED');
          done();
        },
      });
    });
  });

  describe('reorderStageContents', () => {
    const mockContents: MissionStageContent[] = [
      { id: 'content_mock_1', order: 1 },
      { id: 'content_mock_2', order: 2 },
    ];
    const expectedContents = [
      { content: 'content_mock_1', order: 1 },
      { content: 'content_mock_2', order: 2 },
    ];

    it('should reorder the stage contents', (done) => {
      const expectedUrl = `${baseUrl}/stages/contents/reorder`;

      service.reorderStageContents(mockContents).subscribe(() => {
        expect(httpMock.patch).toHaveBeenCalledWith(expectedUrl, expectedContents);
        done();
      });
    });

    it('should display an success message on success', (done) => {
      service.reorderStageContents(mockContents).subscribe({
        next: () => {
          expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.ORDER_CONTENT');
          done();
        },
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.patch.mockReturnValue(throwError(() => {}));

      service.reorderStageContents(mockContents).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.ORDER_CONTENT');
          done();
        },
      });
    });
  });

  describe('deleteStageContent', () => {
    const mockContentId = 'mock_content_id';

    it('should delete the stage content', (done) => {
      const expectedUrl = `${baseUrl}/stages/contents/${mockContentId}`;

      service.deleteStageContent(mockContentId).subscribe(() => {
        expect(httpMock.delete).toHaveBeenCalledWith(expectedUrl);
        done();
      });
    });

    it('should display an success message on success', (done) => {
      service.deleteStageContent(mockContentId).subscribe({
        next: () => {
          expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.CONTENT_REMOVED');
          done();
        },
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.delete.mockReturnValue(throwError(() => {}));

      service.deleteStageContent(mockContentId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.CONTENT_REMOVED');
          done();
        },
      });
    });
  });

  describe('editStageContent', () => {
    const mockContent: MissionStageContent = {
      id: 'content_mock_1',
      name: 'mock_content',
      description: 'mock_description',
    };

    it('should edit the stage content', (done) => {
      const expectedUrl = `${baseUrl}/stages/contents/${mockContent.id}`;

      service.editStageContent(mockContent).subscribe(() => {
        expect(httpMock.patch).toHaveBeenCalledWith(expectedUrl, {
          name: mockContent.name,
          description: mockContent.description,
        });
        done();
      });
    });

    it('should display an success message on success', (done) => {
      service.editStageContent(mockContent).subscribe({
        next: () => {
          expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.CONTENT_EDIT');
          done();
        },
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.patch.mockReturnValue(throwError(() => {}));

      service.editStageContent(mockContent).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.CONTENT_EDIT');
          done();
        },
      });
    });
  });

  describe('updateMissionImage', () => {
    const mockImage = new File([], 'filename.png');

    it('should post one image for each definition', (done) => {
      service.uploadMissionImage(mockImage).subscribe(() => {
        expect(httpMock.postFormData).toHaveBeenCalledTimes(3);
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.postFormData.mockReturnValue(throwError(() => {}));

      service.uploadMissionImage(mockImage).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.IMAGE_UPLOAD');
          done();
        },
      });
    });
  });

  describe('checkMissionModelOrId', () => {
    const cases = Object.keys(MissionModel).map((key) => key.toLowerCase());

    test.each(cases)(
      `should return ${MissionActions.setMissionModel.type} action if provided with mission model %p`,
      (missionModel) => {
        const resultingAction = MissionCreateService.checkMissionModelOrId(missionModel);

        expect(resultingAction.type).toBe(MissionActions.setMissionModel.type);
      },
    );

    it(`should return ${MissionActions.loadMission.type} action if provided with an invalid mission model`, () => {
      const resultingAction = MissionCreateService.checkMissionModelOrId('invalid_mission_model');

      expect(resultingAction.type).toBe(MissionActions.loadMission.type);
    });
  });

  describe('filterNavigationEvents', () => {
    it(`should return ${false} if missionModelOrId is undefined`, () => {
      expect(MissionCreateService.filterNavigationEvents(undefined, undefined, false, undefined)).toBe(false);
    });

    it(`should return ${true} if missionModelOrId is a valid UUID missionLoaded is false`, () => {
      expect(
        MissionCreateService.filterNavigationEvents(
          '50a6cf0d-f54b-4d8d-8e0a-4da75278f07c',
          undefined,
          false,
          undefined,
        ),
      ).toBe(true);
    });

    it(`should return ${true} if missionModelOrId is a valid UUID and it is different from currentId`, () => {
      expect(
        MissionCreateService.filterNavigationEvents(
          '50a6cf0d-f54b-4d8d-8e0a-4da75278f07c',
          MissionModel.LIVE,
          true,
          '61a7cf1d-f64b-4d8d-8e0a-4da75278f07c',
        ),
      ).toBe(true);
    });

    it(`should return ${true} if missionModelOrId is valid but a different value from currentMissionModel`, () => {
      expect(
        MissionCreateService.filterNavigationEvents('internal', MissionModel.EXTERNAL_PROVIDER, false, undefined),
      ).toBe(true);
    });

    it(`should return ${true} if missionModelOrId is valid and the same value from currentMissionModel, but mission loaded is true`, () => {
      expect(MissionCreateService.filterNavigationEvents('internal', MissionModel.INTERNAL, true, undefined)).toBe(
        true,
      );
    });

    it(`should return ${false} if missionModelOrId is valid but and the same value from currentMissionModel, but mission loaded is false`, () => {
      expect(MissionCreateService.filterNavigationEvents('internal', MissionModel.INTERNAL, false, undefined)).toBe(
        false,
      );
    });
  });

  describe('navigateNextStep', () => {
    const missionCases: any[] = [[MissionModel.INTERNAL], [MissionModel.EXTERNAL_PROVIDER], [MissionModel.SCORM]];
    const eventCases: any[] = [[MissionModel.LIVE], [MissionModel.PRESENTIAL]];

    test.each(missionCases)(
      'should navigate to the next creation step with the guard override param - MISSION',
      (model) => {
        service.navigateNextStep('mock_mission_id', model);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/missions/create', 'mock_mission_id', 'settings'], {
          state: { missionSaved: true },
        });
      },
    );

    test.each(eventCases)(
      'should navigate to the next creation step with the guard override param - EVENT',
      (model) => {
        service.navigateNextStep('mock_mission_id', model);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/events/create', 'mock_mission_id', 'settings'], {
          state: { missionSaved: true },
        });
      },
    );
  });

  describe('navigatePreviousStep', () => {
    const missionCases: any[] = [[MissionModel.INTERNAL], [MissionModel.EXTERNAL_PROVIDER], [MissionModel.SCORM]];
    const eventCases: any[] = [[MissionModel.LIVE], [MissionModel.PRESENTIAL]];

    test.each(missionCases)('should navigate to the previous creation step - MISSION', (model) => {
      service.navigatePreviousStep('mock_mission_id', model);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/missions/create', 'mock_mission_id', 'info']);
    });

    test.each(eventCases)('should navigate to the previous creation step - EVENT', (model) => {
      service.navigatePreviousStep('mock_mission_id', model);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/events/create', 'mock_mission_id', 'info']);
    });
  });

  describe('groupMissionDates', () => {
    it('should return an object with the dates separated by their status', () => {
      const expectedResult: FilteredMissionDates = {
        deleted: [mockMissionDates[0]] as MissionInformationDate[],
        updated: [mockMissionDates[1]] as MissionInformationDate[],
        created: [mockMissionDates[2]] as MissionInformationDate[],
        untouched: [mockMissionDates[3]] as MissionInformationDate[],
      };

      const result = MissionCreateService.groupMissionDates(mockMissionDates as MissionInformationDate[]);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('manageMissionDates', () => {
    it('should return an forked observable representing all dates CRUD operations', (done) => {
      httpMock.post.mockReturnValueOnce(of('created_dates'));
      httpMock.patch.mockReturnValueOnce(of('updated_dates'));
      httpMock.delete.mockReturnValueOnce(of('deleted_dates'));

      const dates: FilteredMissionDates = {
        deleted: [mockMissionDates[0]] as MissionInformationDate[],
        updated: [mockMissionDates[1]] as MissionInformationDate[],
        created: [mockMissionDates[2]] as MissionInformationDate[],
        untouched: [mockMissionDates[3]] as MissionInformationDate[],
      };
      const expectedResult = { created: ['created_dates'], updated: ['updated_dates'], deleted: ['deleted_dates'] };

      service.manageMissionDates(dates, 'mock_id', MissionModel.PRESENTIAL).subscribe((result) => {
        expect(result).toEqual(expectedResult);
        done();
      });
    });
  });

  describe('getProviders', () => {
    it('should filter providers', () => {
      service.getProviders('mock_filter');

      expect(httpMock.get).toHaveBeenCalledWith('/missions/providers', { search: 'mock_filter', per_page: 20 });
    });
  });

  describe('getMissionWithImagesDefinitions', () => {
    it('should return an mission partial with the provided image definitions set', () => {
      const expectedResult: Partial<Mission> = { thumb_image: 'mock_url', vertical_holder_image: 'mock_url' };
      const mockImages: MissionImageUpload[] = [
        { url: 'mock_url', definition: 'thumb_image' },
        {
          url: 'mock_url',
          definition: 'vertical_holder_image',
        },
      ];

      const result = MissionCreateService.getMissionWithImagesDefinitions(mockImages);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('Image Generator', () => {
    const imageGerenationCases: any[] = [
      ['banner', new File([], 'filename.png'), 'COURSE_BANNER'],
      ['card', 'https://www.url.com', 'COURSE_CARD'],
    ];

    const reuseGeneratedImageCases: any[] = [
      ['banner', 'MISSION.CREATE.REUSE_GENERATED_IMAGE.BANNER_MESSAGE'],
      ['card', 'MISSION.CREATE.REUSE_GENERATED_IMAGE.CARD_MESSAGE'],
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
        expect(dialogRefMock.componentInstance.confirmTitle).toBe('MISSION.CREATE.REUSE_GENERATED_IMAGE.TITLE');
        expect(dialogRefMock.componentInstance.confirmMessage).toBe(message);
        expect(dialogRefMock.componentInstance.positiveButtonLabel).toBe(
          'MISSION.CREATE.REUSE_GENERATED_IMAGE.POSITIVE_BUTTON_LABEL',
        );
        expect(dialogRefMock.componentInstance.negativeButtonLabel).toBe(
          'MISSION.CREATE.REUSE_GENERATED_IMAGE.NEGATIVE_BUTTON_LABEL',
        );
      },
    );
  });
});
