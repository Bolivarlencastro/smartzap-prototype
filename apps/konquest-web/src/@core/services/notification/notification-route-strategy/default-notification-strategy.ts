import { Injectable } from '@angular/core';
import { BellNotification } from '@core/model/notification';
import { NotificationRouteStrategy } from './notification-route-strategy';

@Injectable()
export class DefaultNotificationStrategy implements NotificationRouteStrategy {
  navigate(notification?: BellNotification) {
    console.warn(`No action found to notification type: ${notification.typeKey}`);
  }
}
