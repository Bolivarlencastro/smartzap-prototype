import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ChannelDialogService } from '../../../services/channel-dialog.service';
import { ChannelDialogActions } from '../actions';
import { channelDialogFeature } from '../features';

@Injectable()
export class ChannelDialogEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ChannelDialogActions.openDialog),
        tap(() => this.channelDialogService.openDialog()),
      );
    },
    { dispatch: false },
  );

  fetchData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDialogActions.fetchData),
      concatLatestFrom(() => this.store.select(channelDialogFeature.selectChannelId)),
      switchMap(([_, channelId]) =>
        this.channelDialogService.fetchData(channelId).pipe(
          map((data) => ChannelDialogActions.fetchDataSuccess({ data })),
          catchError(() => of(ChannelDialogActions.fetchDataFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly channelDialogService: ChannelDialogService,
  ) {}
}
