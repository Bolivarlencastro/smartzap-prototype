import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TokensConfigService } from '../../services';
import { TokensDialogActions } from '../actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class TokensDialogEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TokensDialogActions.openDialog),
        tap(() => this.tokensConfigService.openTokensConfigDialog()),
      );
    },
    { dispatch: false },
  );

  loadToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TokensDialogActions.openDialog),
      switchMap(() =>
        this.tokensConfigService.loadTokens().pipe(
          map((tokens) => TokensDialogActions.loadTokensSuccess({ tokens })),
          catchError(() => of(TokensDialogActions.loadTokensFailure())),
        ),
      ),
    );
  });

  saveTokens$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TokensDialogActions.saveTokens),
      switchMap(({ tokens }) =>
        this.tokensConfigService.saveTokens(tokens).pipe(
          map(() => TokensDialogActions.saveTokensSuccess()),
          catchError(() => of(TokensDialogActions.saveTokensFailure)),
        ),
      ),
    );
  });

  closeDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TokensDialogActions.loadTokensFailure, TokensDialogActions.saveTokensSuccess),
        tap(() => this.tokensConfigService.closeDialog()),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private tokensConfigService: TokensConfigService,
  ) {}
}
