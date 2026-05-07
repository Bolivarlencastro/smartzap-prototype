import { ContributorsDialogService } from './contributors-dialog.service';
import { EMPTY, of } from 'rxjs';
import { KonquestAPI } from '@core/api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MatDialog } from '@angular/material/dialog';
import { ContributorsDialogContentType } from 'app/shared/components/contributors-dialog/models/contributors-dialog-content.type';

describe('ContributorsDialogService', () => {
  let service: ContributorsDialogService;
  let dialogMock: jest.Mocked<MatDialog>;
  let httpMock: jest.Mocked<KonquestAPI>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    dialogMock = { open: jest.fn(() => of(EMPTY)) } as unknown as jest.Mocked<MatDialog>;
    httpMock = {
      get: jest.fn(() => of(EMPTY)),
      post: jest.fn(() => of(EMPTY)),
      delete: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<KonquestAPI>;
    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    service = new ContributorsDialogService(dialogMock, httpMock, messageServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadContributors', () => {
    it('should load the contributors for a mission', (done) => {
      const mockMissionId = 'mock_id';

      service.loadContributors(ContributorsDialogContentType.MISSION, mockMissionId).subscribe(() => {
        expect(httpMock.get).toHaveBeenCalledWith('/missions/mock_id/contributors');
        done();
      });
    });

    it('should load the contributors for a channel', (done) => {
      const mockMissionId = 'mock_id';

      service.loadContributors(ContributorsDialogContentType.CHANNEL, mockMissionId).subscribe(() => {
        expect(httpMock.get).toHaveBeenCalledWith('/channels/mock_id/contributors');
        done();
      });
    });
  });

  describe('addContributors', () => {
    it('should add a contributor for a mission', (done) => {
      const mockMissionId = 'mock_id';
      const mockUserId = 'mock_user_id';

      service.addContributors(ContributorsDialogContentType.MISSION, mockMissionId, mockUserId).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/missions/mock_id/contributors/mock_user_id', {});
        done();
      });
    });

    it('should add a contributor for a channel', (done) => {
      const mockMissionId = 'mock_id';
      const mockUserId = 'mock_user_id';

      service.addContributors(ContributorsDialogContentType.CHANNEL, mockMissionId, mockUserId).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith('/channels/mock_id/contributors/mock_user_id', {});
        done();
      });
    });
  });

  describe('deleteContributor', () => {
    it('should delete a contributor for a mission', (done) => {
      const mockMissionId = 'mock_id';
      const mockUserId = 'mock_user_id';

      service.deleteContributor(ContributorsDialogContentType.MISSION, mockMissionId, mockUserId).subscribe(() => {
        expect(httpMock.delete).toHaveBeenCalledWith('/missions/mock_id/contributors/mock_user_id');
        done();
      });
    });

    it('should delete a contributor for a channel', (done) => {
      const mockMissionId = 'mock_id';
      const mockUserId = 'mock_user_id';

      service.deleteContributor(ContributorsDialogContentType.CHANNEL, mockMissionId, mockUserId).subscribe(() => {
        expect(httpMock.delete).toHaveBeenCalledWith('/channels/mock_id/contributors/mock_user_id');
        done();
      });
    });
  });
});
