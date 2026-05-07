import { Injectable } from '@angular/core';
import { LearningTrailListService } from 'app/main/learning-trail/services/learning-trail-list.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RecommendationsActions } from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class RecommendationsEffects {
  constructor(
    private _learningTrailListService: LearningTrailListService,
    private _actions$: Actions,
  ) {}

  loadRecommendations$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(RecommendationsActions.loadRecommendations),
      switchMap(() =>
        this._learningTrailListService.loadLearningTrailRecommendations().pipe(
          map((results) =>
            RecommendationsActions.loadRecommendationsSuccess({
              recommendations: results || [],
            }),
          ),
          catchError((error) => of(RecommendationsActions.loadRecommendationsFailure({ error }))),
        ),
      ),
    );
  });
}
