import { DialogRef } from '@angular/cdk/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';
import { getTranslocoTestingModule } from '../../../transloco-testing.module';
import { FilterGroupConfig } from '../model/filter-group-config';
import { FilterGroupOperator } from '../model/filter-group-operator';
import { FilterGroupType } from '../model/filter-group-type';
import { DialogForm, FilterFormGroup } from '../model/forms-models';
import { KpReportFilterDialogData } from '../model/report-filter-dialog-data';
import { ReportFilterDialogService } from '../services/report-filter-dialog.service';
import { KpReportFilterDialogComponent } from './kp-report-filter-dialog.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';

const mockSelectors: FilterGroupConfig[] = [
  {
    value: 'firstOption',
    label: 'firstOption',
    type: FilterGroupType.SELECT,
    operators: [FilterGroupOperator.IT_IS, FilterGroupOperator.IS_NOT],
    options: [],
  },
  {
    value: 'secondOption',
    label: 'secondOption',
    type: FilterGroupType.DURATION_RANGE,
    operators: [FilterGroupOperator.IT_IS, FilterGroupOperator.IS_NOT],
  },
];

const mockData: KpReportFilterDialogData = {
  title: 'mock_title',
  selectors: mockSelectors,
};

const mockForm: FormGroup<DialogForm> = new FormGroup<DialogForm>({
  filters: new FormArray<FormGroup<FilterFormGroup>>([]),
});

const mockFilterResult = { filters: {} };

const mockService = {
  addFilterGroup: jest.fn(),
  removeFilterGroup: jest.fn(),
  clearFilters: jest.fn(),
  getFilterValue: jest.fn().mockReturnValue(mockFilterResult),
  filterForm$: of(mockForm),
  selectors$: of([]),
  setOptions: jest.fn(),
  restoreFilter: jest.fn(),
};

describe('KpReportFilterDialogComponent', () => {
  let component: KpReportFilterDialogComponent;
  let fixture: ComponentFixture<KpReportFilterDialogComponent>;
  let filterDialogServiceMock: jest.Mocked<ReportFilterDialogService>;
  let dialogMock: jest.Mocked<DialogRef>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpReportFilterDialogComponent, MatIconTestingModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn(), afterOpened: jest.fn().mockReturnValue(of(EMPTY)) },
        },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        {
          provide: ReportFilterDialogService,
          useValue: mockService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(KpReportFilterDialogComponent, {
        set: {
          providers: [
            {
              provide: ReportFilterDialogService,
              useValue: mockService,
            },
          ],
        },
      })
      .compileComponents();

    filterDialogServiceMock = TestBed.inject(ReportFilterDialogService) as jest.Mocked<ReportFilterDialogService>;
    dialogMock = TestBed.inject(MatDialogRef) as any;
    fixture = TestBed.createComponent(KpReportFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call restoreFilter', () => {
    expect(filterDialogServiceMock.restoreFilter).toHaveBeenCalled();
  });

  it('should call addFilterGroup', () => {
    component.add();
    expect(filterDialogServiceMock.addFilterGroup).toHaveBeenCalled();
  });

  it('should call removeFilterGroup', () => {
    component.removeFilterGroup(1);
    expect(filterDialogServiceMock.removeFilterGroup).toHaveBeenCalledWith(1, undefined);
  });

  it('should call clearFilters', () => {
    component.clearFilters();
    expect(filterDialogServiceMock.clearFilters).toHaveBeenCalled();
  });

  it('should close returning the filterValue', () => {
    component.generateReport();
    expect(dialogMock.close).toHaveBeenCalledWith(mockFilterResult);
  });
});
