import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ExternalProvidersHeaderService } from '../../service/external-providers-header.service';
import { Store } from '@ngrx/store';
import { ExternalProviderHeaderActions, ExternalProviderListActions } from '../actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class ExportProvidersHeadersEffects {
  constructor(
    private _actions$: Actions,
    private externalProviderHeardService: ExternalProvidersHeaderService,
    private store: Store,
    private messageService: KpMessageService,
  ) {}
  newProvider$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ExternalProviderHeaderActions.newProvider),
      switchMap(({ newProvider }) =>
        this.externalProviderHeardService.newProviderApi(newProvider).pipe(
          tap(() => this.messageService.success('Operação realizada com sucesso!')),
          map(() => ExternalProviderHeaderActions.newProviderSucess({ newProvider })),
          catchError(() => {
            this.messageService.error('Ocorreu um erro durante a operação!');
            return of(ExternalProviderHeaderActions.newProviderFailure());
          }),
        ),
      ),
    );
  });

  loadProvidersAfterNewProviderSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ExternalProviderHeaderActions.newProviderSucess),
      map(() => ExternalProviderListActions.loadProviders()),
    );
  });
}
