import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { ActivityLogFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as ActivityLogActions from '../../store/activity-log/activity-log.actions';
import { ACTIVITY_LOG_FEATURE_NAME, activityLogInitialState } from '../../store/activity-log/activity-log.feature';
import { ActivityLogComponent } from './activity-log.component';

describe('ActivityLogComponent', () => {
  let component: ActivityLogComponent;
  let fixture: ComponentFixture<ActivityLogComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [provideMockStore({ initialState: { [ACTIVITY_LOG_FEATURE_NAME]: activityLogInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should dispatch init on construction', () => {
      expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.init());
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch resetState', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.resetState());
    });
  });

  describe('filterByTerm', () => {
    it('should dispatch filterByTerm with the search term', () => {
      component.filterByTerm('test');
      expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.filterByTerm({ search: 'test' }));
    });
  });

  describe('onFilter', () => {
    it('should dispatch setFilter with the filter', () => {
      const filter: ActivityLogFilter = {
        createdDateGte: new Date(),
        createdDateLte: null,
        userId: 'u1',
        actionKey: null,
        status: 'PROCESSING',
      };

      component.onFilter(filter);

      expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.setFilter({ filter }));
    });
  });

  describe('onPageChange', () => {
    it('should dispatch setPagination with currentPage = pageIndex + 1', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 25, length: 100 };

      component.onPageChange(event);

      expect(store.dispatch).toHaveBeenCalledWith(
        ActivityLogActions.setPagination({ pagination: { currentPage: 3, perPage: 25 } }),
      );
    });
  });

  describe('onExport', () => {
    it('should dispatch exportLog with the log id', () => {
      component.onExport('log1');
      expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.exportLog({ id: 'log1' }));
    });
  });
});
