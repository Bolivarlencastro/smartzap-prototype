import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChannelAPI } from 'app/main/channel/channel.api';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ChannelActions } from '../actions';

@Injectable()
export class ChannelEffects {
  loadChannels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelActions.loadChannels, ChannelActions.filterChannels),
      mergeMap(({ queryParams }) =>
        this.service.fetchChannels(queryParams).pipe(
          map((channels) => ChannelActions.loadChannelsSuccess({ channels })),
          catchError((error) => of(ChannelActions.loadChannelsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: ChannelAPI,
  ) {}
}
