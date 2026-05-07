import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { evaluationsFilterInitialState } from '../../store/reducers/evaluations-filter.reducer';
import { EvaluationsFilterModalComponent } from './evaluations-filter-modal.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

const mockData = { id: '123' };

describe('EvaluationsFilterModalComponent', () => {
  let component: EvaluationsFilterModalComponent;
  let fixture: ComponentFixture<EvaluationsFilterModalComponent>;
  let matDialogRef: MatDialogRef<EvaluationsFilterModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EvaluationsFilterModalComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { ['evaluations-filter']: evaluationsFilterInitialState } }),
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    });

    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<EvaluationsFilterModalComponent>>;

    fixture = TestBed.createComponent(EvaluationsFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter', () => {
    const spy = jest.spyOn(matDialogRef, 'close');
    const form = new FormGroup({
      created_date__gte: new FormControl(new Date('2022-01-01T08:00:00.000Z')),
      created_date__lte: new FormControl(new Date('2023-12-01T08:00:00.000Z')),
      sentiment_analysis: new FormControl('POSITIVE'),
    });
    const controllerState = {
      options: [
        {
          filterKey: 'created_date',
          label: 'EVALUATIONS_FILTER.EVALUATION_DATE',
          rangeConfig: {
            fromKey: 'created_date__gte',
            toKey: 'created_date__lte',
          },
          rangeOptions: ['less', 'more', 'between'],
          type: 'dateRange',
        },
        {
          filterKey: 'sentiment_analysis',
          label: 'EVALUATIONS_FILTER.COMMENT_TYPE',
          options: [
            {
              label: 'EVALUATIONS_FILTER.COMMENT_TYPE_OPTIONS.POSITIVE',
              value: 'POSITIVE',
            },
            {
              label: 'EVALUATIONS_FILTER.COMMENT_TYPE_OPTIONS.NEGATIVE',
              value: 'NEGATIVE',
            },
            {
              label: 'EVALUATIONS_FILTER.COMMENT_TYPE_OPTIONS.NEUTRAL',
              value: 'NEUTRAL',
            },
          ],
          type: 'select',
        },
      ],
      selectedOptions: [],
    };
    const result = {
      filter: {
        mission__id: component.data.id,
        created_date__gte: '2022-01-01',
        created_date__lte: '2023-12-01',
        sentiment_analysis: 'POSITIVE',
      },
      controllerState,
    };

    component.filterFormGroup = form;
    fixture.detectChanges();

    component.onFilter();
    expect(spy).toHaveBeenCalledWith(result);
  });
});
