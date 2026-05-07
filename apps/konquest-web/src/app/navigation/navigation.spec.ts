import { setHomeRoute, updateInitialRouteConfig } from './navigation';
import { environment } from 'environments/environment';
import { Service } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Route, Router } from '@angular/router';

jest.mock('environments/environment', () => {
  const originalModule = jest.requireActual('environments/environment');
  return {
    environment: { ...originalModule.environment, routeHome: '' },
  };
});

describe('navigation utilities', () => {
  const konquestServices = environment.apps.konquest.services;

  beforeEach(() => {
    environment.routeHome = '';
  });

  describe('setHomeRoute', () => {
    it('should set routeHome to "home" when custom sections is an active service', () => {
      setHomeRoute([{ id: '8d572fd1-cca9-4979-9e72-f3871ac8ee97', name: 'Custom Sections' } as Service]);

      expect(environment.routeHome).toBe('home');
    });

    it('should set routeHome to dashboard when Dashboard service is active', () => {
      const services = [konquestServices.mission, konquestServices.dashboard] as Service[];

      setHomeRoute(services);

      expect(environment.routeHome).toBe('dashboard');
    });

    it('should set routeHome to missions when Dashboard is absent but Mission is active', () => {
      const services = [konquestServices.mission, konquestServices.pulse] as Service[];

      setHomeRoute(services);

      expect(environment.routeHome).toBe('missions');
    });

    it('should set routeHome to the trails if neither dashboard or missions is active', () => {
      const services = [konquestServices.learning_trail, konquestServices.pulse] as Service[];

      setHomeRoute(services);

      expect(environment.routeHome).toBe('learning-trails');
    });

    it('should fallback to home when the service is not known', () => {
      const services = [{ name: 'Invalid Service' }] as Service[];

      setHomeRoute(services);

      expect(environment.routeHome).toBe('home');
    });

    it('should fallback to home when services is an empty array', () => {
      setHomeRoute([]);

      expect(environment.routeHome).toBe('home');
    });
  });

  describe('updateInitialRouteConfig', () => {
    let mockRouter: jest.Mocked<Router>;
    const missionsRoute = { path: 'missions', component: {} as any };
    let emptyRoute: Route = { path: '', redirectTo: 'missions' };
    let wildCardRoute: Route = { path: '**', redirectTo: 'missions' };
    let routes: Route[];

    beforeEach(() => {
      emptyRoute = { path: '', redirectTo: 'missions' };
      wildCardRoute = { path: '**', redirectTo: 'missions' };
      routes = [missionsRoute, emptyRoute, wildCardRoute];

      mockRouter = {
        config: routes,
        resetConfig: jest.fn(),
      } as unknown as jest.Mocked<Router>;
    });

    it('should update both wildcard and empty path redirectTo and reset the config', () => {
      updateInitialRouteConfig('new-home', mockRouter);

      expect(mockRouter.resetConfig).toHaveBeenCalled();

      expect(emptyRoute.redirectTo).toBe('new-home');
      expect(wildCardRoute.redirectTo).toBe('new-home');
    });
  });
});
