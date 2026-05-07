import { Router } from '@angular/router';
import { LearningTrailNotificationStrategy } from './learning-trail-notification-strategy';

import { BellNotification } from '@core/model/notification';
import Chance from 'chance';

describe('LearningTrailNotificationStrategy', () => {
  const chance = new Chance();
  let strategy: LearningTrailNotificationStrategy;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
    strategy = new LearningTrailNotificationStrategy(routerMock as Router);
  });

  it('should navigate to learn trail detail when navigate is called', () => {
    const notification: BellNotification = {
      objectPk: chance.guid({ version: 4 }),
    } as BellNotification;
    strategy.navigate(notification);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'T', notification?.objectPk]);
  });
});
