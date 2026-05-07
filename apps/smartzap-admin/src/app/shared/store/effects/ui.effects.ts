import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '@core/services';
import { UiService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { BillingActions, UIActions } from '../actions';

@Injectable()
export class UIEffects {
  showProcessing$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(UIActions.showProcessing),
        tap(() => this._snackBar.openFromComponent(KpSnackLoadingComponent)),
      );
    },
    { dispatch: false },
  );

  hideProcessing$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(UIActions.hideProcessing),
        tap(() => this._snackBar.dismiss()),
      );
    },
    { dispatch: false },
  );

  getSelectedWorkspace$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.appInit),
      map(() => this._workspaceService.getCurrentWorkspace()),
      map((workspace) => UIActions.setSelectedWorkspace({ selectedWorkspace: workspace || {} })),
    );
  });

  setSelectedWorkspace$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.setSelectedWorkspace),
      map(({ selectedWorkspace }) => BillingActions.loadBilling({ workspaceId: selectedWorkspace?.id })),
    );
  });

  fetchNotifications$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.fetchNotifications),
      switchMap(() =>
        this._notificationService.fetchNotifications().pipe(
          map((notifications) => UIActions.fetchNotificationSuccess({ notifications })),
          catchError(() =>
            of(
              UIActions.fetchNotificationFailure({
                error: 'NOTIFICATION.FETCH.ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  clearAllNotifications$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.clearAllNotifications),
      switchMap(() =>
        this._notificationService.clearAllNotifications().pipe(
          map(() => UIActions.clearAllNotificationsSuccess()),
          catchError(() =>
            of(
              UIActions.clearAllNotificationsFailure({
                error: 'NOTIFICATION.CLEAR_ALL.ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  selectNotification$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.selectNotification),
      map(({ notification }) => {
        this._notificationService.selectNotification(notification);
        return UIActions.discardNotification({ notificationId: notification.id });
      }),
    );
  });

  discardNotification$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.discardNotification),
      switchMap(({ notificationId }) =>
        this._notificationService.readNotification(notificationId).pipe(
          map((response) => UIActions.discardNotificationSuccess({ notification: response })),
          catchError(() =>
            of(
              UIActions.discardNotificationFailure({
                error: 'NOTIFICATION.DISCARD.ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  selectNotificationSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.selectNotificationSuccess),
      map(() => UIActions.fetchNotifications()),
    );
  });
  discardNotificationSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.discardNotificationSuccess),
      map(() => UIActions.fetchNotifications()),
    );
  });

  getApplicationRoles$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UIActions.appInit),
      switchMap(() =>
        this._uiService.userApplications$.pipe(
          map((apps: any) => UIActions.getApplicationRolesSuccess({ apps })),
          catchError(() => of(UIActions.getApplicationRolesFailure({ error: 'APP-MENU.ERROR' }))),
        ),
      ),
    );
  });

  constructor(
    private _actions$: Actions,
    private _workspaceService: WorkspaceService,
    private _snackBar: MatSnackBar,
    private _uiService: UiService,
    private _notificationService: NotificationService,
  ) {}
}
