import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SimpleFilterReportService } from '../../services';
import { ChannelsFilterListActions } from '../actions';

@Injectable()
export class ChannelsFilterListEffects {
  loadItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelsFilterListActions.loadFilterItems),
      switchMap(({ filter }) =>
        this.service.fetchListOptions(filter).pipe(
          map(({ items, loaded }) => ChannelsFilterListActions.loadFilterItemsSuccess({ items, loaded })),
          catchError((error) => of(ChannelsFilterListActions.loadFilterItemsFailure({ error }))),
        ),
      ),
    );
  });

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelsFilterListActions.searchItems),
      switchMap(({ filter }) =>
        this.service.fetchListOptions(filter).pipe(
          map(({ items, loaded }) => ChannelsFilterListActions.searchItemsSuccess({ items, loaded })),
          catchError((error) => of(ChannelsFilterListActions.searchItemsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: SimpleFilterReportService,
  ) {}
}
