import { Router } from '@angular/router';
import { MissionNotificationStrategy } from './mission-notification-strategy';

import { BellNotification } from '@core/model/notification';
import Chance from 'chance';

describe('MissionNotificationStrategy', () => {
  let strategy: MissionNotificationStrategy;
  let routerMock: Partial<Router>;
  const chance = new Chance();

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
    strategy = new MissionNotificationStrategy(routerMock as Router);
  });

  it('should navigate to mission detail when navigate is called', () => {
    const notification: BellNotification = {
      objectPk: chance.guid({ version: 4 }),
    } as BellNotification;

    strategy.navigate(notification);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'C', notification.objectPk]);
  });
});
