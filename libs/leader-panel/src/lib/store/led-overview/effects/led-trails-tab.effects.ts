import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { LedEnrollmentsService } from '../../../services/led-enrollments.service';
import { LedEnrollmentActivityActions, LedTrailCoursesActions, LedTrailsTabActions } from '../actions';
import { ledOverviewFeature, ledTrailsTabFeature } from '../features';

@Injectable()
export class LedTrailsTabEffects {
  loadEnrollments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LedTrailsTabActions.fetchTrailEnrollments),
      concatLatestFrom(() => [
        this.store.select(ledTrailsTabFeature.selectIsLoaded),
        this.store.select(ledOverviewFeature.selectSelectedUser),
      ]),
      filter(([_, isLoaded]) => !isLoaded),
      switchMap(([_, _isLoaded, selectedUser]) =>
        this.ledEnrollmentsService.getTrailsEnrollments(selectedUser.id).pipe(
          map((enrollments) => LedTrailsTabActions.fetchTrailEnrollmentsSuccess({ enrollments })),
          catchError((error) => of(LedTrailsTabActions.fetchTrailEnrollmentsFailure({ error }))),
        ),
      ),
    );
  });

  initTrailCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LedTrailsTabActions.goToCourses),
      map(({ trailEnrollment }) => LedTrailCoursesActions.init({ trailEnrollment })),
    );
  });

  goToCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LedTrailsTabActions.goToCourses),
      map(() => LedTrailsTabActions.setViewMode({ viewMode: 'details' })),
    );
  });

  initCourseDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LedTrailsTabActions.goToCourseDetails),
      map(({ courseId }) => LedEnrollmentActivityActions.init({ courseId })),
    );
  });

  goToCourseDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LedTrailsTabActions.goToCourseDetails),
      map(() => LedTrailsTabActions.setViewMode({ viewMode: 'item-details' })),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly ledEnrollmentsService: LedEnrollmentsService,
    private readonly store: Store,
  ) {}
}
