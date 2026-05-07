import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { CourseEnrollmentService } from '../../services/course-enrollment.service';
import { CourseEnrollmentActions, LoginActions } from '../actions';
import { courseEnrollmentFeature, loginFeature } from '../features';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class CourseEnrollmentEffects {
  openDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseEnrollmentActions.openDialog),
        concatLatestFrom(() => this.store.select(loginFeature.selectIsLoggedIn)),
        tap(([_, isLoggedIn]) => this.courseEnrollmentService.openDialog(isLoggedIn)),
      );
    },
    { dispatch: false },
  );

  onUserNotFound$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LoginActions.searchUserForLoginFailure),
        tap(() => this.courseEnrollmentService.closeDialog()),
      );
    },
    { dispatch: false },
  );

  redirectToWhatsApp$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseEnrollmentActions.redirectToWhatsApp),
        tap(() => this.courseEnrollmentService.redirectToWhatsApp()),
      );
    },
    { dispatch: false },
  );

  redirectToSupportWhatsApp$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseEnrollmentActions.redirectToSupportWhatsApp),
        tap(() => this.courseEnrollmentService.redirectToSupportWhatsApp()),
      );
    },
    { dispatch: false },
  );

  enroll$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseEnrollmentActions.enroll),
      concatLatestFrom(() => [
        this.store.select(courseEnrollmentFeature.selectCourseId),
        this.store.select(loginFeature.selectCurrentUser),
      ]),
      switchMap(([{ courseEnrollmentData }, courseId, selectedUser]) =>
        this.courseEnrollmentService.updateUserAndEnroll(courseEnrollmentData, selectedUser, courseId).pipe(
          map(() => CourseEnrollmentActions.openEnrollmentResultDialog({ result: 'enrolled' })),
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 409) {
              return of(
                CourseEnrollmentActions.openEnrollmentResultDialog({
                  result: 'already-enrolled',
                  selectedUser: selectedUser,
                  courseId,
                }),
              );
            }
            return of(CourseEnrollmentActions.enrollFailure({ error }));
          }),
        ),
      ),
    );
  });

  openEnrollmentResultDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseEnrollmentActions.openEnrollmentResultDialog),
      switchMap(({ result, selectedUser, courseId }) =>
        this.courseEnrollmentService.openEnrollmentResultDialog(result).pipe(
          map((result) => {
            if (result === 'go-to-whatsapp') {
              return CourseEnrollmentActions.redirectToWhatsApp();
            }
            return CourseEnrollmentActions.cancelCurrentAndEnrollIntoCourse({ userId: selectedUser?.id, courseId });
          }),
        ),
      ),
    );
  });

  onEnrollSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseEnrollmentActions.openEnrollmentResultDialog),
      filter(({ result }) => result === 'enrolled'),
      map(() => CourseEnrollmentActions.enrollSuccess()),
    );
  });

  cancelCurrentEnrollmentAndEnrollIntoNewCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseEnrollmentActions.cancelCurrentAndEnrollIntoCourse),
      switchMap(({ userId, courseId }) =>
        this.courseEnrollmentService.cancelUserEnrollmentAndEnrollIntoCourse(userId, courseId).pipe(
          map(() => CourseEnrollmentActions.openEnrollmentResultDialog({ result: 'enrolled' })),
          catchError((error) => of(CourseEnrollmentActions.cancelUserEnrollmentFailure({ error }))),
        ),
      ),
    );
  });

  openEnrollmentCancelConfirmationDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseEnrollmentActions.openEnrollmentCancelConfirmationDialog),
      switchMap(() =>
        this.courseEnrollmentService.openEnrollmentCancelConfirmationDialog().pipe(
          filter((result) => result === true),
          concatLatestFrom(() => this.store.select(loginFeature.selectCurrentUser)),
          switchMap(([_, user]) =>
            this.courseEnrollmentService
              .cancelCurrentUserEnrollment(user?.id)
              .pipe(map(() => CourseEnrollmentActions.cancelEnrollmentSuccess())),
          ),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly courseEnrollmentService: CourseEnrollmentService,
  ) {}
}
