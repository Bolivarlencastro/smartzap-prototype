import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { LedListService } from '../../../services/led-list.service';
import { LedEventTabActions } from '../actions';
import { ledEventTabFeature, ledOverviewFeature } from '../features';

@Injectable()
export class LedEventTabEffects {
  fetchEvents$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedEventTabActions.fetchEvents),
      concatLatestFrom(() => [
        this.store.select(ledEventTabFeature.selectLoaded),
        this.store.select(ledOverviewFeature.selectUserId),
      ]),
      filter(([_, isLoaded]) => !isLoaded),
      switchMap(([_, _isLoaded, userId]) =>
        this.ledListService.getLedEvents(userId).pipe(
          map((events) => LedEventTabActions.fetchEventsSuccess({ events })),
          catchError(() => of(LedEventTabActions.fetchEventsFailure())),
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
