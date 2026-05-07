import * as TransferActions from '../../../../../transfer-dialog/store/actions/actions';

import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { ChannelService } from '@core/api';
import * as RouterActions from 'app/shared/store/actions/router.action';
import { ChannelAPI } from '../../../../channel.api';
import { Channel } from '../../../../channel.model';
import { ChannelDetailActions, ChannelDetailCommentActions, ChannelDetailPulsesActions } from '../actions';
import { concatLatestFrom } from '@ngrx/operators';
import { ChannelDetailSelectors } from '../selectors';
import { Store } from '@ngrx/store';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable()
export class ChannelDetailEffects {
  getChannelOnLoadRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.getChannelOnLoadRoute),
      concatMap(({ channel_id, params }) => {
        return concat(
          of(ChannelDetailActions.getChannel({ channel_id })),
          of(ChannelDetailCommentActions.getChannelComments({ payload: params })),
          of(ChannelDetailPulsesActions.getChannelPulses({ channelId: channel_id })),
        );
      }),
    );
  });

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.getChannel),
      switchMap(({ channel_id }) => {
        return this.channelAPI.getChannel(channel_id).pipe(
          map((channel: Channel) => ChannelDetailActions.getChannelSuccess({ channel })),
          catchError((err) =>
            of(
              ChannelDetailActions.getChannelFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.deleteChannel),
      switchMap(({ channel_id }) => {
        return this.channelAPI.deleteChannel(channel_id || '').pipe(
          map(() => {
            return ChannelDetailActions.deleteChannelSuccess();
          }),
          catchError((err) =>
            of(
              ChannelDetailActions.deleteChannelFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  deleteChannelSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.deleteChannelSuccess),
      map(() => new RouterActions.Go({ path: ['/pulses-feed'] })),
    );
  });

  getSubscribers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.getChannelSubscribers),
      switchMap(({ channel_id }) => {
        return this.channelAPI.getSubscribers(channel_id).pipe(
          map((subscribers) =>
            ChannelDetailActions.getChannelSubscribersSuccess({
              subscribers: subscribers.results,
            }),
          ),
          catchError((err) =>
            of(
              ChannelDetailActions.getChannelSubscribersFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  subscribeToChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.subscribeToChannel),
      mergeMap(({ channel }) => {
        return this._channelsService.postChannelSubscription(channel.id).pipe(
          tap(() => this._messageService.success('GENERAL.SUCCESSFULLY_SUBSCRIBED')),
          map(({ id: subscription }) => ChannelDetailActions.updateChannelSubscription({ channel, subscription })),
        );
      }),
    );
  });

  unsubscribeFromChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.unsubscribeFromChannel),
      mergeMap(({ channel }) => {
        return this._channelsService.deleteChannelSubscriptions(channel.subscription.id || '').pipe(
          tap(() => this._messageService.success('GENERAL.SUBSCRIPTION_REMOVED')),
          map(() => ChannelDetailActions.updateChannelSubscription({ channel })),
        );
      }),
    );
  });

  resetAllStates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.resetState),
      concatMap(() => {
        return concat(of(ChannelDetailPulsesActions.resetState()), of(TransferActions.resetState()));
      }),
    );
  });

  updateChannelDescription$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailActions.updateChannelDescription),
      concatLatestFrom(() => this.store.select(ChannelDetailSelectors.selectChannelDetailId)),
      switchMap(([{ description }, channel_id]) =>
        this.channelAPI.updateChannelDescription(channel_id, description).pipe(
          map(() => ChannelDetailActions.updateChannelDescriptionSuccess({ description })),
          catchError(() => of(ChannelDetailActions.updateChannelDescriptionFailure())),
        ),
      ),
    );
  });

  updateChannelDescriptionSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ChannelDetailActions.updateChannelDescriptionSuccess),
        map(() => this._messageService.success(marker('CHANNEL.DETAIL.DESCRIPTION_UPDATE_SUCCESS'))),
      );
    },
    { dispatch: false },
  );

  updateChannelDescriptionFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ChannelDetailActions.updateChannelDescriptionFailure),
        map(() => this._messageService.success(marker('CHANNEL.DETAIL.DESCRIPTION_UPDATE_ERROR'))),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private channelAPI: ChannelAPI,
    private _channelsService: ChannelService,
    private _messageService: KpMessageService,
    private store: Store,
  ) {}
}
