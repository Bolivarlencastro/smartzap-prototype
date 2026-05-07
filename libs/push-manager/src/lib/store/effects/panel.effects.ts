import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PanelService } from '../../services/panel.service';
import { PanelActions } from '../actions';

@Injectable()
export class PanelEffects {
  loadPanelData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PanelActions.loadPanelData),
      switchMap(() =>
        this.panelService.fetchPanelData().pipe(
          map((data) => PanelActions.loadPanelDataSuccess({ data })),
          catchError(() => of(PanelActions.loadPanelDataFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly panelService: PanelService,
  ) {}
}
