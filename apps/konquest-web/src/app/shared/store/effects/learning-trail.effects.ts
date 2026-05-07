import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LearningTrailActions } from '../actions';

@Injectable()
export class LearningTrailEffects {
  loadLearningTrails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LearningTrailActions.loadLearningTrails, LearningTrailActions.filterLearningTrails),
      mergeMap(({ queryParams }) =>
        this.service.getLearningTrails(queryParams).pipe(
          map((data) => LearningTrailActions.loadLearningTrailsSuccess({ data })),
          catchError((error) => of(LearningTrailActions.loadLearningTrailsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: LearningTrailAPI,
  ) {}
}
