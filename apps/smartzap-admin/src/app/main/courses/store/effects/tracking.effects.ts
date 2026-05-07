import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { EnrollmentsService } from '../../modules/enrollments/services';
import { TrackingActions } from '../actions';

@Injectable()
export class TrackingEffects {
  loadTrackingEnrolment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrackingActions.loadTrackingEnrolment),
      concatMap(({ id }) =>
        this._enrollmentsService.loadTracking(id).pipe(
          map((trackings) => TrackingActions.loadTrackingEnrolmentSuccess({ trackings })),
          catchError((error) => of(TrackingActions.loadTrackingEnrolmentFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private store: Store,
    private _actions$: Actions,
    private _enrollmentsService: EnrollmentsService,
  ) {}
}
