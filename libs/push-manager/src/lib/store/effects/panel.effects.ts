import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { PanelService } from '../../services/panel.service';
import { PanelActions } from '../actions';
import { panelFeature } from '../features/panel.feature';

@Injectable()
export class PanelEffects {
  loadSummary$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PanelActions.loadSummary),
      switchMap(() =>
        this.panelService.fetchSummary().pipe(
          map((data) => PanelActions.loadSummarySuccess({ data })),
          catchError(() => of(PanelActions.loadSummaryFailure())),
        ),
      ),
    );
  });

  openAddCreditsDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PanelActions.openAddCreditsDialog),
      concatLatestFrom(() => this.store.select(panelFeature.selectSummary)),
      switchMap(([_, summary]) =>
        this.panelService
          .openAddCreditsDialog(summary.data?.currentBalance ?? '0,00')
          .pipe(map(() => PanelActions.loadSummary())),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly panelService: PanelService,
  ) {}
}
