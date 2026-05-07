import { TestBed } from '@angular/core/testing';
import { CanActivateFn, CanMatchFn, UrlTree } from '@angular/router';
import { WorkspaceService } from '../services';

import { workspacesGuardActivate, workspacesGuardMatch } from './workspaces.guard';

describe('workspacesGuard', () => {
  const executeCanActivateGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => workspacesGuardActivate(...guardParameters));

  const executeCanMatchGuard: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => workspacesGuardMatch(...guardParameters));

  const workspaceServiceMock: jest.Mocked<WorkspaceService> = { workspaceSelected: jest.fn() } as any;
  const redirectRoute = '/workspaces';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WorkspaceService, useValue: workspaceServiceMock }],
    });
  });

  describe('canActivateGuard', () => {
    it('should be created', () => {
      expect(executeCanActivateGuard).toBeTruthy();
    });

    it('should allow access when workspaceSelected is true', () => {
      workspaceServiceMock.workspaceSelected.mockReturnValue(true);

      const canActivate = executeCanActivateGuard(null, { url: '' } as any);

      expect(canActivate).toBe(true);
    });

    it('should return a UrlTree with workspaces route when workspaceSelected is false', () => {
      workspaceServiceMock.workspaceSelected.mockReturnValue(false);

      const resultingUrlTree = executeCanActivateGuard(null, { url: '' } as any) as UrlTree;

      expect(resultingUrlTree.toString()).toBe(redirectRoute);
    });
  });

  describe('canMatchGuard', () => {
    it('should be created', () => {
      expect(executeCanMatchGuard).toBeTruthy();
    });

    it('should allow access when workspaceSelected is true', () => {
      workspaceServiceMock.workspaceSelected.mockReturnValue(true);

      const canMatch = executeCanMatchGuard(null, { url: '' } as any);

      expect(canMatch).toBe(true);
    });

    it('should return a UrlTree with workspaces route when workspaceSelected is false', () => {
      workspaceServiceMock.workspaceSelected.mockReturnValue(false);

      const resultingUrlTree = executeCanMatchGuard(null, { url: '' } as any) as UrlTree;

      expect(resultingUrlTree.toString()).toBe(redirectRoute);
    });
  });
});
