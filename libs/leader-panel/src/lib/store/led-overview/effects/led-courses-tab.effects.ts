import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LedEnrollmentsService } from '../../../services/led-enrollments.service';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { LedCoursesTabActions, LedEnrollmentActivityActions } from '../actions';
import { ledCoursesTabFeature, ledOverviewFeature } from '../features';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class LedCoursesTabEffects {
  loadEnrollments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LedCoursesTabActions.fetchCourseEnrollments),
      concatLatestFrom(() => [
        this.store.select(ledCoursesTabFeature.selectLoaded),
        this.store.select(ledOverviewFeature.selectUserId),
      ]),
      filter(([_, isLoaded]) => !isLoaded),
      switchMap(([_, _isLoaded, userId]) =>
        this.ledEnrollmentsService.getCoursesEnrollments(userId).pipe(
          map((enrollments) => LedCoursesTabActions.fetchEnrollmentsSuccess({ enrollments })),
          catchError((error) => of(LedCoursesTabActions.fetchEnrollmentsFailure({ error }))),
        ),
      ),
    );
  });

  initCourseDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LedCoursesTabActions.goToCourseDetails),
      map(({ courseId }) => LedEnrollmentActivityActions.init({ courseId })),
    );
  });

  goToCourseDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LedCoursesTabActions.goToCourseDetails),
      map(() => LedCoursesTabActions.setViewMode({ viewMode: 'details' })),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly ledEnrollmentsService: LedEnrollmentsService,
    private readonly store: Store,
  ) {}
}
