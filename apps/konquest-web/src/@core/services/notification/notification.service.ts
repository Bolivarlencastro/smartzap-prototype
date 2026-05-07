import { Injectable, Injector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExtendDeadlineDialogComponent } from '@app/main/mission-enrollments/components/extend-deadline-dialog/extend-deadline-dialog.component';
import { ExtendDeadlineDialogData } from '@core/model/enrollment.model';
import { BellNotification } from '@core/model/notification';
import { DefaultNotificationStrategy } from './notification-route-strategy/default-notification-strategy';
import { NotificationRouteStrategy } from './notification-route-strategy/notification-route-strategy';
import { NotificationAPI } from '@core/api';

@Injectable()
export class NotificationService {
  constructor(
    private _dialog: MatDialog,
    private _injector: Injector,
    private _notificationAPI: NotificationAPI,
  ) {}

  openExtendDeadlineDialog(data: ExtendDeadlineDialogData): MatDialogRef<ExtendDeadlineDialogComponent, string> {
    return this._dialog.open(ExtendDeadlineDialogComponent, {
      autoFocus: false,
      width: '500px',
      disableClose: true,
      data,
    });
  }

  select(notification: BellNotification) {
    if (!notification) return;
    const { typeKey, id } = notification;
    let strategy = this._injector.get<NotificationRouteStrategy>(typeKey as any);
    strategy = strategy || new DefaultNotificationStrategy();
    strategy.navigate(notification);
    this.readNotification(id);
  }

  fetchAllNotifications() {
    return this._notificationAPI.fetchAllNotifications();
  }

  readAllNotifications() {
    return this._notificationAPI.readAllNotifications();
  }

  readNotification(id: string) {
    return this._notificationAPI.readNotification(id);
  }
}
