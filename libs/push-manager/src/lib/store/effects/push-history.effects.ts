import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { catchError, map, of, switchMap } from 'rxjs';
import { PanelService } from '../../services/panel.service';
import { PushHistoryActions } from '../actions/push-history.actions';
import { pushHistoryFeature } from '../features/push-history.feature';

@Injectable()
export class PushHistoryEffects {
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        PushHistoryActions.load,
        PushHistoryActions.search,
        PushHistoryActions.changePage,
        PushHistoryActions.sort,
      ),
      concatLatestFrom(() => this.store.select(pushHistoryFeature.selectFilters)),
      switchMap(([_, filters]) =>
        this.panelService.fetchPushHistory(filters).pipe(
          map((response) => PushHistoryActions.loadSuccess({ data: response.data, total: response.meta.totalItems })),
          catchError(() => of(PushHistoryActions.loadFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly panelService: PanelService,
  ) {}
}
