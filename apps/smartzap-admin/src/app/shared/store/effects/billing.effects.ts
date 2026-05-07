import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { BillingService } from '../../services/billing.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BillingActions } from '../actions';

@Injectable()
export class BillingEffects {
  loadBilling$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(BillingActions.loadBilling),
      switchMap((payload) =>
        this._billingService.fetchBilling(payload.workspaceId).pipe(
          map((billing) => BillingActions.loadBillingSuccess({ billing })),
          catchError((error) => of(BillingActions.loadBillingFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private _actions$: Actions,
    private _billingService: BillingService,
  ) {}
}
