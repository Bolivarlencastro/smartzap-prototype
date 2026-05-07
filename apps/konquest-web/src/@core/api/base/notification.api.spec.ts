import { NotificationAPI } from './notification.api';
import { HttpClient } from '@angular/common/http';
import { EMPTY, of } from 'rxjs';

describe('NotificationAPI', () => {
  let service: NotificationAPI;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn().mockReturnValue(of(EMPTY)),
      post: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<HttpClient>;

    service = new NotificationAPI(httpMock);
  });

  it('should fetch bell notifications', () => {
    service.fetchAllNotifications();

    expect(httpMock.get).toHaveBeenCalledWith(`${service.API_URL}/bell-notifications`, expect.anything());
  });

  it('should read a notification', () => {
    const mockNotificationId = 'mock_id';
    service.readNotification(mockNotificationId);

    expect(httpMock.post).toHaveBeenCalledWith(
      `${service.API_URL}/bell-notifications/${mockNotificationId}/read`,
      '{}',
      expect.anything(),
    );
  });

  it('should read all notifications', () => {
    service.readAllNotifications();

    expect(httpMock.post).toHaveBeenCalledWith(
      `${service.API_URL}/bell-notifications/read-all`,
      '{}',
      expect.anything(),
    );
  });
});
