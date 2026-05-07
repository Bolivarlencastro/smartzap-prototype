import { Router } from '@angular/router';
import { BellNotification } from '@core/model/notification';
import Chance from 'chance';
import { MissionEvaluationNotificationStrategy } from './mission-evaluation-notification-strategy';

describe('MissionEvaluationNotificationStrategy', () => {
  let strategy: MissionEvaluationNotificationStrategy;
  let routerMock: Partial<Router>;
  const chance = new Chance();

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
    strategy = new MissionEvaluationNotificationStrategy(routerMock as Router);
  });

  it('should navigate to mission evaluations detail when navigate is called', () => {
    const notification: BellNotification = {
      objectPk: chance.guid({ version: 4 }),
    } as BellNotification;

    strategy.navigate(notification);

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/',
      'missions',
      notification.objectPk,
      'details',
      'evaluations',
    ]);
  });
});
