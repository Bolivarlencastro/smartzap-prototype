import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReportModalListComponent } from '../../components/report-modal-list/report-modal-list.component';
import { ReportType } from '../../enums/report';
import { FilterDialogData } from '../../interfaces';
import { ReportActions, SimpleFilterReportActions } from '../../store/actions';
import { initialState } from '../../store/reducers/simple-filter-report.reducer';
import { ReportModalComponent } from './report-modal.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';

const mockData: FilterDialogData = {
  title: 'Test Title',
  subtitle: 'Test Subtitle',
  reportType: ReportType.USER_OVERVIEW,
  columnTitle: 'Test Column Title',
  selectionLabel: 'Test Selection Label',
};

describe('ReportModalComponent', () => {
  let component: ReportModalComponent;
  let fixture: ComponentFixture<ReportModalComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: { ['simpleFilterReport']: initialState },
        }),
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        provideNoopAnimations(),
      ],
      imports: [ReportModalComponent, getTranslocoTestingModule(), MatIconTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    jest.spyOn(store, 'select');

    fixture = TestBed.createComponent(ReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch loadFilterItems action on init', () => {
    const filter = { page: 1, reportType: ReportType.USER_OVERVIEW, search: '' };

    expect(store.dispatch).toHaveBeenCalledWith(SimpleFilterReportActions.loadFilterItems({ filter }));
  });

  it('should dispatch clear action on destroy', () => {
    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(SimpleFilterReportActions.clear());
  });

  it('should dispatch searchItems action', () => {
    const search = 'test';
    const filter = { page: 1, reportType: ReportType.USER_OVERVIEW, search };

    component.onSearch(search);

    expect(store.dispatch).toHaveBeenCalledWith(SimpleFilterReportActions.searchItems({ filter }));
  });

  it('should dispatch fetchMoreItems action', () => {
    component.fetchMoreItems();

    expect(store.dispatch).toHaveBeenCalledWith(SimpleFilterReportActions.fetchMoreItems());
  });

  it('should dispatch getReport action', () => {
    component.selectionList = {
      selection: {
        selected: [{ id: '1' }, { id: '2' }],
      },
    } as ReportModalListComponent;

    component.reportGenerate();

    expect(store.dispatch).toHaveBeenCalledWith(
      ReportActions.getReport({ filter: { reportType: ReportType.USER_OVERVIEW, objectIds: ['1', '2'] } }),
    );
  });
});
