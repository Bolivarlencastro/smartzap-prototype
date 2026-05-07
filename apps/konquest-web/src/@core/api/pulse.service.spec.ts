import { PulseAPI } from './pulse.api';
import { PulseService } from './pulse.service';
import { KonquestAPI } from '@core/api/base';
import { LearnContentService } from './learn-content.service';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('PulseService', () => {
  let service: PulseService;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let pulseApiMock: jest.Mocked<PulseAPI>;
  let learnContentServiceMock: jest.Mocked<LearnContentService>;
  let authServiceMock: jest.Mocked<AuthService>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    konquestApiMock = {} as jest.Mocked<KonquestAPI>;
    pulseApiMock = { deletePulse: jest.fn().mockReturnValue(of(EMPTY)) } as unknown as jest.Mocked<PulseAPI>;
    authServiceMock = {} as jest.Mocked<AuthService>;
    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    routerMock = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    service = new PulseService(
      konquestApiMock,
      pulseApiMock,
      learnContentServiceMock,
      authServiceMock,
      messageServiceMock,
      routerMock,
    );
  });

  describe('deletePulse', () => {
    it('should display a success message', (done) => {
      service.removePulse('mockId').subscribe(() => {
        expect(pulseApiMock.deletePulse).toHaveBeenCalledWith('mockId');
        expect(messageServiceMock.success).toHaveBeenCalledWith('QUIZ.CONTENT.REMOVE_QUIZ_SUCCESS');

        done();
      });
    });

    it('should display an error message on failure', (done) => {
      pulseApiMock.deletePulse.mockReturnValueOnce(throwError(() => 'Mock error'));

      service.removePulse('mockId').subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('QUIZ.CONTENT.REMOVE_QUIZ_ERROR');
          done();
        },
      });
    });
  });
});
