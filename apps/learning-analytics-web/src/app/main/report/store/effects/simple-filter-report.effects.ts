import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { SimpleFilterReportService } from '../../services';
import { SimpleFilterReportActions } from '../actions';
import { SimpleFilterReportSelectors } from '../selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class SimpleFilterReportEffects {
  loadItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SimpleFilterReportActions.loadFilterItems),
      mergeMap(({ filter }) =>
        this.service.fetchListOptions(filter).pipe(
          map(({ items, loaded, count }) => SimpleFilterReportActions.loadFilterItemsSuccess({ items, loaded, count })),
          catchError((error) => of(SimpleFilterReportActions.loadFilterItemsFailure({ error }))),
        ),
      ),
    );
  });

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SimpleFilterReportActions.searchItems),
      mergeMap(({ filter }) =>
        this.service.fetchListOptions(filter).pipe(
          map(({ items, loaded, count }) => SimpleFilterReportActions.searchItemsSuccess({ items, loaded, count })),
          catchError((error) => of(SimpleFilterReportActions.searchItemsFailure({ error }))),
        ),
      ),
    );
  });

  fetchMoreItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SimpleFilterReportActions.fetchMoreItems),
      concatLatestFrom(() => [
        this.store.select(SimpleFilterReportSelectors.selectFilter),
        this.store.select(SimpleFilterReportSelectors.selectLoaded),
        this.store.select(SimpleFilterReportSelectors.selectIsLoading),
      ]),
      filter(([_, _filter, loaded, isLoading]) => !loaded && !isLoading),
      map(([_, filter]) => {
        const page = filter?.page;
        const updatedFilter = { ...filter, page: page ? page + 1 : 1 };
        return SimpleFilterReportActions.loadFilterItems({ filter: updatedFilter });
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private service: SimpleFilterReportService,
    private store: Store,
  ) {}
}
