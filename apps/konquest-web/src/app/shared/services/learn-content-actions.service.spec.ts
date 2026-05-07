import { LearnContentActionsService } from './learn-content-actions.service';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import {
  AluraIntegrationsApi,
  AuthService,
  KeepsPathLocationStrategy,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Router } from '@angular/router';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EMPTY, of, throwError } from 'rxjs';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

describe('LearnContentActionsService', () => {
  let service: LearnContentActionsService;
  let missionEnrollmentsApiMock: jest.Mocked<MissionEnrollmentsAPI>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let locationMock: jest.Mocked<KeepsPathLocationStrategy>;
  let clipboardMock: jest.Mocked<Clipboard>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let aluraIntegrationApiMock: jest.Mocked<AluraIntegrationsApi>;
  const accessUrlStub = 'https://integration-course-access-url';

  beforeEach(() => {
    missionEnrollmentsApiMock = {
      requestExtendDeadline: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<MissionEnrollmentsAPI>;

    authServiceMock = {
      userId: jest.fn().mockReturnValue('mock_user_id'),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = { navigate: jest.fn().mockResolvedValue(true) } as unknown as jest.Mocked<Router>;

    missionServiceMock = {
      enroll: jest.fn().mockReturnValue(of(EMPTY)),
      bookmark: jest.fn().mockReturnValue(of(EMPTY)),
      removeBookmark: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<MissionServiceV2>;

    locationMock = {
      getHashFromUrl: jest.fn().mockReturnValue('mock_hash'),
    } as unknown as jest.Mocked<KeepsPathLocationStrategy>;

    clipboardMock = { copy: jest.fn() } as unknown as jest.Mocked<Clipboard>;

    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    aluraIntegrationApiMock = {
      getAccessUrlByMissionId: jest.fn().mockReturnValue(of({ url: accessUrlStub })),
    } as unknown as jest.Mocked<AluraIntegrationsApi>;

    service = new LearnContentActionsService(
      missionEnrollmentsApiMock,
      authServiceMock,
      routerMock,
      missionServiceMock,
      locationMock,
      clipboardMock,
      messageServiceMock,
      aluraIntegrationApiMock,
    );
  });

  describe('bookmark', () => {
    const contentId = 'mock_content_id';

    describe('addBookmark', () => {
      it('should display a success message', (done) => {
        service.addBookmark(contentId).subscribe(() => {
          expect(missionServiceMock.bookmark).toHaveBeenCalledWith(contentId);
          expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.BOOKMARK_ADDED');

          done();
        });
      });

      it('should display an error message', (done) => {
        missionServiceMock.bookmark.mockReturnValueOnce(throwError(() => 'mock_error'));

        service.addBookmark(contentId).subscribe({
          error: () => {
            expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.THIS_ACTION_COULD_NOT_BE_PERFORMED');
            done();
          },
        });
      });
    });

    describe('removeBookmark', () => {
      const bookmarkId = 'mock_bookmark_id';

      it('should display a success message', (done) => {
        service.removeBookmark(bookmarkId).subscribe(() => {
          expect(missionServiceMock.removeBookmark).toHaveBeenCalledWith(bookmarkId);
          expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.BOOKMARK_REMOVED');

          done();
        });
      });

      it('should display an error message', (done) => {
        missionServiceMock.removeBookmark.mockReturnValueOnce(throwError(() => 'mock_error'));

        service.removeBookmark(bookmarkId).subscribe({
          error: () => {
            expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.BOOKMARK_REMOVED_ERROR');
            done();
          },
        });
      });
    });

    describe('redirectTo', () => {
      it('should open an integration course in a new tab with the returned access url', () => {
        window.open = jest.fn();
        const learnContentIdStub = 'learn_content_id';
        const learnContentStub = {
          isIntegration: true,
          contentId: learnContentIdStub,
          externalProvider: 'Alura',
          externalCourseUrl: 'https://external-course-url',
        } as LearnContentCardData;

        service.redirectTo({ learnContent: learnContentStub, contentType: 'mission', action: 'continue' });

        expect(aluraIntegrationApiMock.getAccessUrlByMissionId).toHaveBeenCalledWith(learnContentIdStub);
        expect(window.open).toHaveBeenCalledWith(accessUrlStub, '_blank');
      });
    });
  });
});
