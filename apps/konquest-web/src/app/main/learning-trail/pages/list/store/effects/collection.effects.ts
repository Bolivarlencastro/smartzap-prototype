import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { LearningTrailListService } from 'app/main/learning-trail/services/learning-trail-list.service';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import * as fromDetailDialogActions from '../../../detail/store/learning-trail-detail.actions';
import { CollectionActions, RecommendationsActions } from '../actions';
import { CollectionSelectors } from '../selectors';

@Injectable()
export class CollectionEffects {
  constructor(
    private _learningTrailListService: LearningTrailListService,
    private _actions$: Actions,
    private store: Store,
  ) {}

  loadRecommendations$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CollectionActions.loadInitialData),
      map(() => RecommendationsActions.loadRecommendations()),
    );
  });

  restoreFilterCache$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CollectionActions.loadInitialData),
      map(() => {
        const language = this._learningTrailListService.getFilterLanguages();
        return CollectionActions.filterLearningTrails({ filter: { language } });
      }),
    );
  });

  filterLearningTrails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CollectionActions.filterLearningTrails),
      map(() => CollectionActions.loadLearningTrails()),
    );
  });

  loadLearningTrails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CollectionActions.loadLearningTrails),
      concatLatestFrom(() => [
        this.store.select(CollectionSelectors.selectCurrentFilter),
        this.store.select(CollectionSelectors.selectCurrentQuickFilterType),
      ]),
      switchMap(([_, currentFilter, quickFilterType]) => {
        return this._learningTrailListService.loadLearningTrails(quickFilterType, currentFilter).pipe(
          map((payload) => CollectionActions.loadLearningTrailsSuccess({ payload })),
          catchError((error) => of(CollectionActions.loadLearningTrailsFailure({ error }))),
        );
      }),
    );
  });

  fetchMoreLearningTrails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CollectionActions.fetchMoreLearningTrails),
      concatLatestFrom(() => [
        this.store.select(CollectionSelectors.selectCurrentFilter),
        this.store.select(CollectionSelectors.selectCurrentQuickFilterType),
        this.store.select(CollectionSelectors.selectIsFinished),
      ]),
      filter(([_action, _currentFilter, _quickFilterType, isFinished]) => !isFinished),
      switchMap(([_, currentFilter, quickFilterType]) => {
        const updatedFilter = currentFilter.page ? { ...currentFilter, page: currentFilter.page + 1 } : currentFilter;
        return this._learningTrailListService.loadLearningTrails(quickFilterType, updatedFilter).pipe(
          map((payload) => CollectionActions.fetchMoreLearningTrailsSuccess({ payload })),
          catchError((error) => of(CollectionActions.fetchMoreLearningTrailsFailure({ error }))),
        );
      }),
    );
  });

  openDetailDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CollectionActions.openDetailDialog),
      map(({ trailId }) => fromDetailDialogActions.loadLearningTrail({ trailId })),
    );
  });
}
