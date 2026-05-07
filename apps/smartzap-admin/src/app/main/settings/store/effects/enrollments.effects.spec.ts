import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockSelector, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { EnrollmentsService } from 'app/shared/services/enrollments.service';
import { EnrollmentsEffects } from './enrollments.effects';
import { initialState } from '../reducers/enrollments.reducer';
import { EnrollmentsActions } from '../actions';
import { MatDialog } from '@angular/material/dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

class EnrollmentsServiceMock {
  buildSort(_data: any): string {
    return '';
  }

  fetchEnrollments(_data: any): Observable<any> {
    return of({});
  }

  delete(_id: string): Observable<any> {
    return of({});
  }

  create(_data: any): Observable<any> {
    return of({});
  }

  renewContentAccess(_data: any): Observable<any> {
    return of({});
  }

  fetchTracking(_data: any): Observable<any> {
    return of({});
  }

  countEnrollmentsByStatus(): Observable<any> {
    return of({});
  }

  countPendingMessages(): Observable<any> {
    return of({});
  }

  countSentMessages(_params?: any): Observable<any> {
    return of({});
  }

  countTotalUsers(): Observable<any> {
    return of({});
  }

  cancel(_id: string): Observable<any> {
    return of({ status: 'CANCELED', id: 'enrollmentId' });
  }
}

class MatDialogMock {
  open(_component: any): any {
    return {
      afterClosed: () => of(true),
      componentInstance: { confirmTitle: '', confirmMessage: '', renewAccessSelected: of({}), destroyEvent: of({}) },
    };
  }
}

const mockedSelectors: MockSelector[] = [
  { selector: 'selectPagination', value: initialState.page },
  { selector: 'selectSort', value: initialState.sort },
  { selector: 'selectFilter', value: initialState.filter },
];

