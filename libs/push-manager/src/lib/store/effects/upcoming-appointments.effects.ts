import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { PanelService } from '../../services/panel.service';
import { PushHistoryActions } from '../actions/push-history.actions';
import { UpcomingAppointmentsActions } from '../actions/upcoming-appointments.actions';
import { upcomingAppointmentsFeature } from '../features/upcoming-appointments.feature';

@Injectable()
export class UpcomingAppointmentsEffects {
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        UpcomingAppointmentsActions.load,
        UpcomingAppointmentsActions.search,
        UpcomingAppointmentsActions.changePage,
        UpcomingAppointmentsActions.sort,
      ),
      concatLatestFrom(() => this.store.select(upcomingAppointmentsFeature.selectFilters)),
      switchMap(([_, filters]) =>
        this.panelService.fetchUpcomingAppointments(filters).pipe(
          map((response) =>
            UpcomingAppointmentsActions.loadSuccess({ data: response.data, total: response.meta.totalItems }),
          ),
          catchError(() => of(UpcomingAppointmentsActions.loadFailure())),
        ),
      ),
    );
  });

  cancelPush$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UpcomingAppointmentsActions.cancelPush),
      switchMap(({ id }) =>
        this.panelService.cancelCampaign(id).pipe(
          map(() => UpcomingAppointmentsActions.cancelPushSuccess({ id })),
          catchError(() => of(UpcomingAppointmentsActions.cancelPushFailure())),
        ),
      ),
    );
  });

  updatePushHistoryOnCancelSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UpcomingAppointmentsActions.cancelPushSuccess),
      map(() => PushHistoryActions.load()),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly panelService: PanelService,
  ) {}
}
