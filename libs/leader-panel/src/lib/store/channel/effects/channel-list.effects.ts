import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { ListService } from '../../../services/list.service';
import { ChannelListActions } from '../actions';
import { channelListFeature } from '../features';

@Injectable()
export class ChannelListEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ChannelListActions.init),
      concatLatestFrom(() => this.store.select(channelListFeature.selectLoaded)),
      filter(([_, loaded]) => !loaded),
      map(() => ChannelListActions.fetchChannels()),
    );
  });

  fetchChannels$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ChannelListActions.fetchChannels),
      concatLatestFrom(() => this.store.select(channelListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.listService.getChannels(filter).pipe(
          map((response) => ChannelListActions.fetchChannelsSuccess({ response })),
          catchError(() => of(ChannelListActions.fetchChannelsFailure())),
        ),
      ),
    );
  });

  reloadChannels$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ChannelListActions.search, ChannelListActions.sort, ChannelListActions.setPagination),
      map(() => ChannelListActions.fetchChannels()),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly listService: ListService,
    private readonly store: Store,
  ) {}
}
