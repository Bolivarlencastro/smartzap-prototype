import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { IntegrationsService } from '../../services';
import { IntegrationsActions } from '../actions';

@Injectable()
export class IntegrationsEffects {
  constructor(
    private readonly _actions$: Actions,
    private readonly _integrationsService: IntegrationsService,
  ) {}

  loadIntegrations$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(IntegrationsActions.loadIntegrations),
      switchMap(() =>
        this._integrationsService
          .getIntegrations()
          .pipe(map((integrations) => IntegrationsActions.loadIntegrationsSuccess({ integrations }))),
      ),
    );
  });

  toggleIntegration$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(IntegrationsActions.toggleIntegration),
        switchMap(({ integration, enabled }) => this._integrationsService.toggleIntegration(integration, enabled)),
      );
    },
    { dispatch: false },
  );

  openInstructions$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(IntegrationsActions.openInstructions),
        map(({ integration }) => this._integrationsService.openInstructionsDialog(integration)),
      );
    },
    { dispatch: false },
  );
}
