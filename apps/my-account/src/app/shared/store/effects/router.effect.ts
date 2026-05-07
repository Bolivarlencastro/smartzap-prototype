import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';

import * as RouterActions from '../actions/router.action';

@Injectable()
export class RouterEffects {
  /**
   * Navigate
   */

  navigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(RouterActions.Go),
        map((action) => action.payload),
        tap(({ path, query: queryParams, extras }) => {
          this.router.navigate(path, { ...queryParams, ...extras });
        }),
      );
    },
    { dispatch: false },
  );

  /**
   * Navigate back
   *
   * @type {Observable<any>}
   */

  navigateBack$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(RouterActions.Back),
        tap(() => this.location.back()),
      );
    },
    { dispatch: false },
  );

  /**
   * Navigate forward
   *
   * @type {Observable<any>}
   */

  navigateForward$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(RouterActions.Forward),
        tap(() => this.location.forward()),
      );
    },
    { dispatch: false },
  );

  /**
   * Constructor
   *
   * @param actions$
   * @param router
   * @param location
   */
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
  ) {}
}
