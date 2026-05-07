import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProvidersService } from '../../services';
import { ProvidersActions } from 'app/shared/store';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/operators';
import { providersFeature } from 'app/shared/store/features/providers.feature';
import { of } from 'rxjs';

@Injectable()
export class ProvidersEffects {
  loadProviders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProvidersActions.loadProviders),
      concatLatestFrom(() => this.store.select(providersFeature.selectProviders)),
      filter(([_, providers]) => !providers?.length),
      switchMap(() =>
        this.providersService.getProviders().pipe(
          map(({ results }) => ProvidersActions.loadProvidersSuccess({ providers: results })),
          catchError((error) => of(ProvidersActions.loadProvidersFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private providersService: ProvidersService,
    private store: Store,
  ) {}
}
