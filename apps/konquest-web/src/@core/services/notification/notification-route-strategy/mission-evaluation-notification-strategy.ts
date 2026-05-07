import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BellNotification } from '@core/model/notification';
import { AbstractNotificationRouteStrategy } from './notification-route-strategy';

@Injectable()
export class MissionEvaluationNotificationStrategy extends AbstractNotificationRouteStrategy {
  constructor(protected router: Router) {
    super(router);
  }

  navigate(notification?: BellNotification): void {
    this.go(['missions', notification?.objectPk, 'details', 'evaluations']);
  }
}
