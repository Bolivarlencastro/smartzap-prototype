import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { SettingsEnrollmentsComponent } from './enrollments.component';
import { initialState } from '../../store/reducers/enrollments.reducer';
import { EnrollmentsActions } from '../../store/actions';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ptBR } from 'date-fns/locale';

describe('SettingsEnrollmentsComponent', () => {
  let component: SettingsEnrollmentsComponent;
  let fixture: ComponentFixture<SettingsEnrollmentsComponent>;
  let store: Store;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsEnrollmentsComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { settings: { enrollments: initialState } } }),
        provideDateFnsAdapter(),
        {
          provide: MAT_DATE_LOCALE,
          useValue: ptBR,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('onPageChanged', () => {
    it('should fire setPagination action when page is changed', () => {
      const event: PageEvent = { pageIndex: 0, previousPageIndex: 0, pageSize: 0, length: 0 };
      const payload = { page: event.pageIndex + 1, perPage: event.pageSize };
      const action = EnrollmentsActions.setPagination({ payload });

      component.onPageChanged(event);

      expect(dispatchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe('onSortChanged', () => {
    it('should fire setSort action when sort params is changed', () => {
      const event: Sort = { active: 'name', direction: 'asc' };
      const payload = { field: event.active, direction: event.direction };
      const action = EnrollmentsActions.setSort({ payload });

      component.onSortChanged(event);

      expect(dispatchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe('onDeleteEnrollment', () => {
    it('should fire deleteEnrollment', () => {
      const enrollment = { id: 'enrollmentId' } as any;
      const action = EnrollmentsActions.deleteEnrollment({ payload: { id: enrollment.id } });

      component.onDeleteEnrollment(enrollment);

      expect(dispatchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe('onReenroll', () => {
    it('should fire reenroll', () => {
      const enrollment = { course_id: 'courseId', user_id: 'userId' } as any;
      const action = EnrollmentsActions.reenroll({
        payload: { courseId: enrollment.course_id, userId: enrollment.user_id },
      });

      component.onReenroll(enrollment);

      expect(dispatchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe('onOpenActivities', () => {
    it('should fire openEnrollmentActivities action', () => {
      const enrollment = {} as any;
      const action = EnrollmentsActions.openEnrollmentActivities({ payload: enrollment });

      component.onOpenActivities(enrollment);

      expect(dispatchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe('onFilter', () => {
    it('should preserve search while applying other filters', () => {
      const filter = { status__in: 'STARTED' } as any;
      const action = EnrollmentsActions.setFilter({ payload: { ...filter, search: undefined } });

      component.onFilter(filter);

      expect(dispatchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe('onCancelEnrollment', () => {
    it('should fire cancelEnrollment', () => {
      const enrollment = { id: 'enrollmentID' } as any;
      const action = EnrollmentsActions.cancelEnrollment({ payload: enrollment });

      component.onCancelEnrollment(enrollment);

      expect(dispatchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch the resetState action', () => {
      component.ngOnDestroy();

      expect(dispatchSpy).toHaveBeenCalledWith(EnrollmentsActions.resetState());
    });
  });
});
