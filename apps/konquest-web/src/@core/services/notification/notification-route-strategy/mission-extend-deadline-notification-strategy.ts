import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractNotificationRouteStrategy } from './notification-route-strategy';
import { Store } from '@ngrx/store';
import { ExtendDeadlineActions } from '@app/shared/store';
import { BellNotification } from '@core/model/notification';

@Injectable()
export class MissionExtendDeadlineNotificationStrategy extends AbstractNotificationRouteStrategy {
  constructor(
    protected router: Router,
    private store: Store,
  ) {
    super(router);
  }

  navigate(notification?: BellNotification): void {
    this.store.dispatch(ExtendDeadlineActions.openExtendDeadlineDialog({ notification: notification }));
    this.go(['settings', 'missions']);
  }
}
