import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { ListService } from '../../services/list.service';
import { LedListActions } from './led-list.actions';
import { ledListFeature } from './led-list.feature';

@Injectable()
export class LedListEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedListActions.init),
      concatLatestFrom(() => this.store.select(ledListFeature.selectLoaded)),
      filter(([_, loaded]) => !loaded),
      map(() => LedListActions.fetchLed()),
    );
  });

  fetchLed$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedListActions.fetchLed),
      concatLatestFrom(() => this.store.select(ledListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.listService.getLed(filter).pipe(
          map((response) => LedListActions.fetchLedSuccess({ response })),
          catchError(() => of(LedListActions.fetchLedFailure())),
        ),
      ),
    );
  });

  reloadLed$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedListActions.search, LedListActions.sort, LedListActions.setPagination),
      map(() => LedListActions.fetchLed()),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly listService: ListService,
    private readonly store: Store,
  ) {}
}
