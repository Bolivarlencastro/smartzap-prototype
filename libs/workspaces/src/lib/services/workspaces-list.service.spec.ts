import { Router } from '@angular/router';
import {
  CoreConfig,
  WorkspaceApi,
  WorkspaceBasicDto,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { WorkspacesConfig } from '../workspaces.module';

import { WorkspacesListService } from './workspaces-list.service';

const mockWorkspaceConfig: WorkspacesConfig = {
  environment: { routeHome: 'mockHomeRoute' },
  logoUrl: 'mock_logo_url',
  isMyAccount: true,
};

const mockCoreConfig = {
  appId: 'mock_app_id',
} as CoreConfig;

const mockWorkspace = { id: 'test', name: 'test_workspace', logo_url: 'test_logo' } as WorkspaceBasicDto;

describe('WorkspacesListService', () => {
  let service: WorkspacesListService;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let workspaceApiMock: jest.Mocked<WorkspaceApi>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    workspaceServiceMock = { setCurrentWorkspace: jest.fn() } as any;
    routerMock = { navigate: jest.fn().mockResolvedValue(null) } as any;
    workspaceApiMock = { getWorkspaces: jest.fn().mockReturnValue(of(EMPTY)) } as unknown as jest.Mocked<WorkspaceApi>;
    service = new WorkspacesListService(
      workspaceServiceMock,
      workspaceApiMock,
      routerMock,
      mockWorkspaceConfig,
      mockCoreConfig,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWorkspaces', () => {
    it('should call getWorkspaces on the Applications API', (done) => {
      service.getWorkspaces().subscribe(() => {
        expect(workspaceApiMock.getWorkspaces).toHaveBeenCalledWith(null);
        done();
      });
    });

    it('should include the application as a parameter when the current application is not My Account', (done) => {
      mockWorkspaceConfig.isMyAccount = false;

      service.getWorkspaces().subscribe(() => {
        expect(workspaceApiMock.getWorkspaces).toHaveBeenCalledWith(mockCoreConfig.appId);
        mockWorkspaceConfig.isMyAccount = true;
        done();
      });
    });
  });

  describe('workspaceSelected', () => {
    it('should call setCurrentWorkspace', () => {
      service.workspaceSelected(mockWorkspace);

      expect(workspaceServiceMock.setCurrentWorkspace).toHaveBeenCalledWith(mockWorkspace);
    });
  });

  describe('navigateToHome', () => {
    it('should navigate to the homeRoute', () => {
      service.navigateToHome();

      expect(routerMock.navigate).toHaveBeenCalledWith([mockWorkspaceConfig.environment.routeHome]);
    });
  });
});
