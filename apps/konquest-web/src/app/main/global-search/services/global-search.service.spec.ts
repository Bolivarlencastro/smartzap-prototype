import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LearningTrail } from '@app/main/learning-trail/model/learning-trail';
import { MissionCategory, MissionModel, MissionProvider } from '@app/main/mission/mission.model';
import { PulseService } from '@core/api';
import { SearchAPI } from '@core/api/base/search.api';
import { DataType } from '@core/model/search-api/global-params.model';
import { UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ContentTypeTabs } from '@keeps-platform-frontend-workspace/ui/kp-global-search-list';
import { Store } from '@ngrx/store';
import { CourseSearchService } from 'app/main/mission/services/courses-search.service';
import { of } from 'rxjs';
import { GlobalSearchComponent } from '../global-search.component';
import { GlobalSearchService } from './global-search.service';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

const servicesMock = [
  { id: '0d3752f0-15d7-402a-8628-04ed47bcbf41', name: 'Mission' },
  { id: '8064f5d7-e9cb-4bb8-8cb5-09030a14bf52', name: 'Event' },
  { id: 'f19a1f71-82fb-46df-ab88-bdd3700da124', name: 'PULSE' },
  { id: '0d3752f0-15d7-402a-8628-04ed47bcbf42', name: 'LEARNING_TRAIL' },
];

