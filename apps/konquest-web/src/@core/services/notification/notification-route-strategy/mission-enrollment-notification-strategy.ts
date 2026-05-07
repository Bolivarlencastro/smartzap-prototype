import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractNotificationRouteStrategy } from './notification-route-strategy';
@Injectable()
export class MissionEnrollmentNotificationStrategy extends AbstractNotificationRouteStrategy {
  constructor(protected router: Router) {
    super(router);
  }

  navigate(): void {
    this.go(['enrollments', 'missions']);
  }
}
