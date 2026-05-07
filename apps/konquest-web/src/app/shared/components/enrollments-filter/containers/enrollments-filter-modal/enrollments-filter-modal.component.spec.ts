import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { provideMockStore } from '@ngrx/store/testing';
import { enrollmentsFilterInitialState } from '../../store';
import { EnrollmentsFilterModalComponent } from './enrollments-filter-modal.component';

const mockData = {
  type: 'EVENT',
  filterOptions: [
    {
      filterKey: 'created_date',
      type: 'dateRange',
      label: 'ENROLLMENTS.FILTER.ENROLLMENT_CREATION_DATE',
      rangeConfig: { fromKey: 'created_date__gte', toKey: 'created_date__lte' },
      rangeOptions: ['less', 'more', 'between'],
    },
    {
      filterKey: 'event_date',
      type: 'dateRange',
      label: 'ENROLLMENTS.FILTER.ENROLLMENT_OCCURRENCE_DATE',
      rangeConfig: { fromKey: 'event_date__gte', toKey: 'event_date__lte' },
      rangeOptions: ['less', 'more', 'between'],
    },
    {
      filterKey: 'start_date',
      type: 'dateRange',
      label: 'ENROLLMENTS.FILTER.START_DATE',
      rangeConfig: {
        fromKey: 'start_date__gte',
        toKey: 'start_date__lte',
      },
      rangeOptions: ['less', 'more', 'between'],
    },
    {
      filterKey: 'end_date',
      type: 'dateRange',
      label: 'ENROLLMENTS.FILTER.END_DATE',
      rangeConfig: {
        fromKey: 'end_date__gte',
        toKey: 'end_date__lte',
      },
      rangeOptions: ['less', 'more', 'between'],
    },
    {
      filterKey: 'performance',
      type: 'percentRange',
      rangeConfig: { fromKey: 'performance__gte', toKey: 'performance__lte' },
      rangeOptions: ['less', 'more', 'between'],
      label: 'ENROLLMENTS.FILTER.PERFORMANCE',
    },
    {
      filterKey: 'status',
      type: 'selectMultiple',
      label: 'ENROLLMENTS.FILTER.STATUS',
      options: [
        { value: 'COMPLETED', label: 'ENROLLMENT.STATUS.COMPLETED' },
        { value: 'ENROLLED', label: 'ENROLLMENT.STATUS.ENROLLED' },
        { value: 'GIVE_UP', label: 'ENROLLMENT.STATUS.GIVE_UP' },
        { value: 'REPROVED', label: 'ENROLLMENT.STATUS.REPROVED' },
        { value: 'STARTED', label: 'ENROLLMENT.STATUS.STARTED' },
      ],
    },
    {
      filterKey: 'mission_category',
      type: 'autoComplete',
      customTemplate: 'categoriesAc',
      label: 'ENROLLMENTS.FILTER.CATEGORY',
    },
    {
      filterKey: 'instructor',
      type: 'autoComplete',
      customTemplate: 'instructorsAc',
      label: 'ENROLLMENTS.FILTER.INSTRUCTOR',
    },
  ],
};

