import { ActivityService } from './activity.service';
import {
  AnalyticsEventTypes,
  AuthService,
  KonquestLearnActivitiesApi,
  LearnContent,
  LearnContentActivity,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMediaPlayerStorageService } from '@keeps-platform-frontend-workspace/ui/kp-media-player';
import { EMPTY, of } from 'rxjs';

describe('ActivityService', () => {
  let service: ActivityService;
  let learnActivitiesApiMock: jest.Mocked<KonquestLearnActivitiesApi>;
  let authServiceStub: jest.Mocked<AuthService>;
  let mediaPlayerServiceMock: jest.Mocked<KpMediaPlayerStorageService>;
  const mockUserId = 'mock_user_id';

  beforeEach(() => {
    learnActivitiesApiMock = {
      create: jest.fn().mockReturnValue(of(EMPTY)),
      update: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<KonquestLearnActivitiesApi>;

    authServiceStub = {
      userId: mockUserId,
    } as unknown as jest.Mocked<AuthService>;

    mediaPlayerServiceMock = {
      playbackRate: 1,
    } as unknown as jest.Mocked<KpMediaPlayerStorageService>;

    service = new ActivityService(learnActivitiesApiMock, authServiceStub, mediaPlayerServiceMock);
  });

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('02 Oct 2024 08:00:00 GMT-0300'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createLearnActivity', () => {
    // We need to use the fake timers here because the cases instances are created before the beforeEach is called
    jest.useFakeTimers().setSystemTime(new Date('02 Oct 2024 08:00:00 GMT-0300'));
    const mockStepId = 'step_id';
    const cases: { learnContent: LearnContent; learnContentActivity: LearnContentActivity }[] = [
      {
        learnContent: { content_type: { name: 'HTML' } } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.VIEW,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'HTML FILE' } } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.VIEW,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'Image' } } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.VIEW,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'Pdf' } } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.READ,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'Text' } } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.READ,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'Spreadsheet' } } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.READ,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'Podcast' }, url: 'mock_content_url' } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.LISTEN,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
          speed: 1,
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'Presentation' } } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.READ,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'Scorm' } } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.READ,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
        } as LearnContentActivity,
      },
      {
        learnContent: { content_type: { name: 'Video' }, url: 'mock_content_url' } as LearnContent,
        learnContentActivity: {
          action: AnalyticsEventTypes.WATCH,
          mission_stage_content: mockStepId,
          user: mockUserId,
          time_start: new Date(),
          time_stop: new Date(),
          speed: 1,
        } as LearnContentActivity,
      },
    ];

    test.each(cases)(
      'should create the learn activity for the content type with the correct payload',
      ({ learnContent, learnContentActivity }) => {
        service.createLearnActivity(mockStepId, learnContent);
        expect(learnActivitiesApiMock.create).toHaveBeenCalledWith(learnContentActivity);
      },
    );
  });

  describe('updateLearnActivityStopTime', () => {
    it('should update the time_stop of an existing LearnContentActivity', () => {
      const learContentActivity = { id: 'mock_activity_id', action: AnalyticsEventTypes.WATCH } as LearnContentActivity;
      const learnContent = { content_type: { name: 'Video' }, url: 'mock_content_url' } as LearnContent;
      const expectedPayload = { speed: 1, time_stop: new Date() } as LearnContentActivity;

      service.updateLearnActivityStopTime(learContentActivity, learnContent);
      expect(learnActivitiesApiMock.update).toHaveBeenCalledWith('mock_activity_id', expectedPayload);
    });
  });
});
