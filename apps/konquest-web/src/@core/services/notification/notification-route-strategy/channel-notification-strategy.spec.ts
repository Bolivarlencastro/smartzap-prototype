import { Router } from '@angular/router';
import { ChannelNotificationStrategy } from './channel-notification-strategy';

import { BellNotification } from '@core/model/notification';
import Chance from 'chance';

describe('ChannelNotificationStrategy', () => {
  const chance = new Chance();
  let strategy: ChannelNotificationStrategy;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
    strategy = new ChannelNotificationStrategy(routerMock as Router);
  });

  it('should navigate to channel details when navigate is called', () => {
    const notification: BellNotification = {
      objectPk: chance.guid({ version: 4 }),
    } as BellNotification;
    strategy.navigate(notification);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'channels', 'details', notification?.objectPk]);
  });
});
