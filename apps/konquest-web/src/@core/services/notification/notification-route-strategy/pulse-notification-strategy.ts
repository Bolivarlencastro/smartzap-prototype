import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BellNotification } from '@core/model/notification';
import { navigateToPulse } from 'app/shared/services/route-dialog.service';
import { AbstractNotificationRouteStrategy } from './notification-route-strategy';

@Injectable()
export class PulseNotificationStrategy extends AbstractNotificationRouteStrategy {
  constructor(protected router: Router) {
    super(router);
  }

  navigate(notification?: BellNotification): void {
    navigateToPulse(this.router, notification.objectPk);
  }
}
