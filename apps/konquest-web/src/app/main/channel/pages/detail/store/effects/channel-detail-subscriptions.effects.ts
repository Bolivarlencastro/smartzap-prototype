import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { ChannelDetailActions, ChannelDetailSubscriptionsActions } from '../actions';
import { ChannelAPI } from '../../../../channel.api';
import { ChannelSubscription } from '../../../../channel.model';

@Injectable()
export class ChannelDetailSubscriptionsEffects {
  postSubscriptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailSubscriptionsActions.postChannelSubscriptions),
      mergeMap(({ payload }) => {
        return this.channelAPI.postChannelSubscriptions(payload).pipe(
          mergeMap((channelSubscription: ChannelSubscription) => {
            const { channel } = channelSubscription;
            return concat(
              of(
                ChannelDetailActions.getChannel({
                  channel_id: String(channel),
                }),
              ),
              of(ChannelDetailSubscriptionsActions.postChannelSubscriptionsSuccess({ payload: channelSubscription })),
            );
          }),
          catchError((err) =>
            of(ChannelDetailSubscriptionsActions.postChannelSubscriptionsFailure({ errorMsg: err.message })),
          ),
        );
      }),
    );
  });

  deleteSubscriptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailSubscriptionsActions.deleteChannelSubscriptions),
      switchMap(({ payload }) => {
        return this.channelAPI.getChannelSubscriptions(payload).pipe(
          map((channelsSubscriptions) => {
            return { id: channelsSubscriptions.results?.[0].id, payload };
          }),
          catchError((err) =>
            of(ChannelDetailSubscriptionsActions.deleteChannelSubscriptionsFailure({ errorMsg: err.message })),
          ),
        );
      }),
      mergeMap((data) => {
        const { id, payload } = data as any;

        return this.channelAPI.deleteChannelSubscriptions(id).pipe(
          mergeMap(() => {
            return concat(
              of(
                ChannelDetailActions.getChannel({
                  channel_id: payload.channel,
                }),
              ),
              of(ChannelDetailSubscriptionsActions.deleteChannelSubscriptionsSuccess({ sucess: true })),
            );
          }),
          catchError((err) =>
            of(ChannelDetailSubscriptionsActions.deleteChannelSubscriptionsFailure({ errorMsg: err.message })),
          ),
        );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private channelAPI: ChannelAPI,
  ) {}
}
