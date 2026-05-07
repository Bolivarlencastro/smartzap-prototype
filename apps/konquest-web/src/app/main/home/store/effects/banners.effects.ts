import { Injectable } from '@angular/core';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { BannersService } from '../../services/banners.service';
import { BannersActions, HomeActions } from '../actions';

@Injectable()
export class BannersEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly bannersService: BannersService,
  ) {}

  loadBanners$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.setActiveFeatures, BannersActions.loadBanners),
      switchMap(() =>
        this.bannersService.loadBanners().pipe(
          map((banners) => BannersActions.loadBannersSuccess({ banners })),
          catchError(() => of(BannersActions.loadBannersFailure())),
        ),
      ),
    );
  });

  dispatchAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannersActions.dispatchAction),
      map(({ data }) => this.bannersService.getAction(data)),
    );
  });

  redirectTo$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BannersActions.redirectTo),
        map(({ data }) => this.bannersService.redirectTo(data)),
      );
    },
    { dispatch: false },
  );

  showDetails$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BannersActions.showDetails),
        map(({ item }) => this.bannersService.showDetails(item)),
      );
    },
    { dispatch: false },
  );

  openExternalContent$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BannersActions.openExternalContent),
        map(({ url }) => KeepsUtils.openUrlInNewTab(url)),
      );
    },
    { dispatch: false },
  );
}