describe('EnrollmentsEffects', () => {
  let actions$: Observable<Action>;
  let effects: EnrollmentsEffects;
  let enrollmentsService: EnrollmentsService;
  let matDialog: MatDialog;
  let messageService: KpMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        EnrollmentsEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: { settings: { enrollments: initialState } },
          selectors: mockedSelectors,
        }),
        {
          provide: EnrollmentsService,
          useClass: EnrollmentsServiceMock,
        },
        {
          provide: MatDialog,
          useClass: MatDialogMock,
        },
        {
          provide: KpMessageService,
          useValue: { success: jest.fn(), error: jest.fn() },
        },
      ],
    }).compileComponents();
    effects = TestBed.inject(EnrollmentsEffects);
    enrollmentsService = TestBed.inject(EnrollmentsService);
    matDialog = TestBed.inject(MatDialog);
    messageService = TestBed.inject(KpMessageService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('loadEnrollments$', () => {
    it('should fire action when load enrollments succeeds', (done) => {
      const pagination = { page: initialState.page.page, per_page: initialState.page.per_page };
      const sort = '-created';
      const responseMock = {} as any;
      actions$ = of(EnrollmentsActions.loadEnrollments());
      const expectedAction = { type: EnrollmentsActions.loadEnrollmentsSuccess.type, payload: responseMock };
      jest.spyOn(enrollmentsService, 'fetchEnrollments').mockReturnValue(of(responseMock));
      jest.spyOn(enrollmentsService, 'buildSort').mockReturnValue(sort);

      effects.loadEnrollments$.subscribe((response) => {
        expect(enrollmentsService.fetchEnrollments).toHaveBeenCalledWith({
          pagination,
          sort,
          filter: initialState.filter,
        });
        expect(enrollmentsService.buildSort).toHaveBeenCalledWith(initialState.sort);
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire error action when load enrollments fails', (done) => {
      const pagination = { page: initialState.page.page, per_page: initialState.page.per_page };
      const sort = '-created';
      actions$ = of(EnrollmentsActions.loadEnrollments());
      const errorMock = 'ERROR';
      const expectedAction = { type: EnrollmentsActions.loadEnrollmentsFailure.type, error: errorMock };
      jest.spyOn(enrollmentsService, 'fetchEnrollments').mockReturnValue(throwError(errorMock));
      jest.spyOn(enrollmentsService, 'buildSort').mockReturnValue(sort);

      effects.loadEnrollments$.subscribe((response) => {
        expect(enrollmentsService.fetchEnrollments).toHaveBeenCalledWith({
          pagination,
          sort,
          filter: initialState.filter,
        });
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('setPagination$', () => {
    it('should return load enrollments action when setting pagination', (done) => {
      const payload = { page: initialState.page.page, perPage: initialState.page.per_page };
      const expectedAction = { type: EnrollmentsActions.loadEnrollments.type };
      actions$ = of(EnrollmentsActions.setPagination({ payload }));

      effects.setPagination$.subscribe((response) => {
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('setSort$', () => {
    it('should return load enrollments action when setting sort', (done) => {
      const payload = { field: 'created', direction: 'asc' } as any;
      const expectedAction = { type: EnrollmentsActions.loadEnrollments.type };
      actions$ = of(EnrollmentsActions.setSort({ payload }));

      effects.setSort$.subscribe((response) => {
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('loadStatistics$', () => {
    it('should fire action when load statistics succeeds', (done) => {
      const responseMock = {
        startedEnrollments: 10,
        totalPendingMessages: 0,
        totalSentMessages: 5,
        totalSentMessagesPeriod: 5,
        totalUsers: 100,
        waitingEnrollments: 15,
      } as any;
      actions$ = of(EnrollmentsActions.loadStatistics());
      const expectedAction = { type: EnrollmentsActions.loadStatisticsSuccess.type, payload: responseMock };
      jest
        .spyOn(enrollmentsService, 'countEnrollmentsByStatus')
        .mockReturnValue(of({ started: responseMock.startedEnrollments, waiting: responseMock.waitingEnrollments }));
      jest.spyOn(enrollmentsService, 'countPendingMessages').mockReturnValue(of(responseMock.totalPendingMessages));
      jest.spyOn(enrollmentsService, 'countSentMessages').mockReturnValue(of(responseMock.totalSentMessages));
      jest.spyOn(enrollmentsService, 'countTotalUsers').mockReturnValue(of(responseMock.totalUsers));

      effects.loadStatistics$.subscribe((response) => {
        expect(enrollmentsService.countEnrollmentsByStatus).toHaveBeenCalled();
        expect(enrollmentsService.countPendingMessages).toHaveBeenCalled();
        expect(enrollmentsService.countSentMessages).toHaveBeenCalled();
        expect(enrollmentsService.countTotalUsers).toHaveBeenCalled();
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire error action when load statistics fails', (done) => {
      const error = 'ERROR';
      actions$ = of(EnrollmentsActions.loadStatistics());
      const expectedAction = { type: EnrollmentsActions.loadStatisticsFailure.type, error };
      jest.spyOn(enrollmentsService, 'countEnrollmentsByStatus').mockReturnValue(throwError(error));

      effects.loadStatistics$.subscribe((response) => {
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('deleteEnrollment$', () => {
    it('should fire action when delete enrollment succeeds', (done) => {
      const id = 'enrollmentId';
      actions$ = of(EnrollmentsActions.deleteEnrollment({ payload: { id } }));
      const expectedAction = { type: EnrollmentsActions.deleteEnrollmentSuccess.type, payload: id };
      jest.spyOn(enrollmentsService, 'delete');

      effects.deleteEnrollment$.subscribe((response) => {
        expect(enrollmentsService.delete).toHaveBeenCalledWith(id);
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire error action when delete enrollment fails', (done) => {
      const id = 'enrollmentId';
      const errorMock = 'ERROR';
      actions$ = of(EnrollmentsActions.deleteEnrollment({ payload: { id } }));
      const expectedAction = { type: EnrollmentsActions.deleteEnrollmentFailure.type, error: errorMock };
      jest.spyOn(enrollmentsService, 'delete').mockReturnValue(throwError(errorMock));

      effects.deleteEnrollment$.subscribe((response) => {
        expect(enrollmentsService.delete).toHaveBeenCalledWith(id);
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('cancelEnrollment$', () => {
    it('should fire action when cancel enrollment succeeds', (done) => {
      const enrollment = { status: 'CANCELED', id: 'enrollmentId' } as any;
      actions$ = of(EnrollmentsActions.cancelEnrollment({ payload: { id: enrollment.id } }));
      const expectedAction = {
        type: EnrollmentsActions.cancelEnrollmentSuccess.type,
        payload: { id: enrollment.id, changes: enrollment },
      };
      jest.spyOn(enrollmentsService, 'cancel');

      effects.cancelEnrollment$.subscribe((response) => {
        expect(enrollmentsService.cancel).toHaveBeenCalledWith(enrollment.id);
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire error action when cancel enrollment fails', (done) => {
      const id = 'enrollmentId';
      const errorMock = 'ERROR';
      actions$ = of(EnrollmentsActions.cancelEnrollment({ payload: { id } }));
      const expectedAction = { type: EnrollmentsActions.cancelEnrollmentFailure.type, error: errorMock };
      jest.spyOn(enrollmentsService, 'cancel').mockReturnValue(throwError(errorMock));

      effects.cancelEnrollment$.subscribe((response) => {
        expect(enrollmentsService.cancel).toHaveBeenCalledWith(id);
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('reenroll$', () => {
    it('should fire action when reenroll succeeds', (done) => {
      const userId = 'userId';
      const courseId = 'courseId';
      const enrollment = {} as any;
      actions$ = of(EnrollmentsActions.reenroll({ payload: { userId, courseId } }));
      const expectedAction = { type: EnrollmentsActions.reenrollSuccess.type, payload: enrollment };
      jest.spyOn(enrollmentsService, 'create');

      effects.reenroll$.subscribe((response) => {
        expect(enrollmentsService.create).toHaveBeenCalledWith({ userId, courseId });
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire error action when reenroll fails', (done) => {
      const userId = 'userId';
      const courseId = 'courseId';
      const errorMock = 'ERROR';
      actions$ = of(EnrollmentsActions.reenroll({ payload: { userId, courseId } }));
      const expectedAction = { type: EnrollmentsActions.reenrollFailure.type, error: errorMock };
      jest.spyOn(enrollmentsService, 'create').mockReturnValue(throwError(errorMock));

      effects.reenroll$.subscribe((response) => {
        expect(enrollmentsService.create).toHaveBeenCalledWith({ userId, courseId });
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('reenrollFailure$', () => {
    it('should open dialog when reenroll fails due conflict', (done) => {
      const error = { status: 409 };
      actions$ = of(EnrollmentsActions.reenrollFailure({ error }));
      jest.spyOn(matDialog, 'open');

      effects.reenrollFailure$.subscribe(() => {
        expect(matDialog.open).toHaveBeenCalled();
        done();
      });
    });

    it('should ignore dialog when reenroll fails with other reason', (done) => {
      const error = { status: 500 };
      actions$ = of(EnrollmentsActions.reenrollFailure({ error }));
      jest.spyOn(matDialog, 'open');

      effects.reenrollFailure$.subscribe({
        complete: () => {
          expect(matDialog.open).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('openEnrollmentActivities$', () => {
    it('should open enrollment activities dialog', (done) => {
      const enrollment = { status: 'WAITING', id: 'enrollmentId' } as any;
      actions$ = of(EnrollmentsActions.openEnrollmentActivities({ payload: enrollment }));
      jest.spyOn(matDialog, 'open');

      effects.openEnrollmentActivities$.subscribe(() => {
        expect(matDialog.open).toHaveBeenCalled();
        done();
      });
    });

    it('should fetch enrollment tracking', (done) => {
      const enrollment = { status: 'WAITING', id: 'enrollmentId' } as any;
      const expectedAction = { type: EnrollmentsActions.loadEnrollmentTracking.type, payload: enrollment.id };
      actions$ = of(EnrollmentsActions.openEnrollmentActivities({ payload: enrollment }));

      effects.loadEnrollmentActivities$.subscribe((response) => {
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('enrollmentRenewContentAccess$', () => {
    it('should fire action when renew content access succeeds', (done) => {
      const renewAccess = { content_id: 'contentId', enrollment_id: 'enrollmentId' } as any;
      const expectedAction = { type: EnrollmentsActions.enrollmentRenewContentAccessSuccess.type };
      actions$ = of(EnrollmentsActions.enrollmentRenewContentAccess({ payload: renewAccess }));
      jest.spyOn(enrollmentsService, 'renewContentAccess');

      effects.enrollmentRenewContentAccess$.subscribe((response) => {
        expect(enrollmentsService.renewContentAccess).toHaveBeenCalledWith({
          contentId: renewAccess.content_id,
          enrollmentId: renewAccess.enrollment_id,
        });
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire error action when renew content access fails', (done) => {
      const renewAccess = { content_id: 'contentId', enrollment_id: 'enrollmentId' } as any;
      const error = 'ERROR';
      const expectedAction = { type: EnrollmentsActions.enrollmentRenewContentAccessFailure.type, error };
      actions$ = of(EnrollmentsActions.enrollmentRenewContentAccess({ payload: renewAccess }));
      jest.spyOn(enrollmentsService, 'renewContentAccess').mockReturnValue(throwError(error));

      effects.enrollmentRenewContentAccess$.subscribe((response) => {
        expect(enrollmentsService.renewContentAccess).toHaveBeenCalledWith({
          contentId: renewAccess.content_id,
          enrollmentId: renewAccess.enrollment_id,
        });
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('enrollmentRenewContentAccessSuccess$', () => {
    it('should show success message when enrollmentRenewContentAccessSuccess action is fired', (done) => {
      actions$ = of(EnrollmentsActions.enrollmentRenewContentAccessSuccess());
      jest.spyOn(messageService, 'success');

      effects.enrollmentRenewContentAccessSuccess$.subscribe(() => {
        expect(messageService.success).toHaveBeenCalledWith('TRACKING.LINK_SEND_SUCCESS');
        done();
      });
    });
  });

  describe('enrollmentRenewContentAccessFailure$', () => {
    it('should show error message when enrollmentRenewContentAccessFailure action is fired', (done) => {
      actions$ = of(EnrollmentsActions.enrollmentRenewContentAccessFailure({ error: {} }));
      jest.spyOn(messageService, 'error');

      effects.enrollmentRenewContentAccessFailure$.subscribe(() => {
        expect(messageService.error).toHaveBeenCalledWith('TRACKING.LINK_SEND_ERROR');
        done();
      });
    });
  });

  describe('loadEnrollmentTracking$', () => {
    it('should fire action when load enrollment tracking succeeds', (done) => {
      const enrollmentId = 'enrollmentId';
      const responseMock = {} as any;
      actions$ = of(EnrollmentsActions.loadEnrollmentTracking({ payload: enrollmentId }));
      const expectedAction = { type: EnrollmentsActions.loadEnrollmentTrackingSuccess.type, payload: responseMock };
      jest.spyOn(enrollmentsService, 'fetchTracking').mockReturnValue(of(responseMock));

      effects.loadEnrollmentTracking$.subscribe((response) => {
        expect(enrollmentsService.fetchTracking).toHaveBeenCalledWith(enrollmentId);
        expect(response).toEqual(expectedAction);
        done();
      });
    });

    it('should fire error action when load enrollment tracking fails', (done) => {
      const enrollmentId = 'enrollmentId';
      actions$ = of(EnrollmentsActions.loadEnrollmentTracking({ payload: enrollmentId }));
      const errorMock = 'ERROR';
      const expectedAction = { type: EnrollmentsActions.loadEnrollmentTrackingFailure.type, error: errorMock };
      jest.spyOn(enrollmentsService, 'fetchTracking').mockReturnValue(throwError(errorMock));

      effects.loadEnrollmentTracking$.subscribe((response) => {
        expect(enrollmentsService.fetchTracking).toHaveBeenCalledWith(enrollmentId);
        expect(response).toEqual(expectedAction);
        done();
      });
    });
  });
});
