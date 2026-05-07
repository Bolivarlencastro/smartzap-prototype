import { WorkspaceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EMPTY, of, throwError } from 'rxjs';
import { MissionListingConfigService } from './mission-listing-config.service';

describe('MissionListingConfigService', () => {
  let service: MissionListingConfigService;
  let workspaceApiMock: jest.Mocked<WorkspaceApi>;
  let kpMessageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    workspaceApiMock = {
      getMissionListingConfig: jest.fn(),
      updateMissionListingConfig: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<WorkspaceApi>;

    kpMessageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    service = new MissionListingConfigService(kpMessageServiceMock, workspaceApiMock);
  });

  it('should call getMissionListingConfig', () => {
    const apiMock = jest.spyOn(workspaceApiMock, 'getMissionListingConfig');
    service.getConfig();
    expect(apiMock).toHaveBeenCalled();
  });

  describe('updateConfig', () => {
    const [config, checked, workspaceId] = [{ id: '1', enrollment_status_filter: '12' }, true, '123'];

    it('should call updateMissionListingConfig and return success', (done) => {
      const apiMock = jest.spyOn(workspaceApiMock, 'updateMissionListingConfig');
      const successMock = jest.spyOn(kpMessageServiceMock, 'success');

      service.updateConfig(config, checked, workspaceId).subscribe(() => {
        expect(apiMock).toHaveBeenCalled();
        expect(successMock).toHaveBeenCalledWith('WORKSPACE_CONFIGURATIONS.SETTINGS_UPDATED_SUCCESS');
        done();
      });
    });

    it('should call updateMissionListingConfig and return error', (done) => {
      const errorMock = jest.spyOn(kpMessageServiceMock, 'error');
      workspaceApiMock.updateMissionListingConfig.mockReturnValueOnce(throwError(() => 'Mock error'));

      service.updateConfig(config, checked, workspaceId).subscribe({
        error: () => {
          expect(errorMock).toHaveBeenCalledWith('WORKSPACE_CONFIGURATIONS.SETTINGS_UPDATED_FAILURE');
          done();
        },
      });
    });
  });
});
