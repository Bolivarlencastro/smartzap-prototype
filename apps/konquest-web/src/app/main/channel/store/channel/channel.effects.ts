import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import * as ChannelActions from './channel.actions';
import { ChannelAPI } from '../../channel.api';
import { Channel } from '../../channel.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { ChannelFormActions } from '../../pages/form/store/actions';

@Injectable()
export class ChannelEffects {
  postChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelActions.postChannel),
      switchMap(({ payload }) => {
        return this.channelAPI.postChannel(payload).pipe(
          tap(() => this.messageService.success('CHANNEL.SUBSCRIBED_SUCCESS')),
          map((channel: Channel) => ChannelActions.postChannelSuccess({ channel })),
          catchError((err) => of(ChannelActions.postChannelFailure({ errorMsg: err.message }))),
        );
      }),
    );
  });

  postChannelSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelActions.postChannelSuccess),
      map(({ channel }) => ChannelFormActions.getChannel({ channel_id: channel.id })),
    );
  });

  putChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelActions.putChannel),
      mergeMap(({ id, payload }) => {
        return this.channelAPI.putChannel(id, payload).pipe(
          tap(() => this.messageService.success('CHANNEL.SAVE.SUCCESS')),
          map((channel: Channel) => ChannelActions.putChannelSuccess({ channel })),
          catchError((err) => of(ChannelActions.putChannelFailure({ errorMsg: err.message }))),
        );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private channelAPI: ChannelAPI,
    private messageService: KpMessageService,
  ) {}
}
