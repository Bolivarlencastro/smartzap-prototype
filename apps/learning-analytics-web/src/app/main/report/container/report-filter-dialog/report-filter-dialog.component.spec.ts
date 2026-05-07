import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReportFilterDialogComponent, ReportFilterDialogData } from './report-filter-dialog.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportType } from 'app/main/report/enums/report';
import { reportFiltersFeature, reportFiltersInitialState } from 'app/main/report/store/features';
import { ReportFiltersSearch } from 'app/main/report/interfaces/report-filters-search';
import { ReportFiltersActions } from 'app/main/report/store/actions';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('ReportFilterDialogComponent', () => {
  let component: ReportFilterDialogComponent;
  let fixture: ComponentFixture<ReportFilterDialogComponent>;
  let storeMock: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let dialogRefMock: jest.Mocked<MatDialogRef<ReportFilterDialogComponent>>;
  const dialogDataMock: ReportFilterDialogData = { reportType: ReportType.MISSION_ENROLLMENTS };

  beforeEach(async () => {
    dialogRefMock = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<ReportFilterDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [ReportFilterDialogComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { [reportFiltersFeature.name]: reportFiltersInitialState } }),
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogDataMock },
      ],
    }).compileComponents();

    storeMock = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReportFilterDialogComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(storeMock, 'dispatch');
    fixture.detectChanges();
  });

  describe('autocomplete filters', () => {
    it('should dispatch the filter action for the channels formControl', fakeAsync(() => {
      component.channelsAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'channels' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));

    it('should dispatch the filter action for the leaders formControl', fakeAsync(() => {
      component.leadersAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'leaders' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));

    it('should dispatch the filter action for the creators formControl', fakeAsync(() => {
      component.creatorsAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'creators' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));

    it('should dispatch the filter action for the providers formControl', fakeAsync(() => {
      component.providersAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'providers' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));

    it('should dispatch the filter action for the missions formControl', fakeAsync(() => {
      component.missionsAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'missions' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));

    it('should dispatch the filter action for the trails formControl', fakeAsync(() => {
      component.trailsAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'trails' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));

    it('should dispatch the filter action for the categories formControl', fakeAsync(() => {
      component.categoriesAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'categories' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));

    it('should dispatch the filter action for the groups formControl', fakeAsync(() => {
      component.groupsAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'groups' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));

    it('should dispatch the filter action for the users formControl', fakeAsync(() => {
      component.usersAcFormControl.setValue('search');
      tick(260);

      const expectedSearch: ReportFiltersSearch = { search: 'search', searchType: 'users' };
      expect(dispatchSpy).toHaveBeenCalledWith(ReportFiltersActions.filterSelectOptions({ search: expectedSearch }));
    }));
  });

  describe('onFilter', () => {
    it('should close the dialog with the filter and formControl state', () => {
      component.onFilter();

      expect(dialogRefMock.close).toHaveBeenCalledWith({});
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

  describe('optionsCompare', () => {
    it('should return true if two options have the same value', () => {
      const option1: KpFilterSelectOption = { label: 'mock_label', value: 'mock_id' };
      const option2: KpFilterSelectOption = { label: 'mock_label', value: 'mock_id' };

      const result = component.optionsCompare(option1, option2);

      expect(result).toBe(true);
    });
  });
});
