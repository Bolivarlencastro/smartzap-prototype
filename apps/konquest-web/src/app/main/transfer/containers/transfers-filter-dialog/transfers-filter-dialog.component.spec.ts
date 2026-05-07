import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TransfersFilterDialogComponent } from './transfers-filter-dialog.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TransfersFiltersActions } from '../../store/actions';
import { transfersFiltersFeature, transfersFiltersInitialState } from 'app/main/transfer/store/features';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { TransfersFiltersResult } from 'app/main/transfer/models/transfers-filters-result';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('TransfersFilterDialogComponent', () => {
  let component: TransfersFilterDialogComponent;
  let fixture: ComponentFixture<TransfersFilterDialogComponent>;
  let storeMock: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let dialogRefMock: jest.Mocked<MatDialogRef<TransfersFilterDialogComponent>>;

  beforeEach(() => {
    dialogRefMock = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<TransfersFilterDialogComponent>>;

    TestBed.configureTestingModule({
      imports: [TransfersFilterDialogComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { [transfersFiltersFeature.name]: transfersFiltersInitialState } }),
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    });

    storeMock = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TransfersFilterDialogComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(storeMock, 'dispatch');
    fixture.detectChanges();
  });

  describe('autocomplete filters', () => {
    it('should dispatch the filter action for the origin workspace formControl', fakeAsync(() => {
      component.originAcFormControl.setValue('search');
      tick(260);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TransfersFiltersActions.filterSelectOptions({
          search: 'search',
          searchType: 'origin',
        }),
      );
    }));

    it('should dispatch the filter action for the destination workspace formControl', fakeAsync(() => {
      component.destinationAcFormControl.setValue('search');
      tick(260);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TransfersFiltersActions.filterSelectOptions({
          search: 'search',
          searchType: 'destination',
        }),
      );
    }));
  });

  describe('onFilter', () => {
    it('should close the dialog with the filter and formControl state', () => {
      component.onFilter();

      const expectedState: TransfersFiltersResult = { filter: {}, controllerState: expect.anything() };
      expect(dialogRefMock.close).toHaveBeenCalledWith(expectedState);
    });
  });

  describe('shouldDisplayOption', () => {
    it('should return true if the option is not present on the currently displayed options', () => {
      const currentOptions: KpFilterSelectOption[] = [
        { label: 'mock_label', value: 'mock_id' },
        {
          label: 'mock_label',
          value: 'mock_id_2',
        },
      ];

      const shouldDisplay = component.shouldDisplayOption('mock_id_3', currentOptions);

      expect(shouldDisplay).toBe(true);
    });
  });

  describe('getSelectTriggerLabel', () => {
    it('should return the select trigger label based on the current values', () => {
      const options: KpFilterSelectOption[] = [
        { label: 'mock_label', value: 'mock_id' },
        {
          label: 'mock_label_2',
          value: 'mock_id_2',
        },
      ];

      const triggerLabel = component.getSelectTriggerLabel(options);

      expect(triggerLabel).toBe('mock_label, mock_label_2');
    });
  });

  describe('optionsCompare', () => {
    it('should return true if two options have the same value', () => {
      const option1: KpFilterSelectOption = { label: 'mock_label', value: 'mock_id' };
      const option2: KpFilterSelectOption = { label: 'mock_label', value: 'mock_id' };

      const result = component.optionsCompare(option1, option2);

      expect(result).toBe(true);
    });
  });
});
