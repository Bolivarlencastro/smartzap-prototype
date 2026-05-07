import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Enrollment } from '@core/model/enrollment.model';
import { AuthService, EnrollmentStatuses, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { LearningTrailDoneActionType } from './consts';

import { LearningTrailEnrollmentsComponent } from './learning-trail-enrollments.component';
import * as fromActions from './store/learning-trail-enrollments.actions';
import { initialState } from './store/learning-trail-enrollments.reducer';
import * as fromSelectors from './store/learning-trail-enrollments.selectors';
import { EnrollmentFilter } from 'app/shared/components/enrollments-filter';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideRouter } from '@angular/router';
import { EnrollmentsFilterComponent } from 'app/shared/components/enrollments-filter/enrollments-filter.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('LearningTrailEnrollmentsComponent', () => {
  let component: LearningTrailEnrollmentsComponent;
  let dialog: jest.Mocked<MatDialog>;
  let fixture: ComponentFixture<LearningTrailEnrollmentsComponent>;
  let store: MockStore;

  beforeEach(async () => {
    TestBed.overrideComponent(LearningTrailEnrollmentsComponent, {
      remove: { imports: [EnrollmentsFilterComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [LearningTrailEnrollmentsComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            {
              selector: fromSelectors.selectEnrollments,
              value: [{ id: '123' }],
            },
          ],
          initialState,
        }),
        {
          provide: AuthService,
          useValue: { userId: '1235' },
        },
        {
          provide: FormBuilder,
          useValue: new FormBuilder(),
        },
        {
          provide: MatDialog,
          useValue: { open: jest.fn().mockReturnValue({ afterClosed: jest.fn(() => of(1)) }) },
        },
        {
          provide: UserProfileService,
          useValue: { hasRoles: jest.fn() },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;

    fixture = TestBed.createComponent(LearningTrailEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch generate the certificate action', () => {
    jest.spyOn(store, 'dispatch');
    component.filteringAllUsers = true;
    const expectedEnrollmentId = '123';

    component.onGenerateCertificate(expectedEnrollmentId);

    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.generateCertificate({ enrollmentId: expectedEnrollmentId, isMobile: false }),
    );
  });

  it('should open confirmation dialog if there not action', () => {
    const action = LearningTrailDoneActionType.DELETE;

    component.executeAction(action, { id: '123' } as Enrollment);

    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.delete',
    );
  });

  it('should open re enroll dialog', () => {
    const action = LearningTrailDoneActionType.RE_ENROLL;
    const enrollment = {
      id: '123',
      mission: { id: '124' },
      user: { id: '1235' },
    } as Enrollment;
    component.goalDate = new Date();

    component.executeAction(action, enrollment);

    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.reEnroll',
    );
  });

  it('should open approve enrollment dialog', () => {
    const action = LearningTrailDoneActionType.APPROVE_ENROLLMENT;

    component.executeAction(action, { id: '123' } as Enrollment);

    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.approveEnrollment',
    );
  });

  it('should dispatch view activities', () => {
    jest.spyOn(store, 'dispatch');
    const action = LearningTrailDoneActionType.VIEW_ACTIVITIES;
    const enrollment = { id: '123' } as Enrollment;

    component.executeAction(action, enrollment);

    expect(dialog.open).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(fromActions.loadTracking({ enrollment }));
  });

  it('should dispatch filter action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const filter: EnrollmentFilter = { status: ['mock_status'] };

    component.onFilterChange(filter);

    expect(spy).toHaveBeenCalledWith(fromActions.saveFilter({ filter }));
  });

  it('should dispatch search change action', () => {
    const spy = jest.spyOn(store, 'dispatch');

    component.onSearchChange('mock_search');

    expect(spy).toHaveBeenCalledWith(fromActions.searchChange({ search: 'mock_search' }));
  });

  it('should dispatch page change action adding one to pageIndex', () => {
    jest.spyOn(store, 'dispatch');
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 20 };

    component.onChangePage(pageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.paginationChange({
        page: pageEvent.pageIndex + 1,
        per_page: pageEvent.pageSize,
      }),
    );
  });

  it('should dispatch sort change action', () => {
    jest.spyOn(store, 'dispatch');
    const sortChange: Sort = { active: 'mission__name', direction: 'asc' };

    component.handleSort(sortChange);

    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.sortChange({
        field: sortChange.active,
        direction: sortChange.direction,
      }),
    );
  });

  it('should dispatch loadEnrollments when change page', () => {
    jest.spyOn(store, 'dispatch');
    const event = {
      pageIndex: 1,
      pageSize: 10,
    } as PageEvent;

    component.onChangePage(event);

    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.paginationChange({ page: event.pageIndex + 1, per_page: event.pageSize }),
    );
  });

  it('should fetch more items', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.fetchMoreItems();

    expect(spy).toHaveBeenCalledWith(fromActions.fetchMoreItems());
  });

  describe('executeActionMobile', () => {
    it('should execute generateCertificate action for status COMPLETED', () => {
      const spy = jest.spyOn(component, 'onGenerateCertificate');
      const id = '1';
      const item = { id, status: EnrollmentStatuses.COMPLETED };
      const action = 'generateCertificate';

      component.executeActionMobile({ item: item as Enrollment, action });

      expect(spy).toHaveBeenCalledWith(id, true);
    });

    it('should execute viewTrail action for any status', () => {
      const spy = jest.spyOn(component, 'executeAction');
      const item = { id: '1', status: EnrollmentStatuses.ENROLLED };
      const action = 'viewTrail';

      component.executeActionMobile({ item: item as Enrollment, action });

      expect(spy).toHaveBeenCalledWith(action, item);
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
