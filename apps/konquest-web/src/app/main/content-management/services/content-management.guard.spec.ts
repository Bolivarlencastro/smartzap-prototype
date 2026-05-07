import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { CONTENT_MANAGEMENT_ROUTES } from '../management-routes-definition';
import { contentManagementGuard, getDefaultManagementRedirect } from './content-management.guard';

describe('ContentManagementGuard', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockUserProfileService: jest.Mocked<UserProfileService>;
  let mockWorkspaceService: jest.Mocked<WorkspaceService>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockRouter = {
      createUrlTree: jest.fn().mockReturnValue('url-tree'),
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockUserProfileService = {
      isContentCreator: jest.fn(),
      hasRoles: jest.fn(),
    } as unknown as jest.Mocked<UserProfileService>;

    mockWorkspaceService = {
      isServiceActive: jest.fn(),
    } as unknown as jest.Mocked<WorkspaceService>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserProfileService, useValue: mockUserProfileService },
        { provide: WorkspaceService, useValue: mockWorkspaceService },
      ],
    });
  });

  describe('contentManagementGuard', () => {
    describe('basic permission checks', () => {
      it('should redirect to home when user is not content creator nor instructor', () => {
        mockUserProfileService.isContentCreator.mockReturnValue(false);
        mockUserProfileService.hasRoles.mockReturnValue(false);
        mockState.url = '/management/courses';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe('url-tree');
        expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
      });

      it('should allow access when user is content creator', () => {
        mockUserProfileService.isContentCreator.mockReturnValue(true);
        mockUserProfileService.hasRoles.mockReturnValue(false);
        mockWorkspaceService.isServiceActive.mockReturnValue(true);
        mockState.url = '/management/courses';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe(true);
      });

      it('should allow access when user is instructor', () => {
        mockUserProfileService.isContentCreator.mockReturnValue(false);
        mockUserProfileService.hasRoles.mockReturnValue(true);
        mockWorkspaceService.isServiceActive.mockReturnValue(true);
        mockState.url = '/management/events';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe(true);
      });
    });

    describe('URL parsing and sub-route validation', () => {
      beforeEach(() => {
        mockUserProfileService.isContentCreator.mockReturnValue(true);
        mockUserProfileService.hasRoles.mockReturnValue(false);
      });

      it('should redirect to default route when accessing management root', () => {
        mockState.url = '/management';

        TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(mockRouter.createUrlTree).toHaveBeenCalled();
      });

      it('should correctly extract sub-route from URL', () => {
        mockWorkspaceService.isServiceActive.mockReturnValue(true);
        mockState.url = '/management/courses';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe(true);
      });

      it('should handle URL with trailing slash', () => {
        mockWorkspaceService.isServiceActive.mockReturnValue(true);
        mockState.url = '/management/courses/';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe(true);
      });
    });

    describe('instructor restrictions', () => {
      beforeEach(() => {
        mockUserProfileService.isContentCreator.mockReturnValue(false);
        mockUserProfileService.hasRoles.mockReturnValue(true);
        mockWorkspaceService.isServiceActive.mockReturnValue(true);
      });

      it('should allow instructor to access events', () => {
        mockState.url = '/management/events';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe(true);
      });

      it('should redirect instructor to home when trying to access courses', () => {
        mockState.url = '/management/courses';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe('url-tree');
        expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
      });

      it('should redirect instructor to home when trying to access trails', () => {
        mockState.url = '/management/trails';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe('url-tree');
        expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
      });
    });

    describe('service activation checks', () => {
      beforeEach(() => {
        mockUserProfileService.isContentCreator.mockReturnValue(true);
        mockUserProfileService.hasRoles.mockReturnValue(false);
      });

      it('should allow access when service is active', () => {
        mockWorkspaceService.isServiceActive.mockReturnValue(true);
        mockState.url = '/management/courses';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe(true);
        expect(mockWorkspaceService.isServiceActive).toHaveBeenCalledWith(CONTENT_MANAGEMENT_ROUTES.courses.serviceId);
      });

      it('should redirect to home when service is not active', () => {
        mockWorkspaceService.isServiceActive.mockReturnValue(false);
        mockState.url = '/management/courses';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe('url-tree');
        expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
      });

      it('should check correct service ID for each sub-route', () => {
        mockWorkspaceService.isServiceActive.mockReturnValue(true);

        mockState.url = '/management/courses';
        TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));
        expect(mockWorkspaceService.isServiceActive).toHaveBeenCalledWith(CONTENT_MANAGEMENT_ROUTES.courses.serviceId);

        mockState.url = '/management/events';
        TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));
        expect(mockWorkspaceService.isServiceActive).toHaveBeenCalledWith(CONTENT_MANAGEMENT_ROUTES.events.serviceId);

        mockState.url = '/management/trails';
        TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));
        expect(mockWorkspaceService.isServiceActive).toHaveBeenCalledWith(CONTENT_MANAGEMENT_ROUTES.trails.serviceId);
      });
    });

    describe('invalid sub-routes', () => {
      beforeEach(() => {
        mockUserProfileService.isContentCreator.mockReturnValue(true);
        mockUserProfileService.hasRoles.mockReturnValue(false);
      });

      it('should redirect to home for invalid sub-route', () => {
        mockState.url = '/management/invalid';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe('url-tree');
        expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
      });

      it('should handle URL with multiple invalid segments', () => {
        mockState.url = '/management/invalid/another/invalid';

        const result = TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(result).toBe('url-tree');
        expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
      });
    });

    describe('edge cases', () => {
      it('should handle empty URL', () => {
        mockUserProfileService.isContentCreator.mockReturnValue(true);
        mockState.url = '';

        TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
      });

      it('should handle URL without management segment', () => {
        mockUserProfileService.isContentCreator.mockReturnValue(true);
        mockState.url = '/some-other-route';

        TestBed.runInInjectionContext(() => contentManagementGuard(mockRoute, mockState));

        expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
      });
    });
  });

  describe('getDefaultManagementRedirect', () => {
    it('should return home when instructor and events not active', () => {
      mockUserProfileService.isContentCreator.mockReturnValue(false);
      mockUserProfileService.hasRoles.mockReturnValue(true);
      mockWorkspaceService.isServiceActive.mockReturnValue(false);

      const factory = getDefaultManagementRedirect();
      const result = TestBed.runInInjectionContext(factory);

      expect(result).toBe(environment.routeHome);
    });

    it('should return courses when content creator and courses active', () => {
      mockUserProfileService.isContentCreator.mockReturnValue(true);
      mockWorkspaceService.isServiceActive.mockReturnValue(true);

      const factory = getDefaultManagementRedirect();
      const result = TestBed.runInInjectionContext(factory);

      expect(result).toBe(CONTENT_MANAGEMENT_ROUTES.courses.path);
    });

    it('should return events when content creator, courses inactive, events active', () => {
      mockUserProfileService.isContentCreator.mockReturnValue(true);
      mockWorkspaceService.isServiceActive.mockReturnValueOnce(false).mockReturnValueOnce(true);

      const factory = getDefaultManagementRedirect();
      const result = TestBed.runInInjectionContext(factory);

      expect(result).toBe(CONTENT_MANAGEMENT_ROUTES.events.path);
    });

    it('should return trails when content creator, courses and events inactive, trails active', () => {
      mockUserProfileService.isContentCreator.mockReturnValue(true);
      mockWorkspaceService.isServiceActive
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const factory = getDefaultManagementRedirect();
      const result = TestBed.runInInjectionContext(factory);

      expect(result).toBe(CONTENT_MANAGEMENT_ROUTES.trails.path);
    });

    it('should return home when no services are active', () => {
      mockUserProfileService.isContentCreator.mockReturnValue(true);
      mockWorkspaceService.isServiceActive.mockReturnValue(false);

      const factory = getDefaultManagementRedirect();
      const result = TestBed.runInInjectionContext(factory);

      expect(result).toBe(environment.routeHome);
    });

    it('should follow hierarchy: courses > events > trails', () => {
      mockUserProfileService.isContentCreator.mockReturnValue(true);

      mockWorkspaceService.isServiceActive.mockReturnValue(true);

      const factory = getDefaultManagementRedirect();
      const result = TestBed.runInInjectionContext(factory);

      expect(result).toBe(CONTENT_MANAGEMENT_ROUTES.courses.path);
    });
  });

  describe('redirectToDefaultAvailableRoute', () => {
    it('should redirect to management sub-route when default route is not home', () => {
      mockUserProfileService.isContentCreator.mockReturnValue(true);
      mockWorkspaceService.isServiceActive.mockReturnValue(true);

      TestBed.runInInjectionContext(() => {
        mockState.url = '/management';
        return contentManagementGuard(mockRoute, mockState);
      });

      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['management', CONTENT_MANAGEMENT_ROUTES.courses.path]);
    });

    it('should redirect to home when default route is home', () => {
      mockUserProfileService.isContentCreator.mockReturnValue(false);
      mockUserProfileService.hasRoles.mockReturnValue(true);
      mockWorkspaceService.isServiceActive.mockReturnValue(false);

      TestBed.runInInjectionContext(() => {
        mockState.url = '/management';
        return contentManagementGuard(mockRoute, mockState);
      });

      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([environment.routeHome]);
    });
  });
});