describe('GlobalSearchService', () => {
  let service: GlobalSearchService;
  let matDialog: MatDialog;
  let matDialogRef: MatDialogRef<GlobalSearchComponent>;
  let searchAPI: SearchAPI;
  let router: Router;
  let pulseService: PulseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        GlobalSearchService,
        { provide: CourseSearchService, useValue: { fetchMissions: jest.fn(() => of({ name: 'vd' })) } },
        { provide: SearchAPI, useValue: { get: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn(() => matDialogRef) } },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: PulseService, useValue: { isQuiz: jest.fn() } },
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: UserProfileService, useValue: { getUserLocale: jest.fn() } },
        {
          provide: WorkspaceService,
          useValue: {
            getWorkspaceServices: jest.fn().mockReturnValue(servicesMock),
          },
        },
      ],
    });

    service = TestBed.inject(GlobalSearchService);
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<GlobalSearchComponent>>;
    searchAPI = TestBed.inject<SearchAPI>(SearchAPI);
    router = TestBed.inject(Router);
    pulseService = TestBed.inject<PulseService>(PulseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    service.openDialog();
    expect(matDialog.open).toHaveBeenCalledWith(GlobalSearchComponent, {
      width: '75vw',
      maxWidth: '90vw',
      height: '85vh',
    });
  });

  it('should close dialog', () => {
    service.openDialog();
    service.closeDialog();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('should return tabs', () => {
    const result = service.getTabs();
    expect(result).toEqual([
      {
        title: 'GLOBAL_SEARCH.ALL',
        value: ContentTypeTabs.ALL,
      },
      {
        title: 'GLOBAL_SEARCH.TRAILS',
        value: ContentTypeTabs.TRAILS,
      },
      {
        title: 'GLOBAL_SEARCH.COURSES',
        value: ContentTypeTabs.MISSIONS,
      },
      {
        title: 'GLOBAL_SEARCH.EVENTS',
        value: ContentTypeTabs.EVENTS,
      },
      {
        title: 'GLOBAL_SEARCH.CHANNELS',
        value: ContentTypeTabs.CHANNELS,
      },
      {
        title: 'GLOBAL_SEARCH.PULSES',
        value: ContentTypeTabs.PULSES,
      },
    ]);
  });

  it('should return the filters', () => {
    const categories = [{ id: 'cat1', name: 'Cat1' }] as MissionCategory[];
    const providers = [{ id: 'prov1', name: 'Prov1' }] as MissionProvider[];
    const result = service.getFilterOptions(categories, providers);
    expect(result).toEqual({
      enrollmentFilters: [
        {
          label: 'GLOBAL_SEARCH.ENROLLMENT_STATUS',
          value: 'enrollmentStatus',
          icon: 'circle',
          multipleSelection: true,
          options: [
            { value: 'ENROLLED', label: 'ENROLLMENT.STATUS.ENROLLED' },
            { value: 'STARTED', label: 'ENROLLMENT.STATUS.STARTED' },
            { value: 'COMPLETED', label: 'ENROLLMENT.STATUS.COMPLETED' },
            { value: 'PENDING_VALIDATION', label: 'ENROLLMENT.STATUS.PENDING_VALIDATION' },
            { value: 'REFUSED', label: 'ENROLLMENT.STATUS.REFUSED' },
            { value: 'REPROVED', label: 'ENROLLMENT.STATUS.REPROVED' },
            { value: 'EXPIRED', label: 'ENROLLMENT.STATUS.EXPIRED' },
            { value: 'REQUEST_EXTENSION', label: 'ENROLLMENT.STATUS.REQUEST_EXTENSION' },
            { value: 'GIVE_UP', label: 'ENROLLMENT.STATUS.GIVE_UP' },
            { value: 'INACTIVATED', label: 'ENROLLMENT.STATUS.INACTIVATED' },
          ],
        },
        {
          label: 'GLOBAL_SEARCH.ENROLLMENT_TYPE',
          value: 'enrollmentType',
          icon: 'notifications',
          options: [
            { label: 'GLOBAL_SEARCH.FREE', value: 'free' },
            { label: 'GLOBAL_SEARCH.MANDATORY', value: 'mandatory' },
          ],
        },
        {
          label: 'GLOBAL_SEARCH.DUE_DATE',
          value: 'duedate',
          icon: 'today',
          options: [
            { label: 'GLOBAL_SEARCH.LATE', value: 'late' },
            { label: 'GLOBAL_SEARCH.IN_SEVEN_DAYS', value: 'in_7_days' },
            { label: 'GLOBAL_SEARCH.IN_THIRTY_DAYS', value: 'in_30_days' },
          ],
        },
      ],
      courseFilters: [
        {
          label: 'GLOBAL_SEARCH.CATEGORIES',
          value: 'categories',
          icon: 'folder',
          multipleSelection: true,
          options: [{ label: 'Cat1', value: 'cat1' }],
        },
        {
          label: 'GLOBAL_SEARCH.PROVIDERS',
          value: 'platforms',
          icon: 'moving',
          multipleSelection: true,
          options: [{ label: 'Prov1', value: 'prov1' }],
        },
        {
          label: 'GLOBAL_SEARCH.TIME',
          value: 'duration',
          icon: 'schedule',
          options: [
            { label: 'GLOBAL_SEARCH.SHORT', value: 'short' },
            { label: 'GLOBAL_SEARCH.MEDIUM', value: 'medium' },
            { label: 'GLOBAL_SEARCH.LONG', value: 'long' },
          ],
        },
      ],
    });
  });

  it('should return all', () => {
    const givenParams = { per_page: 20 };

    const getSearchSpy = jest.spyOn(searchAPI, 'get');
    getSearchSpy.mockReturnValue(of({ items: [], total: 0 }));

    service.getItems(ContentTypeTabs.ALL, givenParams);

    expect(getSearchSpy).toHaveBeenCalledWith('/v1/global', givenParams, true);
  });

  it('should return trails', () => {
    const givenParams = { per_page: 20 };

    const getSearchSpy = jest.spyOn(searchAPI, 'get');
    getSearchSpy.mockReturnValue(of({ items: [], total: 0 }));

    service.getItems(ContentTypeTabs.TRAILS, givenParams);

    const expectedParams = { ...givenParams, dataType: DataType.TRAILS };
    expect(getSearchSpy).toHaveBeenCalledWith('/v1/global', expectedParams, true);
  });

  it('should return missions', () => {
    const givenParams = { per_page: 20 };

    const getSearchSpy = jest.spyOn(searchAPI, 'get');
    getSearchSpy.mockReturnValue(of({ items: [], total: 0 }));

    service.getItems(ContentTypeTabs.MISSIONS, givenParams);

    const expectedParams = {
      ...givenParams,
      dataType: DataType.COURSES,
      mission_model: ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'],
    };
    expect(getSearchSpy).toHaveBeenCalledWith('/v1/global', expectedParams, true);
  });

  it('should return events', () => {
    const givenParams = { per_page: 20 };

    const getSearchSpy = jest.spyOn(searchAPI, 'get');
    getSearchSpy.mockReturnValue(of({ items: [], total: 0 }));

    service.getItems(ContentTypeTabs.EVENTS, givenParams);

    const expectedParams = { ...givenParams, dataType: DataType.COURSES, mission_model: ['LIVE', 'PRESENTIAL'] };
    expect(getSearchSpy).toHaveBeenCalledWith('/v1/global', expectedParams, true);
  });

  it('should return channels', (done) => {
    const givenParams = { per_page: 20 };
    const item = {
      stats: {
        dataType: DataType.CHANNELS,
        user_is_owner: false,
        user_is_contributor: false,
        user_enrollment: {
          id: '123456',
        },
      },
    };
    const expectItem = {
      ...item,
      type: 'hub',
    };

    const getSearchSpy = jest.spyOn(searchAPI, 'get');
    getSearchSpy.mockReturnValue(of({ items: [item], total: 0 }));

    service.getItems(ContentTypeTabs.CHANNELS, givenParams).subscribe((res) => {
      expect(res.items[0]).toEqual(expectItem);
      done();
    });

    const expectedParams = { ...givenParams, dataType: DataType.CHANNELS };
    expect(getSearchSpy).toHaveBeenCalledWith('/v1/global', expectedParams, true);
  });

  it('should return pulses', () => {
    const givenParams = { per_page: 20 };

    const getSearchSpy = jest.spyOn(searchAPI, 'get');
    getSearchSpy.mockReturnValue(of({ items: [], total: 0 }));

    service.getItems(ContentTypeTabs.PULSES, givenParams);

    const expectedParams = { ...givenParams, dataType: DataType.PULSES };
    expect(getSearchSpy).toHaveBeenCalledWith('/v1/global', expectedParams, true);
  });

  describe('navigateToContent', () => {
    it('should navigate to pulse when pulse is QUIZ', () => {
      jest.spyOn(pulseService, 'isQuiz').mockReturnValueOnce(true);
      const item = { id: '123', pulse_type: '7a41a8e0-ee37-4d0b-ad4f-35bada67134d' };
      const navigateSpy = jest.spyOn(router, 'navigateByUrl');

      service.navigateToContent(item);
      expect(navigateSpy).toHaveBeenCalledWith(`/P/${item.id}`);
    });

    it('should navigate to pulse when pulse is not QUIZ', () => {
      jest.spyOn(pulseService, 'isQuiz').mockReturnValueOnce(false);
      const item = { id: '123', pulse_type: '7777777' };
      const navigateSpy = jest.spyOn(router, 'navigateByUrl');

      service.navigateToContent(item);
      expect(navigateSpy).toHaveBeenCalledWith(`/P/${item.id}`);
    });

    it('should navigate to mission when mission is EXTERNAL', () => {
      const windowOpenSpy = (window.open = jest.fn());
      const item = { id: '123', mission_model: MissionModel.EXTERNAL_PROVIDER, external_url: 'https://www.udemy.com' };

      service.navigateToContent(item);
      expect(windowOpenSpy).toHaveBeenCalledWith(item.external_url, '_blank');
    });

    it('should navigate to mission when mission is not EXTERNAL', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const item = { id: '123', mission_model: MissionModel.INTERNAL };

      service.navigateToContent(item);
      expect(navigateSpy).toHaveBeenCalledWith(['/course', item.id]);
    });
  });

  describe('findLastContentItem', () => {
    it('should return a mission', () => {
      const trail = {
        steps: [
          {
            mission: {
              id: '123',
              development_status: 'DONE',
              mission_model: 'INTERNAL',
              enrollment: {
                status: 'ENROLLED',
              },
            },
          },
        ],
      } as LearningTrail;

      const result = service.findLastContentItem(trail);
      expect(result).toEqual({
        id: '123',
        mission_model: 'INTERNAL',
        external_url: undefined,
      });
    });

    it('should return a pulse', () => {
      const trail = {
        steps: [
          {
            pulse: {
              id: '321',
              consume_time_in: 11.4,
              duration_time: 20,
              pulse_type: undefined,
            },
          },
        ],
      } as LearningTrail;

      const result = service.findLastContentItem(trail);
      expect(result).toEqual({ id: '321', pulse_type: undefined });
    });

    it('should return undefined', () => {
      const trail = {
        steps: [
          {
            mission: {
              id: '123',
              development_status: 'IN_REVIEW',
              mission_model: 'INTERNAL',
              enrollment: {
                status: 'ENROLLED',
              },
            },
          },
          {
            pulse: {
              id: '321',
              consume_time_in: 30.44,
              duration_time: 20,
              pulse_type: undefined,
            },
          },
        ],
      } as LearningTrail;

      const result = service.findLastContentItem(trail);
      expect(result).toEqual(undefined);
    });
  });
});
