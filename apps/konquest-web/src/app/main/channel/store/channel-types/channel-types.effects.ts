import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as ChannelTypesActions from './channel-types.actions';
import { ChannelAPI } from '../../channel.api';
import { ChannelType } from '../../channel.model';
import { Pagination } from '@core/model';

@Injectable()
export class ChannelTypesEffects {
  getChannelTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelTypesActions.getChannelTypes),
      switchMap(() => {
        return this.channelAPI.getChannelTypes().pipe(
          map((payload: Pagination<ChannelType>) => ChannelTypesActions.getChannelTypesSuccess({ payload })),
          catchError((err) =>
            of(
              ChannelTypesActions.getChannelTypesFailure({
                errorMsg: err.message,
              }),
            ),
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
