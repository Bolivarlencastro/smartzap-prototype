import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleFilterDialogComponent } from './simple-filter-dialog.component';

import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../store/reducers/simple-filter-report.reducer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportType } from '../../enums/report';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ptBR } from 'date-fns/locale';

const mockState = {
  items: [
    {
      id: '1',
      label: 'Test',
    },
  ],
  loading: false,
  hasNoItems: false,
  multiple: true,
  count: 1,
};

describe('SimpleFilterDialogComponent', () => {
  let component: SimpleFilterDialogComponent;
  let fixture: ComponentFixture<SimpleFilterDialogComponent>;
  let store: jest.Mocked<Store>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFilterDialogComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            reportType: ReportType.USERS_ACCESS,
          },
        },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
        {
          provide: Store,
          useValue: {
            select: jest.fn(),
          },
        },
        provideMockStore({ initialState }),
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: ptBR },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    jest
      .spyOn(store, 'select')
      .mockReturnValueOnce(of(mockState.items))
      .mockReturnValueOnce(of(mockState.loading))
      .mockReturnValueOnce(of(mockState.hasNoItems))
      .mockReturnValueOnce(of(mockState.multiple))
      .mockReturnValueOnce(of(mockState.count));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should enable the apply button when at least one item is selected', () => {
    component.selectionList.selectionChange('1');
    fixture.detectChanges();

    expect(component.validFilter).toBeTruthy();
  });

  it('should enable the apply button when all items are selected', () => {
    component.toggleAll();
    fixture.detectChanges();

    expect(component.validFilter).toBe(true);
  });

  it('should not enable the apply button when the end date is past today', () => {
    const endDateControl = component.dateRange.get('time_start__lte');
    const invalidDate = new Date();
    invalidDate.setDate(invalidDate.getDate() + 1);

    endDateControl.setValue(invalidDate);

    expect(component.validFilter).toBe(false);
  });
});
