import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import { of } from 'rxjs';
import { EnrollmentsFilterModalComponent } from '../containers/enrollments-filter-modal/enrollments-filter-modal.component';
import { EnrollmentFilter, EnrollmentType, EnrollmentFiltersSearch } from '../model/enrollment-filter';
import { EnrollmentsFilterService } from './enrollments-filter.service';

describe('EnrollmentsFilterService', () => {
  let service: EnrollmentsFilterService;
  let matDialog: MatDialog;
  let konquestApi: KonquestAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnrollmentsFilterService,
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(() => ({
              afterClosed: jest.fn(() => of({})),
            })),
          },
        },
        {
          provide: KonquestAPI,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(EnrollmentsFilterService);
    matDialog = TestBed.inject(MatDialog);
    konquestApi = TestBed.inject(KonquestAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openFiltersDialog', () => {
    it('should open filters dialog with correct data for MISSION type', () => {
      const type: EnrollmentType = 'MISSION';
      const expectedFilterOptions = service.getFilterOptions(type);

      service.openFiltersDialog(type);

      expect(matDialog.open).toHaveBeenCalledWith(EnrollmentsFilterModalComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
        data: { filterOptions: expectedFilterOptions, type },
      });
    });

    it('should open filters dialog with correct data for LEARNING_TRAIL type', () => {
      const type: EnrollmentType = 'LEARNING_TRAIL';
      const expectedFilterOptions = service.getFilterOptions(type);

      service.openFiltersDialog(type);

      expect(matDialog.open).toHaveBeenCalledWith(EnrollmentsFilterModalComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
        data: { filterOptions: expectedFilterOptions, type },
      });
    });
  });

  describe('getStatusOptions', () => {
    it('should return all status options for non-LEARNING_TRAIL types', () => {
      const type: EnrollmentType = 'MISSION';
      const options = service.getStatusOptions(type);

      expect(options).toEqual([
        { value: 'COMPLETED', label: 'ENROLLMENT.STATUS.COMPLETED' },
        { value: 'ENROLLED', label: 'ENROLLMENT.STATUS.ENROLLED' },
        { value: 'GIVE_UP', label: 'ENROLLMENT.STATUS.GIVE_UP' },
        { value: 'REPROVED', label: 'ENROLLMENT.STATUS.REPROVED' },
        { value: 'STARTED', label: 'ENROLLMENT.STATUS.STARTED' },
        { value: 'EXPIRED', label: 'ENROLLMENT.STATUS.EXPIRED' },
        { value: 'INACTIVATED', label: 'ENROLLMENT.STATUS.INACTIVATED' },
        { value: 'PENDING_VALIDATION', label: 'ENROLLMENT.STATUS.PENDING_VALIDATION' },
        { value: 'REFUSED', label: 'ENROLLMENT.STATUS.REFUSED' },
        { value: 'REQUEST_EXTENSION', label: 'ENROLLMENT.STATUS.REQUEST_EXTENSION' },
      ]);
    });

    it('should return limited status options for LEARNING_TRAIL type', () => {
      const type: EnrollmentType = 'LEARNING_TRAIL';
      const options = service.getStatusOptions(type);

      expect(options).toEqual([
        { value: 'COMPLETED', label: 'ENROLLMENT.STATUS.COMPLETED' },
        { value: 'ENROLLED', label: 'ENROLLMENT.STATUS.ENROLLED' },
        { value: 'GIVE_UP', label: 'ENROLLMENT.STATUS.GIVE_UP' },
        { value: 'REPROVED', label: 'ENROLLMENT.STATUS.REPROVED' },
        { value: 'STARTED', label: 'ENROLLMENT.STATUS.STARTED' },
      ]);
    });
  });

  describe('getSelectOptions', () => {
    it('should fetch categories when searchType is "categories"', () => {
      const searchParams: EnrollmentFiltersSearch = {
        search: 'test',
        searchType: 'categories',
      };

      const mockResponse = {
        results: [
          { id: '1', name: 'Category 1' },
          { id: '2', name: 'Category 2' },
        ],
      };

      (konquestApi.get as jest.Mock).mockReturnValue(of(mockResponse));

      service.getSelectOptions(searchParams).subscribe((result) => {
        expect(result).toEqual([
          { value: '1', label: 'Category 1' },
          { value: '2', label: 'Category 2' },
        ]);
      });

      expect(konquestApi.get).toHaveBeenCalledWith('/missions/categories', { search: 'test' });
    });

    it('should fetch instructors when searchType is "instructors"', () => {
      const searchParams: EnrollmentFiltersSearch = {
        search: 'test',
        searchType: 'instructors',
      };

      const mockResponse = {
        data: [
          { id: '1', name: 'Instructor 1' },
          { id: '2', name: 'Instructor 2' },
        ],
      };

      (konquestApi.get as jest.Mock).mockReturnValue(of(mockResponse));

      service.getSelectOptions(searchParams).subscribe((result) => {
        expect(result).toEqual([
          { value: '1', label: 'Instructor 1' },
          { value: '2', label: 'Instructor 2' },
        ]);
      });

      expect(konquestApi.get).toHaveBeenCalledWith('/accounts/users/instructors', { search: 'test' });
    });
  });

  describe('parseFilter', () => {
    it('should convert performance values to percent representation', () => {
      const originalFilter: EnrollmentFilter = {
        performance__gte: '10',
        performance__lte: '20',
      };

      const expectedResult: EnrollmentFilter = {
        performance__gte: '0.1',
        performance__lte: '0.2',
      };

      expect(EnrollmentsFilterService.parseFilter(originalFilter)).toEqual(expectedResult);
    });

    it('should handle invalid performance values', () => {
      const originalFilter: EnrollmentFilter = {
        performance__gte: 'invalid',
        performance__lte: 'abc',
      };

      const expectedResult: EnrollmentFilter = {
        performance__gte: null,
        performance__lte: null,
      };

      expect(EnrollmentsFilterService.parseFilter(originalFilter)).toEqual(expectedResult);
    });

    it('should normalize auto-complete options for mission_category and instructor', () => {
      const originalFilter: EnrollmentFilter = {
        mission_category: [{ value: '1', label: 'Category 1' } as any, { value: '2', label: 'Category 2' } as any],
        instructor: [{ value: '3', label: 'Instructor 1' } as any, { value: '4', label: 'Instructor 2' } as any],
      };

      const expectedResult: EnrollmentFilter = {
        mission_category: ['1', '2'],
        instructor: ['3', '4'],
        performance__gte: null,
        performance__lte: null,
      };

      expect(EnrollmentsFilterService.parseFilter(originalFilter)).toEqual(expectedResult);
    });
  });
});
