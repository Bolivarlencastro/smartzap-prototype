import { BellNotification } from '@core/model/notification';
import { DefaultNotificationStrategy } from './default-notification-strategy';

describe('DefaultNotificationStrategy', () => {
  let strategy: DefaultNotificationStrategy;

  beforeEach(() => {
    strategy = new DefaultNotificationStrategy();
  });

  it('should call console.warn when navigate is called', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const notification: BellNotification = {
      typeKey: 'CHANNEL_TRANSFERRED_TO_YOU',
    } as BellNotification;
    strategy.navigate(notification);
    expect(console.warn).toHaveBeenCalledWith('No action found to notification type: CHANNEL_TRANSFERRED_TO_YOU');
  });
});
