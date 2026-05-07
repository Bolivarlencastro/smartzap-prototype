import { Injectable } from '@angular/core';
import { NotificationService } from '@core/api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as fromActions from '../actions/notification.actions';
import * as fromSelectors from '../selectors/notification.selectors';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';

@Injectable()
export class NotificationEffects {
  load$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.fetchNotifications),
      switchMap(() => {
        return this._notificationService.fetchAllNotifications().pipe(
          map((payload) => {
            return fromActions.fetchNotificationsSuccess({ payload });
          }),
          catchError((error) => this.handleError(error)),
        );
      }),
    );
  });

  read$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.readNotification),
      mergeMap(({ id }) => {
        return this._notificationService.readNotification(id).pipe(
          map(() => {
            return fromActions.readNotificationSuccess({ id });
          }),
          catchError((error) => this.handleError(error)),
        );
      }),
    );
  });

  readAll$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.readAllNotifications),
      mergeMap(() => {
        return this._notificationService.readAllNotifications().pipe(
          map(() => {
            return fromActions.readAllNotificationsSuccess();
          }),
          catchError((error) => this.handleError(error)),
        );
      }),
    );
  });

  select$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.selectNotification),
      concatLatestFrom((action) => this.store.select(fromSelectors.selectCurrentNotification(action.id))),
      map(([_, notification]) => {
        if (notification) {
          this._notificationService.select(notification);
          return fromActions.readNotificationSuccess({ id: notification.id });
        } else {
          return fromActions.notificationFailure({ error: new Error('Notification not found') });
        }
      }),
    );
  });

  constructor(
    private store: Store,
    private _actions$: Actions,
    private _notificationService: NotificationService,
  ) {}

  private handleError(error: any) {
    console.error(error);
    return of(fromActions.notificationFailure({ error }));
  }
}
