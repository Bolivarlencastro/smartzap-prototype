import { MatDialog } from '@angular/material/dialog';
import {
  EnrollmentsCyclesFilter,
  RegulatoryComplianceApi,
  UsersV2Api,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { CycleEnrollmentsFilterComponent } from '../containers';
import { RawCycleEnrollmentsFilter } from '../models';
import { CycleEnrollmentsFilterService } from './cycle-enrollments-filter.service';

describe('CycleEnrollmentsFilterService', () => {
  let service: CycleEnrollmentsFilterService;
  let dialogMock: jest.Mocked<MatDialog>;
  let regulatoryComplianceApiMock: jest.Mocked<RegulatoryComplianceApi>;
  let usersV2ApiMock: jest.Mocked<UsersV2Api>;

  beforeEach(() => {
    dialogMock = {
      open: jest.fn(() => ({
        afterClosed: jest.fn(() => of(true)),
        componentInstance: {},
      })),
    } as unknown as jest.Mocked<MatDialog>;

    regulatoryComplianceApiMock = {
      getCompliances: jest.fn().mockReturnValue(of([])),
      getLearningObjects: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<RegulatoryComplianceApi>;
    usersV2ApiMock = { fetchByQuery: jest.fn().mockReturnValue(of([])) } as unknown as jest.Mocked<any>;

    service = new CycleEnrollmentsFilterService(dialogMock, regulatoryComplianceApiMock, usersV2ApiMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openFiltersDialog', () => {
    it('should open confirmation the filter dialog', () => {
      service.openFiltersDialog();

      expect(dialogMock.open).toHaveBeenCalledWith(CycleEnrollmentsFilterComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
      });
    });
  });

  describe('filterAutocomplete', () => {
    it('should filter normatives', () => {
      service.filterAutocomplete('normatives', 'mock_search');

      expect(regulatoryComplianceApiMock.getCompliances).toHaveBeenCalledWith({
        page: 1,
        perPage: 15,
        search: 'mock_search',
      });
    });

    it('should filter learning objects', () => {
      service.filterAutocomplete('learningObjects', 'mock_search');

      expect(regulatoryComplianceApiMock.getLearningObjects).toHaveBeenCalledWith({
        page: 1,
        perPage: 15,
        search: 'mock_search',
      });
    });

    it('should filter users with the current workspace id', () => {
      const params = {
        search: 'mock_search',
        'filter.roles.role.application.id': '$in:0abf08ea-d252-4d7c-ab45-ab3f9135c288',
      };

      service.filterAutocomplete('users', 'mock_search');

      expect(usersV2ApiMock.fetchByQuery).toHaveBeenCalledWith(params);
    });

    it('should filter leaders with the current workspace id', () => {
      const params = {
        search: 'mock_search',
        'filter.roles.role.application.id': '$in:0abf08ea-d252-4d7c-ab45-ab3f9135c288',
      };

      service.filterAutocomplete('leaders', 'mock_search');

      expect(usersV2ApiMock.fetchByQuery).toHaveBeenCalledWith(params);
    });
  });

  describe('normalizeFilter', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('18 Jan 2024 08:00:00 GMT-0300'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should normalize a filter containing KpSelectOptions and dates', () => {
      const nowDateMock = new Date('2024-01-18T11:00:00Z');

      const rawFilter: RawCycleEnrollmentsFilter = {
        deadlineLte: nowDateMock,
        deadline: nowDateMock,
        deadlineGte: nowDateMock,
        userId: { value: 'mock_user_id', label: 'mock_user_label' },
        relatedUserLeaderId: { value: 'mock_leader_id', label: 'mock_leader_label' },
        complianceId: { value: 'mock_compliance_id', label: 'mock_compliance_label' },
        learningObjectId: { value: 'mock_learning_object_id', label: 'mock_learning_object_label' },
      };

      const expectedFilter: EnrollmentsCyclesFilter = {
        deadlineLte: '2024-01-18',
        deadlineGte: '2024-01-18',
        deadline: '2024-01-18',
        userId: 'mock_user_id',
        relatedUserLeaderId: 'mock_leader_id',
        complianceId: 'mock_compliance_id',
        learningObjectId: 'mock_learning_object_id',
      };

      const result = service.normalizeFilter({ filter: rawFilter, controllerState: undefined });
      expect(result).toMatchObject(expectedFilter);
    });

    it('should normalize a partial filter containing KpSelectOptions and dates', () => {
      const nowDateMock = new Date('2024-01-18T11:00:00Z');

      const rawFilter: RawCycleEnrollmentsFilter = {
        deadline: nowDateMock,
        userId: { value: 'mock_user_id', label: 'mock_user_label' },
      };

      const expectedFilter: EnrollmentsCyclesFilter = {
        deadline: '2024-01-18',
        userId: 'mock_user_id',
      };

      const result = service.normalizeFilter({ filter: rawFilter, controllerState: undefined });
      expect(result).toMatchObject(expectedFilter);
    });

    it('should handle an empty filter', () => {
      const rawFilter: RawCycleEnrollmentsFilter = {};

      const expectedFilter: EnrollmentsCyclesFilter = {};

      const result = service.normalizeFilter({ filter: rawFilter, controllerState: undefined });
      expect(result).toMatchObject(expectedFilter);
    });
  });
});
