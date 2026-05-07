import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as GroupChannelActions from './group-channel.actions';
import { GroupChannelAPI } from '../group-channel.api';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
@Injectable()
export class GroupChannelEffects {
  loadGroupMissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupChannelActions.loadGroupChannels, GroupChannelActions.filterGroupChannels),
      switchMap(({ id, queryParams }) =>
        this.service.fetchByQuery(id, queryParams).pipe(
          map((data) => GroupChannelActions.loadGroupChannelsSuccess({ data })),
          catchError((error) => of(GroupChannelActions.loadGroupChannelsFailure({ error }))),
        ),
      ),
    );
  });

  addMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupChannelActions.addGroupChannels),
      switchMap(({ id, channelIds }) =>
        this.service.addMany(id, channelIds).pipe(
          tap((data) => this._errorHandlerService.showImportEnrollmentsErrorDialog(data)),
          map(() => GroupChannelActions.filterGroupChannels({ id, queryParams: { page: 1, per_page: 10 } })),
          catchError((error) => of(GroupChannelActions.loadGroupChannelsFailure({ error }))),
        ),
      ),
    );
  });

  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupChannelActions.deleteGroupChannel),
      switchMap(({ groupId, channelId }) =>
        this.service.delete(groupId, channelId).pipe(
          map(() => GroupChannelActions.deleteGroupChannelSuccess()),
          catchError((error) => of(GroupChannelActions.loadGroupChannelsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: GroupChannelAPI,
    private _errorHandlerService: GenericErrorHandlerService,
  ) {}
}
