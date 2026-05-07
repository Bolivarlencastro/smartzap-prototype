import { Injectable } from '@angular/core';
import { LearningTrailType } from '@app/main/learning-trail/model/learning-trail';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { LearningTrailInfoActions } from '../actions';

@Injectable()
export class LearningTrailCreateInfoEffects {
  constructor(
    private _learningTrailAPI: LearningTrailAPI,
    private actions: Actions,
  ) {}

  loadTypes$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailInfoActions.init),
      switchMap(() => {
        return this._learningTrailAPI.getLearningTrailTypes().pipe(
          map((response: { results: LearningTrailType[] }) =>
            LearningTrailInfoActions.loadTypesSuccess({ types: response.results }),
          ),
          catchError(() => of(LearningTrailInfoActions.loadTypesFailure())),
        );
      }),
    );
  });
}
