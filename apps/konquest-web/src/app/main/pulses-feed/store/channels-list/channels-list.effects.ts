import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, switchMap } from 'rxjs';
import { channelsListFeature, FeedActions, feedFeature } from '..';
import { ChannelsListService } from '../../services/channels-list.service';
import * as ChannelsListActions from './channels-list.actions';

@Injectable()
export class ChannelsListEffects {
  private readonly actions$ = inject(Actions);
  private readonly channelsListService = inject(ChannelsListService);
  private readonly store = inject(Store);

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.setTab),
      filter(({ tab }) => tab === 'channels'),
      map(() => ChannelsListActions.loadChannels()),
    );
  });

  loadChannelsList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelsListActions.loadChannels),
      concatLatestFrom(() => [
        this.store.select(channelsListFeature.selectFilter),
        this.store.select(feedFeature.selectActiveChannelsListParams),
      ]),
      switchMap(([_, filterParams, activeParams]) =>
        this.channelsListService.loadChannelsList({ ...filterParams, ...activeParams }).pipe(
          map((payload) => ChannelsListActions.loadChannelsSuccess({ payload })),
          catchError(() => of(ChannelsListActions.loadChannelsFailure())),
        ),
      ),
    );
  });

  fetchMoreChannels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelsListActions.fetchMoreChannels),
      concatLatestFrom(() => [
        this.store.select(channelsListFeature.selectFinished),
        this.store.select(channelsListFeature.selectFilter),
        this.store.select(feedFeature.selectActiveChannelsListParams),
      ]),
      filter(([_, isFinished]) => !isFinished),
      map(([_, __, filterParams, activeParams]) => ({ ...filterParams, ...activeParams })),
      exhaustMap((filter) => {
        const updatedFilter = { ...filter, page: (filter.page || 0) + 1 };
        return this.channelsListService.loadChannelsList(updatedFilter).pipe(
          map((response) => {
            return ChannelsListActions.fetchMoreChannelsSuccess({
              payload: { response, updatedFilter },
            });
          }),
          catchError(() => of(ChannelsListActions.fetchMoreChannelsFailure())),
        );
      }),
    );
  });

  onSideFilterChangedReloadChannels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.setSideFilters, FeedActions.clearSideFilters),
      concatLatestFrom(() => this.store.select(feedFeature.selectSelectedTab)),
      filter(([, tab]) => tab === 'channels'),
      map(() => ChannelsListActions.loadChannels()),
    );
  });

  toggleSubscription$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelsListActions.toggleSubscription),
      switchMap(({ channelId, subscriptionId }) =>
        this.channelsListService.toggleSubscription(channelId, subscriptionId).pipe(
          map(({ subscriptionId: newSubId }) =>
            ChannelsListActions.toggleSubscriptionSuccess({ channelId, subscriptionId: newSubId }),
          ),
          catchError(() =>
            of(
              ChannelsListActions.toggleSubscriptionFailure({
                channelId,
                originalSubscriptionId: subscriptionId ?? '',
              }),
            ),
          ),
        ),
      ),
    );
  });

  syncSubscribedChannelOnToggle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelsListActions.toggleSubscriptionSuccess),
      concatLatestFrom(({ channelId }) =>
        this.store.select(channelsListFeature.selectEntities).pipe(map((entities) => entities[channelId])),
      ),
      filter(([, channel]) => !!channel),
      map(([{ subscriptionId }, channel]) => {
        if (subscriptionId) {
          return FeedActions.addSubscribedChannel({
            channel: { id: channel?.id, name: channel?.name, cover_image: channel?.cover_image },
          });
        }
        return FeedActions.removeSubscribedChannel({ channelId: channel?.id });
      }),
    );
  });
}
