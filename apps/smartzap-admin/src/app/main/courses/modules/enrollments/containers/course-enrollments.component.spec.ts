import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { defaultConfig, FuseConfigService } from '@keeps-platform-frontend-workspace/layout';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Enrollment } from 'app/main/courses/model';
import { EnrollmentsActions, TrackingActions } from 'app/main/courses/store/actions';
import { of } from 'rxjs';

import { CourseEnrollmentsComponent } from '.';
import { coursesFeatureKey } from '../../../store/reducers';
import * as fromCourse from '../../../store/reducers/course.reducer';
import * as fromCourses from '../../../store/reducers/courses.reducer';
import * as fromEnrollments from '../../../store/reducers/enrollments.reducer';
import { EnrollmentsService } from '../services';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { ptBR } from 'date-fns/locale';
import { MAT_DATE_LOCALE } from '@angular/material/core';

const course_id = 'course-id';

describe('CourseEnrollmentsComponent', () => {
  let component: CourseEnrollmentsComponent;
  let fixture: ComponentFixture<CourseEnrollmentsComponent>;
  let messageService: KpMessageService;
  let store: Store;
  let dialogMock: jest.Mocked<MatDialog>;
  const afterClosedMock = jest.fn().mockReturnValue(of({ data: 'foo' }));

  beforeEach(async () => {
    dialogMock = {
      open: jest.fn().mockReturnValue({
        componentInstance: {
          confirmMessage: '',
          destroyEvent: of({}),
          renewAccessSelected: of({}),
        },
        afterClosed: afterClosedMock,
      }),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [CourseEnrollmentsComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            [coursesFeatureKey]: {
              [fromCourse.featureKey]: fromCourse.initialState,
              [fromCourses.featureKey]: fromCourses.initialState,
              [fromEnrollments.featureKey]: fromEnrollments.initialState,
            },
          },
        }),
        FuseConfigService,
        { provide: defaultConfig, useValue: {} },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: { openFromComponent: jest.fn(), dismiss: jest.fn() } },
        { provide: EnrollmentsService, useValue: { sendRenewAccess: jest.fn().mockReturnValue(of({})) } },
        { provide: KpMessageService, useValue: { success: jest.fn() } },
        provideRouter([]),
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: ptBR },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    messageService = TestBed.inject(KpMessageService);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch sortEnrollments', () => {
    const sort: Sort = { direction: 'asc', active: 'user__name' };

    component.onSortEnrollments(sort);

    expect(store.dispatch).toHaveBeenCalledWith(
      EnrollmentsActions.sortEnrollments({
        direction: sort.direction,
        field: sort.active,
      }),
    );
  });

  it('should dispatch loadTrackingEnrolment', () => {
    const id = 'enrollment-id';
    component.onGetDetailUser({ id } as any);

    expect(store.dispatch).toHaveBeenCalledWith(
      TrackingActions.loadTrackingEnrolment({
        id,
      }),
    );
  });

  it('should dispatch importEnrolments', () => {
    component.onImportEnrollments(course_id);

    expect(store.dispatch).toHaveBeenCalledWith(
      EnrollmentsActions.importEnrolments({
        course_id,
        data: 'foo',
      }),
    );
  });

  it('should dispatch createEnrolment', () => {
    component.createEnrollment(course_id);

    expect(store.dispatch).toHaveBeenCalledWith(
      EnrollmentsActions.createEnrolment({
        course_id,
        data: 'foo',
      }),
    );
  });

  it('should dispatch removeEnrollment', () => {
    afterClosedMock.mockReturnValueOnce(of(true));
    component.onRemove(course_id);

    expect(store.dispatch).toHaveBeenCalledWith(
      EnrollmentsActions.removeEnrollment({
        id: course_id,
      }),
    );
  });

  it('should dispatch clear', () => {
    component.onClearDialogTracking();

    expect(store.dispatch).toHaveBeenCalledWith(TrackingActions.clear());
  });

  it('should open detail user', () => {
    const sendRenewAccess = jest.spyOn(component, 'sendRenewAccess');
    const onClearDialogTracking = jest.spyOn(component, 'onClearDialogTracking');

    const id = 'enrollment-id';
    component.onOpenDetailUser({ id } as Enrollment);

    expect(store.dispatch).toHaveBeenCalledWith(
      TrackingActions.loadTrackingEnrolment({
        id,
      }),
    );
    expect(sendRenewAccess).toHaveBeenCalled();
    expect(onClearDialogTracking).toHaveBeenCalled();
  });

  it('should send renew access', () => {
    component.sendRenewAccess({} as any);
    expect(messageService.success).toHaveBeenCalled();
  });

  describe('onReenroll', () => {
    it('should open dialog', () => {
      const enrollment = {} as Enrollment;

      component.onReenroll(enrollment);

      expect(dialogMock.open).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should dispatch cancelEnrollment', () => {
      const enrollment = { id: 'enrollmentId' } as Enrollment;

      component.onCancel(enrollment);

      expect(store.dispatch).toHaveBeenCalledWith(EnrollmentsActions.cancelEnrollment({ enrollmentId: enrollment.id }));
    });
  });

  it('should dispatch setFilter action', () => {
    const mockFilter: EnrollmentFilter = { search: 'mock_search' };
    component.onFilter(mockFilter);

    expect(store.dispatch).toHaveBeenCalledWith(
      EnrollmentsActions.setFilter({
        filter: mockFilter,
      }),
    );
  });

  it('should dispatch fetchMoreEnrollments action on scroll', () => {
    component.onScroll();

    expect(store.dispatch).toHaveBeenCalledWith(EnrollmentsActions.fetchMoreEnrollments());
  });
});
