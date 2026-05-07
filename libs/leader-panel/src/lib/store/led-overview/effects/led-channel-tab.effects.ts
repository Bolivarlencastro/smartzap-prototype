import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { LedListService } from '../../../services/led-list.service';
import { LedChannelTabActions } from '../actions';
import { ledChannelTabFeature, ledOverviewFeature } from '../features';

@Injectable()
export class LedChannelTabEffects {
  fetchChannels$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedChannelTabActions.fetchChannels),
      concatLatestFrom(() => [
        this.store.select(ledChannelTabFeature.selectLoaded),
        this.store.select(ledOverviewFeature.selectUserId),
      ]),
      filter(([_, isLoaded]) => !isLoaded),
      switchMap(([_, _isLoaded, userId]) =>
        this.ledListService.getLedChannels(userId).pipe(
          map((channels) => LedChannelTabActions.fetchChannelsSuccess({ channels })),
          catchError(() => of(LedChannelTabActions.fetchChannelsFailure())),
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
