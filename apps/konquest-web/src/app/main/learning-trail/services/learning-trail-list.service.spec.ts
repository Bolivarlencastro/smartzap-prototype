import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { LearningTrailEnrollmentsAPI } from '@core/api/learning-trail-enrollments.api';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import {
  AuthService,
  EnrollmentStatuses,
  LanguagesService,
  LanguageTypes,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { ModalFilterItem, QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { EMPTY, of, Subject } from 'rxjs';

import { provideRouter, Router } from '@angular/router';
import { MissionModel } from '@app/main/mission/mission.model';
import { RouteDialogService } from 'app/shared/services';
import { LearningTrailListService } from './learning-trail-list.service';
import { TrailsSearchService } from 'app/main/mission/services/trails-search.service';
import { PageParams, TrailsListParams } from '@core/model/search-api';
import { signal } from '@angular/core';

const mockUserId = 'mock_id';

describe('LearningTrailListService', () => {
  let service: LearningTrailListService;
  let matDialog: jest.Mocked<MatDialog>;
  let learningTrailApi: jest.Mocked<LearningTrailAPI>;
  let routeDialogServiceMock: jest.Mocked<RouteDialogService>;
  let router: Router;
  let trailsSearchServiceMock: jest.Mocked<TrailsSearchService>;
  let languagesServiceMock: jest.Mocked<LanguagesService>;

  const userProfileMock = {
    isCurator: jest.fn().mockReturnValue(true),
    isSuperAdmin: jest.fn().mockReturnValue(true),
    roles$: new Subject<any[]>(),
  };

  beforeEach(() => {
    routeDialogServiceMock = { onDialogClosed: jest.fn() } as unknown as jest.Mocked<RouteDialogService>;
    languagesServiceMock = {
      languagesTypes: signal<LanguageTypes[]>(['pt-BR', 'pt-PT', 'en', 'es']),
    } as unknown as jest.Mocked<LanguagesService>;

    trailsSearchServiceMock = {
      fetchTrails: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<TrailsSearchService>;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(() => ({ afterClosed: jest.fn(() => of(true)), close: jest.fn() })),
          },
        },
        {
          provide: LearningTrailAPI,
          useValue: {
            getLearningTrails: jest.fn().mockReturnValue(of(EMPTY)),
            getById: jest.fn(),
            getRecommendationsLearningTrails: jest.fn().mockReturnValue(of(EMPTY)),
          },
        },
        {
          provide: LearningTrailEnrollmentsAPI,
          useValue: {
            getLearningTrailEnrollments: jest.fn().mockReturnValue(of({ results: [], count: 0 })),
          },
        },
        {
          provide: AuthService,
          useValue: {
            userId: mockUserId,
          },
        },
        {
          provide: UserProfileService,
          useValue: userProfileMock,
        },
        { provide: RouteDialogService, useValue: routeDialogServiceMock },
        { provide: TrailsSearchService, useValue: trailsSearchServiceMock },
        { provide: LanguagesService, useValue: languagesServiceMock },
      ],
    });

    service = TestBed.inject(LearningTrailListService);
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    learningTrailApi = TestBed.inject(LearningTrailAPI) as jest.Mocked<LearningTrailAPI>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadLearningTrails', () => {
    it('should save the filter languages in the localStorage', () => {
      const languages = ['pt-BR', 'en'];

      service.loadLearningTrails(QuickFilterType.LEARNING_TRAILS, { language: languages });

      const storage = localStorage.getItem('LEARNING_TRAIL_FILTER_LANGUAGE');
      expect(JSON.parse(storage)).toEqual(languages);
    });

    it('should call getLearningTrails updating the filter', () => {
      const filter: TrailsListParams & PageParams = {
        search: 'test',
        page: 1,
      };
      const expectedFilter: TrailsListParams & PageParams = {
        ...filter,
        is_active: true,
        exclude_enrollment_status: [
          EnrollmentStatuses.COMPLETED,
          EnrollmentStatuses.INACTIVATED,
          EnrollmentStatuses.EXPIRED,
          EnrollmentStatuses.GIVE_UP,
          EnrollmentStatuses.REPROVED,
        ],
      };

      service.loadLearningTrails(QuickFilterType.LEARNING_TRAILS, filter);

      expect(trailsSearchServiceMock.fetchTrails).toHaveBeenCalledWith(expectedFilter);
    });

    it(`should call getLearningTrails updating the filter when quickFilterType is ${QuickFilterType.MINE}`, () => {
      const filter: TrailsListParams & PageParams = { search: 'test', page: 1 };
      const expectedFilter: TrailsListParams & PageParams = {
        ...filter,
        is_active: undefined,
        managed: true,
        language: undefined,
      };

      service.loadLearningTrails(QuickFilterType.MINE, filter);

      expect(trailsSearchServiceMock.fetchTrails).toHaveBeenCalledWith(expectedFilter);
    });
  });

  it('should load a trail by ID', () => {
    const mock_id = 'mock_id';

    service.loadLearningTrailById(mock_id);

    expect(learningTrailApi.getById).toHaveBeenCalledWith(mock_id);
  });

  it('should load recommendations with the correct filter', () => {
    const expectedFilter = { per_page: 3, user: 'mock_id' };

    service.loadLearningTrailRecommendations();

    expect(learningTrailApi.getRecommendationsLearningTrails).toHaveBeenCalledWith(expectedFilter);
  });

  it('should return the languages with the filtered options selected', () => {
    const expectedResult: ModalFilterItem[] = [
      { name: 'pt-BR', checked: true },
      { name: 'pt-PT', checked: false },
      { name: 'en', checked: false },
      { name: 'es', checked: false },
    ];

    service.loadLearningTrails(QuickFilterType.LEARNING_TRAILS, { language: ['pt-BR'] });

    const result = service.languages();
    expect(result).toMatchObject(expectedResult);
  });

  it('should return empty if is null', () => {
    localStorage.clear();

    const languages = service.getFilterLanguages();

    expect(languages).toEqual([]);
  });

  it('should open the dialog', () => {
    service.openDetailDialog();

    expect(matDialog.open).toHaveBeenCalled();
    expect(service.detailDialogRef).toBeDefined();
  });

  describe('closeDialog', () => {
    const cases: any[] = [
      [
        {
          mission: {
            id: '123',
          },
          openDetail: true,
        },
        ['/C/123'],
        {},
      ],
      [
        {
          trailId: '111',
          mission: {
            id: '123',
            mission_model: MissionModel.INTERNAL,
            user_creator: { id: mockUserId },
          },
        },
        ['/course/123'],
        { queryParams: { rollbackPath: ['/T/111?rti=true'] } },
      ],
      [
        {
          trailId: '111',
          mission: {
            id: '321',
            mission_model: MissionModel.INTERNAL,
            user_creator: { id: '999' },
            enrollment: { status: 'STARTED' },
          },
        },
        ['/course/321'],
        { queryParams: { rollbackPath: ['/T/111?rti=true'] } },
      ],
      [
        {
          trailId: '111',
          mission: {
            id: '456',
            mission_model: MissionModel.INTERNAL,
            user_creator: { id: '999' },
            enrollment: null,
          },
        },
        ['/C/456'],
        {},
      ],
      [{ trailId: '111', mission: { id: '654', mission_model: MissionModel.LIVE } }, ['/E/654'], {}],
      [{ trailId: '111', mission: { id: '789', mission_model: MissionModel.PRESENTIAL } }, ['/E/789'], {}],
    ];

    test.each(cases)('for context %p should return this path: %p', (context, expectedPath, expectedQueryParams) => {
      const routerSpy = jest.spyOn(router, 'navigate').mockImplementation();
      matDialog.open.mockReturnValueOnce({ afterClosed: () => of(context), close: jest.fn() } as any);

      service.openDetailDialog();
      service.closeDialog();

      expect(service.detailDialogRef.close).toHaveBeenCalled();
      expect(service.detailDialogRef).toBeDefined();
      expect(routerSpy).toHaveBeenCalledWith(expectedPath, expectedQueryParams);
      expect(routeDialogServiceMock.onDialogClosed).toHaveBeenCalled();
    });
  });
});
