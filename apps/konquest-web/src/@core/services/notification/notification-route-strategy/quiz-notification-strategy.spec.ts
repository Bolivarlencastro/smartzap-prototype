import { Router } from '@angular/router';
import { QuizNotificationStrategy } from './quiz-notification-strategy';

import { BellNotification } from '@core/model/notification';
import Chance from 'chance';

describe('QuizNotificationStrategy', () => {
  let strategy: QuizNotificationStrategy;
  let routerMock: Partial<Router>;
  const chance = new Chance();

  beforeEach(() => {
    routerMock = {
      navigateByUrl: jest.fn(),
    };
    strategy = new QuizNotificationStrategy(routerMock as Router);
  });

  it('should navigate to pulse quiz when navigate is called', () => {
    const notification: BellNotification = {
      objectPk: chance.guid({ version: 4 }),
    } as BellNotification;

    strategy.navigate(notification);

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`/P/${notification.objectPk}`);
  });
});
