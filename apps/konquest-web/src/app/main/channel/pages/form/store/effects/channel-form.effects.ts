import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LearnContentsService } from '@core/services/learn-contents.service';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { ChannelFormSelectors } from 'app/main/channel/pages/form/store/selectors';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ChannelAPI } from '../../../../channel.api';
import { Channel } from '../../../../channel.model';
import * as ChannelActions from '../../../../store/channel/channel.actions';
import { ChannelFormActions } from '../actions';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable()
export class ChannelFormEffects {
  search$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelFormActions.getChannel),
      switchMap(({ channel_id }) => {
        return this._channelAPI.getChannel(channel_id).pipe(
          map((channel: Channel) => ({ ...channel })),
          map((channel: Channel) => ChannelFormActions.getChannelSuccess({ channel })),
          catchError((err) => of(ChannelFormActions.getChannelFailure({ errorMsg: err.message }))),
        );
      }),
    );
  });

  submit$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelFormActions.submit),
      map(({ id, channel }) => {
        return id
          ? ChannelActions.putChannel({ id, payload: channel })
          : ChannelActions.postChannel({ payload: channel });
      }),
    );
  });

  getChannelCover$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelFormActions.getChannelCover),
      mergeMap(({ image, id, channel }) => {
        return this._learnContentsService.getCoverUrl(image, 300, 300).pipe(
          map(({ url }) =>
            ChannelActions.putChannel({
              id,
              payload: {
                ...channel,
                holder_image: url,
              },
            }),
          ),
          tap({
            next: () => this._fuseLoadingService.hide(),
            error: () => this._messageService.error(marker('GENERAL.ERROR.UPLOAD')),
          }),
          catchError((error) => of(ChannelFormActions.getChannelCoverFailure({ errorMsg: error.message }))),
        );
      }),
    );
  });

  putChannelSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelActions.putChannelSuccess),
      map(({ channel }) => ChannelFormActions.getChannel({ channel_id: channel.id })),
    );
  });

  goToChannel = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(ChannelFormActions.goToChannel),
        concatLatestFrom(() => this.store.select(ChannelFormSelectors.selectChannelFormApp)),
        map(([_, channel]) => {
          this._router.navigate(['channels/details', channel?.id]).then();
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private _actions$: Actions,
    private _channelAPI: ChannelAPI,
    private _fuseLoadingService: FuseLoadingService,
    private _learnContentsService: LearnContentsService,
    private _messageService: KpMessageService,
    private store: Store,
    private _router: Router,
  ) {}
}
