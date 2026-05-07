import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { PulseDialogService } from '../../../services/pulse-dialog.service';
import { PulseDialogActions } from '../actions';
import { pulseDialogFeature } from '../features';

@Injectable()
export class PulseDialogEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PulseDialogActions.openDialog),
        tap(() => this.pulseDialogService.openDialog()),
      );
    },
    { dispatch: false },
  );

  fetchData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDialogActions.fetchData),
      concatLatestFrom(() => this.store.select(pulseDialogFeature.selectPulseId)),
      switchMap(([_, pulseId]) =>
        this.pulseDialogService.fetchData(pulseId).pipe(
          map((data) => PulseDialogActions.fetchDataSuccess({ data })),
          catchError(() => of(PulseDialogActions.fetchDataFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly pulseDialogService: PulseDialogService,
  ) {}
}
