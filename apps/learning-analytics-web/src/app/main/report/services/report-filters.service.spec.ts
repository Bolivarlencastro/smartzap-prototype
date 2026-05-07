import { MatDialog } from '@angular/material/dialog';
import { KonquestApiClient } from '@core/api';
import {
  AuthService,
  MyAccountV2Client,
  Pagination,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { ReportFilterDialogComponent, ReportFilterDialogData } from 'app/main/report/container';
import { ReportType } from 'app/main/report/enums/report';
import { EMPTY, of } from 'rxjs';
import { ReportFiltersService } from './report-filters.service';
import { SearchAPI } from '@core/api/search.api';

const getResponseMock: Pagination<{ id: string; name: string }> = {
  results: [{ id: 'item_id', name: 'item_name' }],
  count: 1,
  next: '',
  previous: '',
};

describe('ReportFiltersService', () => {
  let service: ReportFiltersService;
  let konquestApiMock: jest.Mocked<KonquestApiClient>;
  let myAccountApiMock: jest.Mocked<MyAccountV2Client>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  let authServiceMock: jest.Mocked<AuthService>;
  let dialogMock: jest.Mocked<MatDialog>;
  let searchApiMock: jest.Mocked<SearchAPI>;

  beforeEach(() => {
    konquestApiMock = { get: jest.fn(() => of(getResponseMock)) } as unknown as jest.Mocked<KonquestApiClient>;

    myAccountApiMock = { get: jest.fn(() => of(getResponseMock)) } as unknown as jest.Mocked<MyAccountV2Client>;

    searchApiMock = { get: jest.fn(() => of(getResponseMock)) } as unknown as jest.Mocked<SearchAPI>;

    userProfileServiceMock = { isAnalyticsLeader: jest.fn(() => false) } as unknown as jest.Mocked<UserProfileService>;
    authServiceMock = { userId: 'mock_user_id' } as unknown as jest.Mocked<AuthService>;
    dialogMock = {
      open: jest.fn(() => ({ afterClosed: jest.fn(() => of(EMPTY)) })),
    } as unknown as jest.Mocked<MatDialog>;

    service = new ReportFiltersService(
      searchApiMock,
      konquestApiMock,
      myAccountApiMock,
      userProfileServiceMock,
      authServiceMock,
      dialogMock,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSelectOptions', () => {
    const search = 'mock_search';
    const defaultParams = { per_page: 10, ordering: 'name', search };
    const userParams = { limit: 10, sortBy: 'name:ASC', search };
    const employeeInfosParams = { perPage: 10, search };

    it('should search missions', () => {
      service.getSelectOptions({ search, searchType: 'missions' });

      expect(searchApiMock.get).toHaveBeenCalledWith('/v1/courses/for-reports', defaultParams);
    });

    it('should search learning-trails', () => {
      service.getSelectOptions({ search, searchType: 'trails' });

      expect(konquestApiMock.get).toHaveBeenCalledWith('/learning-trails', defaultParams);
    });

    it('should search channels', () => {
      service.getSelectOptions({ search, searchType: 'channels' });

      expect(konquestApiMock.get).toHaveBeenCalledWith('/channels', defaultParams);
    });

    it('should search categories', () => {
      service.getSelectOptions({ search, searchType: 'categories' });

      expect(konquestApiMock.get).toHaveBeenCalledWith('/categories', defaultParams);
    });

    it('should search providers', () => {
      service.getSelectOptions({ search, searchType: 'providers' });

      expect(konquestApiMock.get).toHaveBeenCalledWith('/missions/providers', defaultParams);
    });

    it('should search groups', () => {
      service.getSelectOptions({ search, searchType: 'groups' });

      expect(konquestApiMock.get).toHaveBeenCalledWith('/groups', defaultParams);
    });

    it('should search users', () => {
      service.getSelectOptions({ search, searchType: 'users' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/users', userParams);
    });

    it('should search users related only to the current user if he is an analytics leader', () => {
      userProfileServiceMock.isAnalyticsLeader.mockReturnValueOnce(true);

      service.getSelectOptions({ search, searchType: 'users' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/users', {
        ...userParams,
        'filter.relatedUserLeaderId': '$in:mock_user_id',
      });
    });

    it('should search user creators', () => {
      service.getSelectOptions({ search, searchType: 'creators' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/users', {
        ...userParams,
        'filter.roles.role.id':
          '$in:297a88de-c34b-4661-be8a-7090fa9a89e5,c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6,97f4a026-f727-4e23-bdf9-971fec7ce20e',
      });
    });

    it('should search leaders', () => {
      service.getSelectOptions({ search, searchType: 'leaders' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/users', {
        ...userParams,
        'filter.roles.role.id': '$in:6a2b41b4-54c2-40d1-a587-cf25ab284aa0',
      });
    });

    it('should map the results to an array of KpFilterSelectionOption', (done) => {
      const expectedResult: KpFilterSelectOption[] = [{ value: 'item_id', label: 'item_name' }];

      service.getSelectOptions({ search, searchType: 'groups' }).subscribe((result) => {
        expect(result).toEqual(expect.arrayContaining(expectedResult));
        done();
      });
    });

    it('should search activity areas', () => {
      service.getSelectOptions({ search, searchType: 'activityAreas' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/users/employee-infos/areas-of-activity', employeeInfosParams);
    });

    it('should search managers', () => {
      service.getSelectOptions({ search, searchType: 'managers' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/users/employee-infos/managers', employeeInfosParams);
    });

    it('should search directors', () => {
      service.getSelectOptions({ search, searchType: 'directors' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/users/employee-infos/directors', employeeInfosParams);
    });

    it('should search jobs', () => {
      service.getSelectOptions({ search, searchType: 'jobs' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/jobs', defaultParams);
    });

    it('should search jobFunctions', () => {
      service.getSelectOptions({ search, searchType: 'jobFunctions' });

      expect(myAccountApiMock.get).toHaveBeenCalledWith('/job-functions', defaultParams);
    });
  });

  describe('openDialog', () => {
    it('should open the filter dialog', (done) => {
      const dialogData: ReportFilterDialogData = { reportType: ReportType.MISSION_ENROLLMENTS };

      const expectedDialogConfig = {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
        data: dialogData,
      };

      service.openDialog(ReportType.MISSION_ENROLLMENTS).subscribe(() => {
        expect(dialogMock.open).toHaveBeenCalledWith(ReportFilterDialogComponent, expectedDialogConfig);
        done();
      });
    });

    it('should return a normalized filter', (done) => {
      const mockFilterValue = {
        area_of_activity__in: 'mock_activity_area',
        goal_date__gte: '2023-11-01T03:00:00.000Z',
        goal_date__lte: '2023-11-30T03:00:00.000Z',
        performance__gte: '10',
        performance__lte: '25',
        give_up: true,
        mission_id__in: [{ value: '3c991358-1241-4fad-8fe4-7296c7a749eb' }],
        mission_provider__id__in: [{ value: '05fd79d9-7700-4ebe-89ca-80bdcde728b8' }],
        user__related_user_leader_id__in: [{ value: '28289763-62f1-4f88-bf3a-584d11a08a6e' }],
        mission__mission_model__in: ['INTERNAL', 'EXTERNAL', 'SCORM', 'LIVE', 'PRESENTIAL'],
        user__country__in: 'brazil',
        end_date__gte: '2023-11-01T03:00:00.000Z',
        end_date__lte: '2023-11-30T03:00:00.000Z',
        start_date__lte: '2023-11-01T03:00:00.000Z',
        created_date__gte: '2023-11-28T03:00:00.000Z',
        manager__in: 'mock_management',
        director__in: 'mack_directory',
        user_id__in: [{ value: '56c67b41-79ae-4bbd-bbb3-aff1f731d326' }],
        status__in: ['COMPLETED', 'ENROLLED', 'REFUSED', 'REPROVED', 'STARTED', 'VALIDATION_PENDING'],
        progress__lte: '50',
        mission__language__in: ['pt-BR', 'es', 'us'],
        job__name__in: [{ value: 'MOCKED_JOB_1' }, { value: 'MOCKED_JOB_2' }],
        job_function__name__in: [{ value: 'MOCKED_JOB_FUNCTIONS' }],
        activity_gte_date: '2023-11-01T03:00:00.000Z',
        activity_lte_date: '2023-11-01T03:00:00.000Z',
      };

      const expectedResult = {
        user_profile_workspace: {
          area_of_activity__in: ['mock_activity_area'],
          manager__in: ['mock_management'],
          director__in: ['mack_directory'],
        },
        goal_date__gte: '2023-11-01',
        goal_date__lte: '2023-11-30',
        performance__gte: '0.1',
        performance__lte: '0.25',
        give_up: true,
        mission_id__in: ['3c991358-1241-4fad-8fe4-7296c7a749eb'],
        mission_provider__id__in: ['05fd79d9-7700-4ebe-89ca-80bdcde728b8'],
        user__related_user_leader_id__in: ['28289763-62f1-4f88-bf3a-584d11a08a6e'],
        mission__mission_model__in: ['INTERNAL', 'EXTERNAL', 'SCORM', 'LIVE', 'PRESENTIAL'],
        user__country__in: ['brazil'],
        end_date__gte: '2023-11-01',
        end_date__lte: '2023-11-30',
        start_date__lte: '2023-11-01',
        created_date__gte: '2023-11-28',
        user_id__in: ['56c67b41-79ae-4bbd-bbb3-aff1f731d326'],
        status__in: ['COMPLETED', 'ENROLLED', 'REFUSED', 'REPROVED', 'STARTED', 'VALIDATION_PENDING'],
        progress__lte: '0.5',
        mission__language__in: ['pt-BR', 'es', 'us'],
        job__name__in: ['MOCKED_JOB_1', 'MOCKED_JOB_2'],
        job_function__name__in: ['MOCKED_JOB_FUNCTIONS'],
        activity_gte_date: '2023-11-01',
        activity_lte_date: '2023-11-01',
      };

      dialogMock.open.mockReturnValueOnce({ afterClosed: jest.fn(() => of(mockFilterValue)) } as any);

      service.openDialog(ReportType.MISSION_ENROLLMENTS).subscribe((result) => {
        expect(result).toEqual(expectedResult);
        done();
      });
    });
  });
});
