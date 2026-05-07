import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { LedListService } from '../../../services/led-list.service';
import { LedOverviewTabActions } from '../actions';
import { ledOverviewFeature, ledOverviewTabFeature } from '../features';

@Injectable()
export class LedOverviewTabEffects {
  fetchData$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedOverviewTabActions.fetchData),
      concatLatestFrom(() => [
        this.store.select(ledOverviewTabFeature.selectLoaded),
        this.store.select(ledOverviewFeature.selectUserId),
      ]),
      filter(([_, isLoaded]) => !isLoaded),
      switchMap(([_, _isLoaded, userId]) =>
        this.ledListService.getLedOverviewData(userId).pipe(
          map((data) => LedOverviewTabActions.fetchDataSuccess({ data })),
          catchError(() => of(LedOverviewTabActions.fetchDataFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly ledListService: LedListService,
    private readonly store: Store,
  ) {}
}