describe('EnrollmentsFilterModalComponent', () => {
  let component: EnrollmentsFilterModalComponent;
  let fixture: ComponentFixture<EnrollmentsFilterModalComponent>;
  let matDialogRef: MatDialogRef<EnrollmentsFilterModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnrollmentsFilterModalComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { ['enrollmentsFilter']: enrollmentsFilterInitialState } }),
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    });

    matDialogRef = TestBed.inject(MatDialogRef);

    fixture = TestBed.createComponent(EnrollmentsFilterModalComponent);
    component = fixture.componentInstance;

    component['filterController'] = {
      getControllerState: jest.fn().mockReturnValue({
        options: mockData.filterOptions,
        selectedOptions: [],
      }),
    } as any;

    fixture.detectChanges();
  });

  describe('shouldDisplayOption', () => {
    it('should return true when option value is not in current selection', () => {
      const currentOptions: KpFilterSelectOption[] = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ];

      expect(component.shouldDisplayOption('3', currentOptions)).toBe(true);
    });

    it('should return false when option value is already in current selection', () => {
      const currentOptions: KpFilterSelectOption[] = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ];

      expect(component.shouldDisplayOption('1', currentOptions)).toBe(false);
      expect(component.shouldDisplayOption('2', currentOptions)).toBe(false);
    });

    it('should return true when currentOptions is empty', () => {
      expect(component.shouldDisplayOption('1', [])).toBe(true);
    });
  });

  describe('optionsTrackBy', () => {
    it('should return the option value as string', () => {
      const option: KpFilterSelectOption = { value: '123', label: 'Test Option' };
      expect(component.optionsTrackBy(0, option)).toBe('123');
    });

    it('should return value even when label is missing', () => {
      const option = { value: '456' } as KpFilterSelectOption;
      expect(component.optionsTrackBy(0, option)).toBe('456');
    });
  });

  describe('optionsCompare', () => {
    it('should return true when both options have same value', () => {
      const option1: KpFilterSelectOption = { value: '1', label: 'Option 1' };
      const option2: KpFilterSelectOption = { value: '1', label: 'Option 1' };

      expect(component.optionsCompare(option1, option2)).toBe(true);
    });

    it('should return false when options have different values', () => {
      const option1: KpFilterSelectOption = { value: '1', label: 'Option 1' };
      const option2: KpFilterSelectOption = { value: '2', label: 'Option 2' };

      expect(component.optionsCompare(option1, option2)).toBe(false);
    });

    it('should return true when both options are null or undefined', () => {
      expect(component.optionsCompare(null as any, null as any)).toBe(true);
      expect(component.optionsCompare(undefined as any, undefined as any)).toBe(true);
    });

    it('should return false when one option is null and other has value', () => {
      const option: KpFilterSelectOption = { value: '1', label: 'Option 1' };

      expect(component.optionsCompare(option, null as any)).toBe(false);
      expect(component.optionsCompare(null as any, option)).toBe(false);
    });
  });

  describe('getSelectTriggerLabel', () => {
    it('should return empty string when value is null or undefined', () => {
      expect(component.getSelectTriggerLabel(null as any)).toBe('');
      expect(component.getSelectTriggerLabel(undefined as any)).toBe('');
    });

    it('should return empty string when array is empty', () => {
      expect(component.getSelectTriggerLabel([])).toBe('');
    });

    it('should return single label when array has one item', () => {
      const options: KpFilterSelectOption[] = [{ value: '1', label: 'Option 1' }];

      expect(component.getSelectTriggerLabel(options)).toBe('Option 1');
    });

    it('should return comma-separated labels for multiple items', () => {
      const options: KpFilterSelectOption[] = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ];

      expect(component.getSelectTriggerLabel(options)).toBe('Option 1, Option 2, Option 3');
    });

    it('should handle options without label gracefully', () => {
      const options: any[] = [{ value: '1' }, { value: '2', label: 'Option 2' }];

      expect(component.getSelectTriggerLabel(options)).toBe(', Option 2');
    });
  });

  describe('onFilter', () => {
    let closeSpy: jest.SpyInstance;

    beforeEach(() => {
      closeSpy = jest.spyOn(matDialogRef, 'close');
    });

    it('should close dialog with filter values for all EVENT fields', () => {
      const form = new FormGroup({
        status: new FormControl(['GIVE_UP', 'COMPLETED']),

        created_date: new FormControl(new Date('2023-01-01T10:00:00.000Z')),
        created_date__gte: new FormControl(new Date('2023-01-01T10:00:00.000Z')),
        created_date__lte: new FormControl(new Date('2023-01-31T10:00:00.000Z')),

        event_date: new FormControl(new Date('2023-02-01T10:00:00.000Z')),
        event_date__gte: new FormControl(new Date('2023-02-01T10:00:00.000Z')),
        event_date__lte: new FormControl(new Date('2023-02-28T10:00:00.000Z')),

        start_date: new FormControl(new Date('2023-03-01T10:00:00.000Z')),
        start_date__gte: new FormControl(new Date('2023-03-01T10:00:00.000Z')),
        start_date__lte: new FormControl(new Date('2023-03-31T10:00:00.000Z')),

        end_date: new FormControl(new Date('2023-04-01T10:00:00.000Z')),
        end_date__gte: new FormControl(new Date('2023-04-01T10:00:00.000Z')),
        end_date__lte: new FormControl(new Date('2023-04-30T10:00:00.000Z')),

        performance__gte: new FormControl('0.1'),
        performance__lte: new FormControl('0.9'),

        mission_category: new FormControl([{ value: 'cat1', label: 'Category 1' }]),
        instructor: new FormControl([{ value: 'inst1', label: 'Instructor 1' }]),
      });

      const expectedFilter = {
        status: ['GIVE_UP', 'COMPLETED'],
        created_date: '2023-01-01',
        created_date__gte: '2023-01-01',
        created_date__lte: '2023-01-31',
        event_date: '2023-02-01',
        event_date__gte: '2023-02-01',
        event_date__lte: '2023-02-28',
        start_date: '2023-03-01',
        start_date__gte: '2023-03-01',
        start_date__lte: '2023-03-31',
        end_date: '2023-04-01',
        end_date__gte: '2023-04-01',
        end_date__lte: '2023-04-30',
        performance__gte: '0.1',
        performance__lte: '0.9',
        mission_category: [{ value: 'cat1', label: 'Category 1' }],
        instructor: [{ value: 'inst1', label: 'Instructor 1' }],
      };

      component.filterFormGroup = form;
      component.onFilter();

      expect(closeSpy).toHaveBeenCalledWith({
        filter: expectedFilter,
        controllerState: expect.any(Object),
      });
    });

    it('should handle string dates without converting', () => {
      const form = new FormGroup({
        start_date: new FormControl('2023-01-01'),
        end_date: new FormControl('2023-12-31'),
      });

      component.filterFormGroup = form;
      component.onFilter();

      expect(closeSpy).toHaveBeenCalledWith({
        filter: {
          start_date: '2023-01-01',
          end_date: '2023-12-31',
        },
        controllerState: expect.any(Object),
      });
    });

    it('should exclude null, undefined, and empty values', () => {
      const form = new FormGroup({
        status: new FormControl(null),
        start_date: new FormControl(''),
        end_date: new FormControl(undefined),
        performance__gte: new FormControl('0.5'),
      });

      component.filterFormGroup = form;
      component.onFilter();

      expect(closeSpy).toHaveBeenCalledWith({
        filter: {
          performance__gte: '0.5',
        },
        controllerState: expect.any(Object),
      });
    });

    it('should handle empty form (no values)', () => {
      const form = new FormGroup({});

      component.filterFormGroup = form;
      component.onFilter();

      expect(closeSpy).toHaveBeenCalledWith({
        filter: {},
        controllerState: expect.any(Object),
      });
    });

    it('should include controller state in result', () => {
      const mockControllerState = { some: 'state' };
      component['filterController'].getControllerState = jest.fn().mockReturnValue(mockControllerState);

      const form = new FormGroup({
        status: new FormControl(['GIVE_UP']),
      });

      component.filterFormGroup = form;
      component.onFilter();

      expect(closeSpy).toHaveBeenCalledWith({
        filter: { status: ['GIVE_UP'] },
        controllerState: mockControllerState,
      });
    });
  });
});
