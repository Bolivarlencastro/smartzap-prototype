import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { initialState } from '../reducers/enrollments.reducer';
import { CoursesService } from '../../services';
import { EnrollmentsActions } from '../actions';
import { EnrollmentsEffects } from './enrollments.effects';
import { EnrollmentsService } from 'app/shared/services/enrollments.service';
import { EnrollmentsService as CourseEnrollmentsService } from '../../modules/enrollments/services';

import { Page } from 'app/shared/model';
import { takeLast } from 'rxjs/operators';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

class CoursesServiceMock {
  createUserEnrollment(_courseId: string, _data: any): Observable<any> {
    return of({});
  }

  fetchEnrollments(_course_id: string, _pageData: Page, _term: string, _sort: string, _filter?: any): Observable<any> {
    return of({});
  }
}

describe('EnrollmentsEffects', () => {
  let actions$: Observable<Action>;
  let effects: EnrollmentsEffects;
  let courseService: CoursesServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        EnrollmentsEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: CoursesService,
          useClass: CoursesServiceMock,
        },
        {
          provide: KpMessageService,
          useValue: {},
        },
        {
          provide: EnrollmentsService,
          useValue: {},
        },
        {
          provide: CourseEnrollmentsService,
          useValue: {},
        },
      ],
    }).compileComponents();
    effects = TestBed.inject(EnrollmentsEffects);
    courseService = TestBed.inject(CoursesService) as unknown as CoursesServiceMock;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('createEnrollment$', () => {
    it('should fire failure action with mapped message by response status code when could not create enrollment', (done) => {
      const courseId = 'courseId';
      const data = {};
      const createUserEnrollmentError = { status: 409, i18n: 'error' };
      const createUserEnrollmentSpy = jest
        .spyOn(courseService, 'createUserEnrollment')
        .mockReturnValue(throwError(createUserEnrollmentError));
      const expectedErrorMessage = 'API.ERROR.ENROLLMENT_IN_PROGRESS';
      const expectedResponseAction = {
        error: expectedErrorMessage,
        type: EnrollmentsActions.createEnrolmentFailure.type,
      };
      actions$ = of(
        EnrollmentsActions.createEnrolment({
          course_id: courseId,
          data,
        }),
      );

      effects.createEnrollment$.pipe(takeLast(1)).subscribe((response) => {
        expect(createUserEnrollmentSpy).toHaveBeenCalledWith(courseId, data);
        expect(response).toEqual(expectedResponseAction);
        done();
      });
    });

    it('should fire failure action with default message when could not create enrollment', (done) => {
      const courseId = 'courseId';
      const data = {};
      const createUserEnrollmentError = { status: 500, i18n: 'error' };
      const createUserEnrollmentSpy = jest
        .spyOn(courseService, 'createUserEnrollment')
        .mockReturnValue(throwError(createUserEnrollmentError));
      const expectedResponseAction = {
        error: createUserEnrollmentError.i18n,
        type: EnrollmentsActions.createEnrolmentFailure.type,
      };
      actions$ = of(
        EnrollmentsActions.createEnrolment({
          course_id: courseId,
          data,
        }),
      );

      effects.createEnrollment$.pipe(takeLast(1)).subscribe((response) => {
        expect(createUserEnrollmentSpy).toHaveBeenCalledWith(courseId, data);
        expect(response).toEqual(expectedResponseAction);
        done();
      });
    });
  });
});
