import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, provideRouter, UrlTree } from '@angular/router';
import { serviceActive } from './service-active.guard';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Chance } from 'chance';

describe('serviceActive Guard', () => {
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  const chance = new Chance();

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => serviceActive(...guardParameters));

  beforeEach(() => {
    workspaceServiceMock = { isServiceActive: jest.fn() } as unknown as jest.Mocked<WorkspaceService>;

    TestBed.configureTestingModule({
      providers: [{ provide: WorkspaceService, useValue: workspaceServiceMock }, provideRouter([])],
    });
  });

  it('should allow access when the corresponding route service is active in the workspace', () => {
    workspaceServiceMock.isServiceActive.mockReturnValue(true);
    const serviceId = chance.guid();
    const routeSnapshot = { data: { serviceId } } as unknown as ActivatedRouteSnapshot;

    expect(executeGuard(routeSnapshot, null)).toBe(true);
    expect(workspaceServiceMock.isServiceActive).toHaveBeenCalledWith(serviceId);
  });

  it('should return an URL that redirects to the initial route when the service is not active', () => {
    workspaceServiceMock.isServiceActive.mockReturnValue(false);
    const serviceId = chance.guid();
    const routeSnapshot = { data: { serviceId } } as unknown as ActivatedRouteSnapshot;

    const result = executeGuard(routeSnapshot, null) as UrlTree;

    expect(result.toString()).toBe('/404');
    expect(workspaceServiceMock.isServiceActive).toHaveBeenCalledWith(serviceId);
  });

  it('should allow access when the route does not have an service id associated', () => {
    const routeSnapshot = { data: { anotherData: '' } } as unknown as ActivatedRouteSnapshot;

    expect(executeGuard(routeSnapshot, null)).toBe(true);
  });
});
