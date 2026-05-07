import { Router } from '@angular/router';
import { BellNotification } from '@core/model/notification';

export interface NotificationRouteStrategy {
  navigate(notification?: BellNotification): void;
}

export abstract class AbstractNotificationRouteStrategy implements NotificationRouteStrategy {
  constructor(private _router: Router) {}

  abstract navigate(notification?: BellNotification): void;

  protected go(routeSegments: string[]) {
    this._router.navigate(['/', ...routeSegments]);
  }
}
