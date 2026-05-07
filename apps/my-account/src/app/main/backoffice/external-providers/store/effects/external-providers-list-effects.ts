import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ExternalProvidersListService } from '../../service/external-providers-list.service';
import { ExternalProviderListActions } from '../actions';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class ExternalProvidersListEffects {
  constructor(
    private _actions$: Actions,
    private externalProviderListService: ExternalProvidersListService,
    private messageService: KpMessageService,
  ) {}

  loadProviders$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ExternalProviderListActions.loadProviders),
      switchMap(() =>
        this.externalProviderListService.loadProvider().pipe(
          map((providers) => ExternalProviderListActions.loadProvidersSucess({ payload: providers })),
          catchError(() => of(ExternalProviderListActions.loadProvidersFailure())),
        ),
      ),
    );
  });

  OpenDialogDelete$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ExternalProviderListActions.OpenDialogDelete),
      switchMap(({ idProvider }) =>
        this.externalProviderListService.openDialogDelete().pipe(
          filter((value) => value === true),
          map(() => ExternalProviderListActions.deleteProvider({ idProvider })),
        ),
      ),
    );
  });

  deleteProvider$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ExternalProviderListActions.deleteProvider),
      switchMap(({ idProvider }) =>
        this.externalProviderListService.deleteProvider(idProvider).pipe(
          tap(() => this.messageService.success('Operação realizada com sucesso!')),
          switchMap(() => of(ExternalProviderListActions.deleteProviderSucess({ idProvider }))),
          catchError(() => {
            this.messageService.error('Ocorreu um erro durante a operação!');
            return of(ExternalProviderListActions.deleteProviderFailure());
          }),
        ),
      ),
    );
  });

  openDialogEdit = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(ExternalProviderListActions.openDialogEdit),

        map(({ provider }) => this.externalProviderListService.openDialogEdit(provider)),
      );
    },
    { dispatch: false },
  );

  editProvider$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ExternalProviderListActions.editProvider),
      switchMap(({ providerId, formData }) =>
        this.externalProviderListService.updateProvider(providerId, formData).pipe(
          tap(() => this.messageService.success('Operação realizada com sucesso!')),
          map(() => ExternalProviderListActions.loadProviders()),
          catchError(() => {
            this.messageService.error('Ocorreu um erro durante a operação!');
            return of(ExternalProviderListActions.deleteProviderFailure());
          }),
        ),
      ),
    );
  });
}
