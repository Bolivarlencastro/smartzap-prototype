import { BellNotification } from '@core/model/notification';
import { PulseNotificationStrategy } from './pulse-notification-strategy';

import { Router } from '@angular/router';
import Chance from 'chance';

describe('PulseNotificationStrategy', () => {
  let strategy: PulseNotificationStrategy;
  let routerMock: Partial<Router>;
  const chance = new Chance();

  beforeEach(() => {
    routerMock = {
      navigateByUrl: jest.fn(),
    };
    strategy = new PulseNotificationStrategy(routerMock as Router);
  });

  it('should navigate to pulse detail when navigate is called', () => {
    const notification: BellNotification = {
      objectPk: chance.guid({ version: 4 }),
    } as BellNotification;

    strategy.navigate(notification);

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`/P/${notification.objectPk}`);
  });
});
