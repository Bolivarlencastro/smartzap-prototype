import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TrailDialogService } from '../../../services/trail-dialog.service';
import { TrailDialogActions } from '../actions';
import { trailDialogFeature } from '../features';

@Injectable()
export class TrailDialogEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TrailDialogActions.openDialog),
        tap(() => this.trailDialogService.openDialog()),
      );
    },
    { dispatch: false },
  );

  fetchData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrailDialogActions.fetchData),
      concatLatestFrom(() => this.store.select(trailDialogFeature.selectTrailId)),
      switchMap(([_, trailId]) =>
        this.trailDialogService.fetchData(trailId).pipe(
          map((data) => TrailDialogActions.fetchDataSuccess({ data })),
          catchError(() => of(TrailDialogActions.fetchDataFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly trailDialogService: TrailDialogService,
  ) {}
}
