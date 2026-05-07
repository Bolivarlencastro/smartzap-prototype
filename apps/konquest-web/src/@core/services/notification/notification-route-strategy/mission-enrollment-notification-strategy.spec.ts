import { Router } from '@angular/router';
import { MissionEnrollmentNotificationStrategy } from './mission-enrollment-notification-strategy';

describe('MissionEnrollmentNotificationStrategy', () => {
  let strategy: MissionEnrollmentNotificationStrategy;
  let routerMock: Partial<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    };
    strategy = new MissionEnrollmentNotificationStrategy(routerMock as Router);
  });

  it('should navigate to mission enrollments when navigate is called', () => {
    strategy.navigate();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'enrollments', 'missions']);
  });
});
