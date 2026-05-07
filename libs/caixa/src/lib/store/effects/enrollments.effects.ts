import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CourseEnrollmentActions, EnrollmentsActions, LoginActions } from '../actions';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { EnrollmentsService } from '../../services/enrollments.service';
import { loginFeature } from '../features';
import { catchError, filter, map, of, switchMap } from 'rxjs';

@Injectable()
export class EnrollmentsEffects {
  loadEnrollments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        EnrollmentsActions.loadEnrollments,
        LoginActions.setUser,
        CourseEnrollmentActions.enrollSuccess,
        CourseEnrollmentActions.cancelEnrollmentSuccess,
      ),
      concatLatestFrom(() => this.store.select(loginFeature.selectCurrentUser)),
      filter(([, user]) => !!user?.id),
      switchMap(([_, user]) => {
        return this.enrollmentsService.loadUserEnrollments(user?.id).pipe(
          map((enrollments) => EnrollmentsActions.loadEnrollmentsSuccess({ enrollments })),
          catchError((error) => of(EnrollmentsActions.loadEnrollmentsFailure({ error }))),
        );
      }),
    );
  });

  clearEnrollments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.clearCurrentUser),
      map(() => EnrollmentsActions.reset()),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}
}
