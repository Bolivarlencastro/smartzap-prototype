import { Router } from '@angular/router';
import { CertificateNotificationStrategy } from './certificate-notification-strategy';
import { NotificationRouteStrategy } from './notification-route-strategy';

describe('CertificateNotificationStrategy', () => {
  let strategy: NotificationRouteStrategy;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
    strategy = new CertificateNotificationStrategy(routerMock as Router);
  });

  it('should navigate to missions settings when navigate is called', () => {
    strategy.navigate();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'settings', 'missions']);
  });
});
