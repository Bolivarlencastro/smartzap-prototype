import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KonquestFeaturesService } from '@app/shared/services';
import { HomeResolver } from './home.resolver';

jest.mock('../models/home', () => ({
  HIGHLIGHTS_SERVICE_ID: 'highlights-service-id',
  TRAILS_SERVICE_ID: 'trails-service-id',
  COURSES_SERVICE_ID: 'courses-service-id',
  EVENTS_SERVICE_ID: 'events-service-id',
}));

describe('HomeResolver', () => {
  let resolver: HomeResolver;
  let router: Router;
  let konquestFeaturesService: KonquestFeaturesService;

  const createServiceMock = (status: Record<string, boolean>) =>
    jest.fn((serviceId: string) => status[serviceId] || false);

  const createRoute = (queryParams = {}) => ({ queryParams }) as ActivatedRouteSnapshot;

  const createState = (url = '/home') => ({ url }) as RouterStateSnapshot;

  beforeEach(() => {
    router = { navigate: jest.fn() } as unknown as Router;
    konquestFeaturesService = { isServiceActive: jest.fn() } as unknown as KonquestFeaturesService;
    resolver = new HomeResolver(router, konquestFeaturesService);
  });

  describe('Non-home routes', () => {
    it('should not navigate if not on home route', () => {
      resolver.resolve(createRoute(), createState('/other-route'));
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Home route scenarios', () => {
    it('should not navigate if current filter is active', () => {
      konquestFeaturesService.isServiceActive = jest.fn().mockReturnValue(true);

      resolver.resolve(createRoute({ filter: 'highlights' }), createState());

      expect(router.navigate).not.toHaveBeenCalled();
      expect(konquestFeaturesService.isServiceActive).toHaveBeenCalledWith('highlights-service-id');
    });

    it('should not navigate when no services are active', () => {
      konquestFeaturesService.isServiceActive = jest.fn().mockReturnValue(false);

      resolver.resolve(createRoute(), createState());

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to first active service when no filter is provided', () => {
      const serviceStatus = {
        'highlights-service-id': false,
        'trails-service-id': true,
      };
      konquestFeaturesService.isServiceActive = createServiceMock(serviceStatus);

      resolver.resolve(createRoute(), createState());

      expect(router.navigate).toHaveBeenCalledWith(['/home'], {
        queryParams: { filter: 'learning-trails' },
        replaceUrl: true,
      });
    });

    it('should navigate to first active service when current filter is not active', () => {
      const serviceStatus = {
        'highlights-service-id': false,
        'trails-service-id': true,
      };
      konquestFeaturesService.isServiceActive = createServiceMock(serviceStatus);

      resolver.resolve(createRoute({ filter: 'highlights' }), createState());

      expect(router.navigate).toHaveBeenCalledWith(['/home'], {
        queryParams: { filter: 'learning-trails' },
        replaceUrl: true,
      });
    });
  });

  describe('Service hierarchy', () => {
    const testCases = [
      {
        name: 'highlights',
        serviceStatus: { 'highlights-service-id': true },
        expectedFilter: 'highlights',
      },
      {
        name: 'learning-trails',
        serviceStatus: {
          'highlights-service-id': false,
          'trails-service-id': true,
        },
        expectedFilter: 'learning-trails',
      },
      {
        name: 'courses',
        serviceStatus: {
          'highlights-service-id': false,
          'trails-service-id': false,
          'courses-service-id': true,
        },
        expectedFilter: 'courses',
      },
      {
        name: 'events',
        serviceStatus: {
          'highlights-service-id': false,
          'trails-service-id': false,
          'courses-service-id': false,
          'events-service-id': true,
        },
        expectedFilter: 'events',
      },
    ];

    testCases.forEach(({ name, serviceStatus, expectedFilter }) => {
      it(`should prioritize ${name} when active`, () => {
        konquestFeaturesService.isServiceActive = createServiceMock(serviceStatus);

        resolver.resolve(createRoute(), createState());

        expect(router.navigate).toHaveBeenCalledWith(['/home'], {
          queryParams: { filter: expectedFilter },
          replaceUrl: true,
        });
      });
    });
  });
});
