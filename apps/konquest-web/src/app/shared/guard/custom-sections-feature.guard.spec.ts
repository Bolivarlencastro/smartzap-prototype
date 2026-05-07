import { TestBed } from '@angular/core/testing';
import { CanActivateFn, UrlTree } from '@angular/router';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { customSectionsFeature } from './custom-sections-feature.guard';

describe('customSectionsFeature Guard', () => {
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => customSectionsFeature(...guardParameters));

  beforeEach(() => {
    workspaceServiceMock = {
      isServiceActive: jest.fn(),
    } as unknown as jest.Mocked<WorkspaceService>;

    TestBed.configureTestingModule({
      providers: [{ provide: WorkspaceService, useValue: workspaceServiceMock }],
    });
  });

  describe('when custom sections are active', () => {
    beforeEach(() => {
      workspaceServiceMock.isServiceActive.mockReturnValue(true);
    });

    it('should redirect to default route', () => {
      const result = executeGuard(null, null) as UrlTree;
      expect(result.toString()).toBe('/');
    });
  });

  describe('when custom sections are not active', () => {
    beforeEach(() => {
      workspaceServiceMock.isServiceActive.mockReturnValue(false);
    });

    it('should allow access', () => {
      const result = executeGuard(null, null);
      expect(result).toBe(true);
    });
  });
});
