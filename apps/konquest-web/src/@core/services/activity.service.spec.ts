import { ActivityService } from './activity.service';
import { KonquestActivityApi } from '@core/api';
import { AnalyticsEventTypes, AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { URLService } from '@core/services/url.service';
import { EMPTY, of, throwError } from 'rxjs';
import { KpMediaPlayerStorageService } from '@keeps-platform-frontend-workspace/ui/kp-media-player';

describe('ActivityService', () => {
  let service: ActivityService;
  let activityApiMock: jest.Mocked<KonquestActivityApi>;
  let authServiceMock: jest.Mocked<AuthService>;
  let urlServiceMock: jest.Mocked<URLService>;
  let kpMediaPlayerServiceMock: jest.Mocked<KpMediaPlayerStorageService>;

  beforeEach(() => {
    activityApiMock = {
      create: jest.fn(() => of(EMPTY)),
      update: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<KonquestActivityApi>;

    authServiceMock = {
      userId: 'mock_id',
    } as unknown as jest.Mocked<AuthService>;

    urlServiceMock = { isSoundCloudUrl: jest.fn(() => true) } as unknown as jest.Mocked<URLService>;
    kpMediaPlayerServiceMock = {
      playbackRate: 1,
    } as unknown as jest.Mocked<KpMediaPlayerStorageService>;

    service = new ActivityService(activityApiMock, authServiceMock, urlServiceMock, kpMediaPlayerServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onTrackingFailure', () => {
    const mockError = { message: 'error_message' };

    it('should log when tracking creation fails', () => {
      const logSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
      activityApiMock.create.mockReturnValueOnce(throwError(() => mockError));

      service.registry({}, AnalyticsEventTypes.VIEW);

      expect(logSpy).toHaveBeenCalledWith('There was an error while tracking the user progress', mockError);
    });

    it('should emit when tracking update fails', () => {
      const logSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
      activityApiMock.create.mockReturnValueOnce(of({ id: 'mock_tracking_id' } as any));
      activityApiMock.update.mockReturnValueOnce(throwError(() => mockError));

      service.registry({}, AnalyticsEventTypes.VIEW);
      service.update();

      expect(logSpy).toHaveBeenCalledWith('There was an error while tracking the user progress', mockError);
    });
  });
});
