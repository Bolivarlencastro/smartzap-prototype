import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';
import { FilterGroupConfig } from '../../model/filter-group-config';
import { FilterGroupConnector } from '../../model/filter-group-connector';
import { FilterGroupOperator } from '../../model/filter-group-operator';
import { FilterGroupType } from '../../model/filter-group-type';
import { FilterFormGroup } from '../../model/forms-models';
import { ReportFilterDialogService } from '../../services/report-filter-dialog.service';
import { FilterGroupComponent } from './filter-group.component';

function getTestFormGroup(): FormGroup<FilterFormGroup> {
  return new FormGroup<FilterFormGroup>({
    selector: new FormControl(),
    value: new FormControl(),
    operator: new FormControl<FilterGroupOperator>(FilterGroupOperator.IT_IS),
    connector: new FormControl<FilterGroupConnector>(FilterGroupConnector.WHERE),
  });
}

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

describe('FilterGroupComponent', () => {
  let component: FilterGroupComponent;
  let fixture: ComponentFixture<FilterGroupComponent>;
  let reportDialogService: jest.Mocked<ReportFilterDialogService>;
  let formGroup: FormGroup<FilterFormGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), FilterGroupComponent, NoopAnimationsModule],
      providers: [
        {
          provide: ReportFilterDialogService,
          useValue: { groupSelectorChanged: jest.fn().mockReturnValue(mockSelectors[0]) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterGroupComponent);
    component = fixture.componentInstance;
    formGroup = getTestFormGroup();
    component.filterFormGroup = formGroup;
    fixture.detectChanges();
    reportDialogService = TestBed.inject(ReportFilterDialogService) as jest.Mocked<ReportFilterDialogService>;
  });

  it('should emit removeFilterGroup', () => {
    const removeSpy = jest.spyOn(component.removeFilterGroup, 'emit');

    component.remove();

    expect(removeSpy).toHaveBeenCalled();
  });

  it('should call groupSelectorChanged when the current selector changes', () => {
    formGroup.get('selector').setValue('firstOption');

    expect(reportDialogService.groupSelectorChanged).toHaveBeenCalledWith(undefined, 'firstOption', undefined);
  });

  it('should update the operators if the new selector has them when the current selector changes', () => {
    const expectedSelector = mockSelectors[1];
    reportDialogService.groupSelectorChanged.mockReturnValue(expectedSelector);

    formGroup.get('selector').setValue('secondOption');

    expect(component.operators.getValue()).toEqual(expectedSelector.operators);
  });
});

describe('FilterGroupTestHostComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), FilterGroupComponent, NoopAnimationsModule],
      declarations: [TestHostComponent],
      providers: [{ provide: ReportFilterDialogService, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create TestHostComponent', () => {
    expect(component).toBeTruthy();
  });

  it(`should not have the ${FilterGroupConnector.WHERE} option if is not the first control`, () => {
    component.first = false;

    fixture.detectChanges();

    expect(component.filterGroupComponent.connectors).not.toContain(FilterGroupConnector.WHERE);
  });
});

@Component({
  selector: 'kp-test-host',
  template: ` <kp-filter-group [filterFormGroup]="formGroup" #filterGroupComponent [first]="first"></kp-filter-group> `,
  standalone: false,
})
class TestHostComponent {
  const;
  formGroup = getTestFormGroup();
  first = true;
  @ViewChild('filterGroupComponent') filterGroupComponent: FilterGroupComponent;
}
