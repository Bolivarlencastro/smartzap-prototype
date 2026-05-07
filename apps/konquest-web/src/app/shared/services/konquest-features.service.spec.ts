import { KonquestFeaturesService } from './konquest-features.service';
import { Service, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';

const mockServices = Object.values(environment.apps.konquest.services) as Service[];

describe('KonquestFeaturesService', () => {
  let service: KonquestFeaturesService;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;

  beforeEach(() => {
    workspaceServiceMock = {
      isServiceActive: jest.fn(),
      setCurrentWorkspace: jest.fn(),
      setWorkspaceServices: jest.fn(),
      getWorkspaceServices: jest.fn().mockReturnValue(mockServices),
    } as unknown as jest.Mocked<WorkspaceService>;

    service = new KonquestFeaturesService(workspaceServiceMock);
  });

  describe('isServiceActive', () => {
    it('should call isService active in the workspace service', () => {
      service.isServiceActive(environment.apps.konquest.services.mission.id);
      expect(workspaceServiceMock.isServiceActive).toHaveBeenCalledWith(environment.apps.konquest.services.mission.id);
    });

    it('should handle cases where the workspace does not have any service active', () => {
      workspaceServiceMock.getWorkspaceServices.mockReturnValueOnce([]);
      expect(service.isServiceActive(environment.apps.konquest.services.mission.id)).toBeFalsy();
    });
  });

  describe('toggleWorkspaceServiceFeature', () => {
    it('should add the service to the workspace', () => {
      workspaceServiceMock.getWorkspaceServices.mockReturnValueOnce([]);
      service.toggleWorkspaceServiceFeature(environment.apps.konquest.services.mission.id, true);
      expect(workspaceServiceMock.setWorkspaceServices).toHaveBeenCalledWith([
        environment.apps.konquest.services.mission,
      ]);
    });

    it('should not add the service and update the workspace if it is already present', () => {
      workspaceServiceMock.getWorkspaceServices.mockReturnValueOnce([
        {
          id: 'f19a1f71-82fb-46df-ab88-bdd3700da124',
          name: 'PULSE',
        },
      ]);

      service.toggleWorkspaceServiceFeature(environment.apps.konquest.services.pulse.id, true);
      expect(workspaceServiceMock.setWorkspaceServices).not.toHaveBeenCalled();
    });

    it('should remove the service from the workspace', () => {
      service.toggleWorkspaceServiceFeature(environment.apps.konquest.services.mission.id, false);
      expect(workspaceServiceMock.setWorkspaceServices).toHaveBeenCalledWith(
        expect.not.arrayContaining([environment.apps.konquest.services.mission]),
      );
    });
  });
});
