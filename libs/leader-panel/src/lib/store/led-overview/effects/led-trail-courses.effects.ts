import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { LedEnrollmentsService } from '../../../services/led-enrollments.service';
import { LedTrailCoursesActions } from '../actions';
import { ledTrailCoursesFeature } from '../features';

@Injectable()
export class LedTrailCoursesEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedTrailCoursesActions.init),
      concatLatestFrom(() => this.store.select(ledTrailCoursesFeature.selectId)),
      filter(([{ trailEnrollment }, lastId]) => trailEnrollment.id !== lastId),
      map(([{ trailEnrollment }, _]) => LedTrailCoursesActions.fetchEnrollments({ trailEnrollment })),
    );
  });

  fetchEnrollments$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedTrailCoursesActions.fetchEnrollments),
      concatLatestFrom(() => this.store.select(ledTrailCoursesFeature.selectId)),
      switchMap(([_, id]) =>
        this.ledEnrollmentService.getCoursesEnrollmentsByTrailId(id).pipe(
          map((enrollments) => LedTrailCoursesActions.fetchEnrollmentsSuccess({ enrollments })),
          catchError(() => of(LedTrailCoursesActions.fetchEnrollmentsFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly ledEnrollmentService: LedEnrollmentsService,
    private readonly store: Store,
  ) {}
}
