import { Router } from '@angular/router';
import { BellNotification } from '@core/model/notification';
import Chance from 'chance';
import { MissionExtendDeadlineNotificationStrategy } from './mission-extend-deadline-notification-strategy';
import { Store } from '@ngrx/store';
import { ExtendDeadlineActions } from '@app/shared/store';

describe('MissionExtendDeadlineNotificationStrategy', () => {
  let strategy: MissionExtendDeadlineNotificationStrategy;
  let routerMock: Partial<Router>;
  let storeMock: Partial<Store<any>>; // Replace
  const chance = new Chance();

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
    storeMock = {
      dispatch: jest.fn(),
    };
    strategy = new MissionExtendDeadlineNotificationStrategy(routerMock as Router, storeMock as Store<any>);
  });

  it('should navigate to mission evaluations detail when navigate is called', () => {
    const notification: BellNotification = {
      objectPk: chance.guid({ version: 4 }),
    } as BellNotification;

    strategy.navigate(notification);

    expect(storeMock.dispatch).toHaveBeenCalledWith(ExtendDeadlineActions.openExtendDeadlineDialog({ notification }));

    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'settings', 'missions']);
  });
});
