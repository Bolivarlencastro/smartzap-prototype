import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { LedListService } from '../../../services/led-list.service';
import { LedPulseTabActions } from '../actions';
import { ledOverviewFeature, ledPulseTabFeature } from '../features';

@Injectable()
export class LedPulseTabEffects {
  fetchPulses$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedPulseTabActions.fetchPulses),
      concatLatestFrom(() => [
        this.store.select(ledPulseTabFeature.selectLoaded),
        this.store.select(ledOverviewFeature.selectUserId),
      ]),
      filter(([_, isLoaded]) => !isLoaded),
      switchMap(([_, _isLoaded, userId]) =>
        this.ledListService.getLedPulses(userId).pipe(
          map((pulses) => LedPulseTabActions.fetchPulsesSuccess({ pulses })),
          catchError(() => of(LedPulseTabActions.fetchPulsesFailure())),
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
