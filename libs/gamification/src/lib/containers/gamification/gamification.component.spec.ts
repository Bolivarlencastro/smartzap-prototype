import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { AuthService, KEEPS_DATE_FORMATS } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { enUS } from 'date-fns/locale';
import { GamificationListActions } from '../../store';
import { gamificationListInitialState } from '../../store/features';
import { getTranslocoTestingModule } from '../../util';
import { GamificationComponent } from './gamification.component';

describe('GamificationComponent', () => {
  let component: GamificationComponent;
  let fixture: ComponentFixture<GamificationComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamificationComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [
        provideMockStore({ initialState: { gamificationList: gamificationListInitialState } }),
        { provide: ActivatedRoute, useValue: { snapshot: { url: [{ path: 'general' }] } } },
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_LOCALE, useValue: enUS },
        { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
        { provide: AuthService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(GamificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should dispatch init with path and isMobile on construction', () => {
      expect(store.dispatch).toHaveBeenCalledWith(GamificationListActions.init({ path: 'general', isMobile: false }));
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch resetState', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(GamificationListActions.resetState());
    });
  });

  describe('filterByTerm', () => {
    it('should dispatch filterByTerm with the search term', () => {
      component.filterByTerm('test');
      expect(store.dispatch).toHaveBeenCalledWith(GamificationListActions.filterByTerm({ search: 'test' }));
    });
  });

  describe('onPageChange', () => {
    it('should dispatch setPagination with currentPage = pageIndex + 1', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 25, length: 100 };

      component.onPageChange(event);

      expect(store.dispatch).toHaveBeenCalledWith(
        GamificationListActions.setPagination({ pagination: { currentPage: 3, perPage: 25 } }),
      );
    });
  });

  describe('filterByDateRange', () => {
    it('should dispatch filterByDateRange with the date range', () => {
      const dateRange = { startDate: new Date('2024-02-01'), endDate: new Date('2024-02-25') };

      component.filterByDateRange(dateRange);

      expect(store.dispatch).toHaveBeenCalledWith(GamificationListActions.filterByDateRange({ dateRange }));
    });
  });

  describe('cleanFilter', () => {
    it('should dispatch cleanFilter', () => {
      component.cleanFilter();
      expect(store.dispatch).toHaveBeenCalledWith(GamificationListActions.cleanFilter());
    });
  });

  describe('cleanDateRangeFilter', () => {
    it('should dispatch cleanDateRangeFilter', () => {
      component.cleanDateRangeFilter();
      expect(store.dispatch).toHaveBeenCalledWith(GamificationListActions.cleanDateRangeFilter());
    });
  });
});
