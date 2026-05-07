import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { PulsesListService } from '../../services/pulses-list.service';
import { pulsesListFeature } from '../pulses-list/pulses-list.feature';
import { pulseDetailsFeature } from '../pulse-details/pulse-details.feature';
import { FeedActions } from '..';
import * as PulseChannelActions from './pulse-channel-action.actions';

@Injectable()
export class PulseChannelActionEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly pulsesListService = inject(PulsesListService);

  toggleBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseChannelActions.toggleBookmark),
      switchMap(({ pulseId, bookmarkId }) =>
        this.pulsesListService.toggleBookmark(pulseId, bookmarkId).pipe(
          map(({ bookmarkId: newBookmarkId }) =>
            PulseChannelActions.toggleBookmarkSuccess({ pulseId, bookmarkId: newBookmarkId }),
          ),
          catchError(() =>
            of(PulseChannelActions.toggleBookmarkFailure({ pulseId, originalBookmarkId: bookmarkId ?? '' })),
          ),
        ),
      ),
    );
  });

  ratePulse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseChannelActions.ratePulse),
      switchMap(({ pulseId, rating }) =>
        this.pulsesListService.ratePulse(pulseId, rating).pipe(
          switchMap(() => this.pulsesListService.loadPulseAverageRating(pulseId)),
          map((averageRating) => PulseChannelActions.ratePulseSuccess({ pulseId, averageRating })),
          catchError(() => of(PulseChannelActions.ratePulseFailure({ pulseId }))),
        ),
      ),
    );
  });

  copyPulseLink$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PulseChannelActions.copyPulseLink),
        tap(({ pulseId }) => this.pulsesListService.copyPulseLink(pulseId)),
      );
    },
    { dispatch: false },
  );

  toggleSubscription$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseChannelActions.toggleSubscription),
      switchMap(({ pulseId, channelId, channelSubscription, channel }) =>
        this.pulsesListService.toggleSubscription(channelId, channelSubscription).pipe(
          map(({ channelSubscription: newSub }) =>
            PulseChannelActions.toggleSubscriptionSuccess({ pulseId, channelId, channelSubscription: newSub, channel }),
          ),
          catchError(() =>
            of(
              PulseChannelActions.toggleSubscriptionFailure({
                pulseId,
                channelId,
                originalChannelSubscription: channelSubscription,
              }),
            ),
          ),
        ),
      ),
    );
  });

  syncFeedOnSubscriptionToggle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseChannelActions.toggleSubscriptionSuccess),
      map(({ channelSubscription, channel }) => {
        if (channelSubscription) {
          return FeedActions.addSubscribedChannel({ channel });
        }
        return FeedActions.removeSubscribedChannel({ channelId: channel.id });
      }),
    );
  });

  syncFavoritePulseOnToggleBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseChannelActions.toggleBookmarkSuccess),
      concatLatestFrom(({ pulseId }) => [
        this.store.select(pulsesListFeature.selectEntities).pipe(map((entities) => entities[pulseId])),
        this.store.select(pulseDetailsFeature.selectPulse),
      ]),
      map(([{ pulseId, bookmarkId }, listPulse, detailsPulse]) => {
        if (bookmarkId) {
          return FeedActions.addFavoritePulse({
            pulse: {
              id: pulseId,
              name: listPulse?.name ?? detailsPulse?.name,
              cover_image: listPulse?.cover_image ?? detailsPulse?.holder_image,
            },
          });
        }
        return FeedActions.removeFavoritePulse({ pulseId });
      }),
    );
  });
}
