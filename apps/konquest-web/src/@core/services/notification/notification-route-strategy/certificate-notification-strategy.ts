import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractNotificationRouteStrategy } from './notification-route-strategy';

@Injectable()
export class CertificateNotificationStrategy extends AbstractNotificationRouteStrategy {
  constructor(protected router: Router) {
    super(router);
  }

  navigate(): void {
    this.go(['settings', 'missions']);
  }
}
