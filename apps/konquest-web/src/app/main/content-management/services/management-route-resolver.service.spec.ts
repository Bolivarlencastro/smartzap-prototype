import { UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CONTENT_MANAGEMENT_ROUTES } from '../management-routes-definition';
import { ManagementRouteResolver } from './management-route-resolver.service';

describe('ManagementRouteResolver', () => {
  let service: ManagementRouteResolver;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;

  beforeEach(() => {
    workspaceServiceMock = {
      isServiceActive: jest.fn(),
    } as unknown as jest.Mocked<WorkspaceService>;

    userProfileServiceMock = {
      isContentCreator: jest.fn(),
      hasRoles: jest.fn(),
    } as unknown as jest.Mocked<UserProfileService>;

    service = new ManagementRouteResolver(workspaceServiceMock, userProfileServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRoutes', () => {
    it('should return all routes if user is content creator and all services are active', () => {
      userProfileServiceMock.isContentCreator.mockReturnValue(true);
      workspaceServiceMock.isServiceActive.mockReturnValue(true);

      const routes = service.getRoutes();

      expect(routes.length).toBe(4);
      expect(routes).toContain(CONTENT_MANAGEMENT_ROUTES.courses);
      expect(routes).toContain(CONTENT_MANAGEMENT_ROUTES.events);
      expect(routes).toContain(CONTENT_MANAGEMENT_ROUTES.trails);
      expect(routes).toContain(CONTENT_MANAGEMENT_ROUTES.channels);
    });

    it('should filter routes by service status', () => {
      userProfileServiceMock.isContentCreator.mockReturnValue(true);
      workspaceServiceMock.isServiceActive.mockImplementation((serviceId) => {
        return serviceId === CONTENT_MANAGEMENT_ROUTES.courses.serviceId;
      });

      const routes = service.getRoutes();

      expect(routes.length).toBe(1);
      expect(routes[0]).toBe(CONTENT_MANAGEMENT_ROUTES.courses);
    });

    it('should return only events route if user is NOT content creator', () => {
      userProfileServiceMock.isContentCreator.mockReturnValue(false);
      workspaceServiceMock.isServiceActive.mockReturnValue(true);

      const routes = service.getRoutes();

      expect(routes.length).toBe(1);
      expect(routes[0]).toBe(CONTENT_MANAGEMENT_ROUTES.events);
    });

    it('should return empty if user is NOT content creator and events service is inactive', () => {
      userProfileServiceMock.isContentCreator.mockReturnValue(false);
      workspaceServiceMock.isServiceActive.mockImplementation((serviceId) => {
        return serviceId !== CONTENT_MANAGEMENT_ROUTES.events.serviceId;
      });

      const routes = service.getRoutes();

      expect(routes.length).toBe(0);
    });
  });
});
