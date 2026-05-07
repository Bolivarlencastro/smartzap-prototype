import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LedOverviewService } from '../../../services/led-overview.service';
import { LedOverviewActions } from '../actions';
import { tap } from 'rxjs';

@Injectable()
export class LedOverviewEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LedOverviewActions.openDialog),
        tap(() => this.ledOverviewService.openDialog()),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly ledOverviewService: LedOverviewService,
  ) {}
}
