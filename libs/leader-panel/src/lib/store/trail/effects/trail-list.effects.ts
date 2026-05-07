import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { TrailsLeaderApi } from '../../../services/trails-leader.api';
import { TrailListActions } from '../actions';
import { trailListFeature } from '../features';

@Injectable()
export class TrailListEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(TrailListActions.init),
      concatLatestFrom(() => this.store.select(trailListFeature.selectLoaded)),
      filter(([_, loaded]) => !loaded),
      map(() => TrailListActions.fetchTrails()),
    );
  });

  fetchTrails$ = createEffect(() => {
    return this.actions.pipe(
      ofType(TrailListActions.fetchTrails),
      concatLatestFrom(() => this.store.select(trailListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.trailsApi.getTrails(filter).pipe(
          map((response) => TrailListActions.fetchTrailsSuccess({ response })),
          catchError(() => of(TrailListActions.fetchTrailsFailure())),
        ),
      ),
    );
  });

  reloadTrails$ = createEffect(() => {
    return this.actions.pipe(
      ofType(TrailListActions.search, TrailListActions.sort, TrailListActions.setPagination),
      map(() => TrailListActions.fetchTrails()),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly trailsApi: TrailsLeaderApi,
    private readonly store: Store,
  ) {}
}
