import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Navigation, NavigationStart, Router } from '@angular/router';
import { CONTENT_MANAGEMENT_ROUTES } from '@app/main/content-management/management-routes-definition';
import { KeepsPathLocationStrategy, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Store } from '@ngrx/store';
import { MissionDetailActions } from 'app/main/mission/pages/mission-detail-v2/store';
import { of, Subject } from 'rxjs';
import * as PulseDetailsActions from 'app/main/pulses-feed/store/pulse-details/pulse-details.actions';
import {
  navigateToEvent,
  navigateToMission,
  navigateToPulse,
  navigateToTrail,
  PULSES_DETAIL_PREFIX,
  REDIRECT_TO_CREATION_PARAM,
  RouteDialogService,
} from './route-dialog.service';
import { signal, Signal } from '@angular/core';

describe('RouteDialogService', () => {
  let service: RouteDialogService;
  let routerMock: jest.Mocked<Router>;
  let storeMock: jest.Mocked<Store>;
  let locationMock: jest.Mocked<Location>;
  let eventsSubject: Subject<NavigationStart>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let locationStrategyMock: jest.Mocked<KeepsPathLocationStrategy>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let lastSuccessfulNavigationSignal: Signal<Navigation | null>;

  beforeEach(async () => {
    eventsSubject = new Subject<NavigationStart>();
    lastSuccessfulNavigationSignal = signal(null);
    routerMock = {
      events: eventsSubject.asObservable(),
      navigateByUrl: jest.fn(),
      lastSuccessfulNavigation: lastSuccessfulNavigationSignal,
    } as unknown as jest.Mocked<Router>;

    storeMock = { dispatch: jest.fn() } as unknown as jest.Mocked<Store>;
    locationMock = { go: jest.fn(), path: jest.fn(() => '') } as unknown as jest.Mocked<Location>;
    workspaceServiceMock = {
      isWorkspaceAvailable: jest.fn().mockReturnValue(true),
      workspaceServices$: of([]),
      isServiceActive: jest.fn().mockReturnValue(false),
    } as unknown as jest.Mocked<WorkspaceService>;
    locationStrategyMock = {
      getHashFromUrl: jest.fn().mockReturnValue('mock_hash'),
    } as unknown as jest.Mocked<KeepsPathLocationStrategy>;
    messageServiceMock = { error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    await TestBed.configureTestingModule({
      providers: [
        RouteDialogService,
        { provide: Router, useValue: routerMock },
        { provide: Store, useValue: storeMock },
        { provide: Location, useValue: locationMock },
        { provide: KeepsPathLocationStrategy, useValue: locationStrategyMock },
        { provide: WorkspaceService, useValue: workspaceServiceMock },
        { provide: KpMessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    service = TestBed.inject(RouteDialogService);
    service.init();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onNavigationEvent', () => {
    it('should emit the related store action', () => {
      eventsSubject.next(new NavigationStart(1, '/C/mock_id'));

      expect(storeMock.dispatch).toHaveBeenCalledWith(
        MissionDetailActions.openMissionDetails({ missionId: 'mock_id' }),
      );
    });

    it('should update the address bar with the event url when it matches an existing configuration', () => {
      eventsSubject.next(new NavigationStart(1, '/C/mock_id'));

      expect(locationMock.go).toHaveBeenCalledWith('/C/mock_id');
    });

    it('should call navigateByUrl on the router to cancel the navigation event that triggered the dialog opening with the last successful navigation url', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/dashboard' });

      eventsSubject.next(new NavigationStart(1, '/C/mock_id'));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard', { skipLocationChange: true });
    });

    it('should call navigateByUrl on the router to cancel the navigation event that triggered the dialog opening with the initial url on a popstate event', () => {
      eventsSubject.next(new NavigationStart(1, '/C/mock_id'));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('missions', { skipLocationChange: true });
    });

    it('should use the default configuration url if there is no prior successful navigation url', () => {
      eventsSubject.next(new NavigationStart(1, '/C/mock_id'));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('missions', { skipLocationChange: true });
    });

    it('should use the default configuration url when the redirect param is present', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/mission-create' });

      eventsSubject.next(new NavigationStart(1, '/C/mock_id?rti=true'));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('missions', { skipLocationChange: true });
    });

    it('should redirect to creation route when redirectToCreation param is present', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/dashboard' });

      const coursesCreationRoute = `management/${CONTENT_MANAGEMENT_ROUTES.courses.path}`;
      eventsSubject.next(new NavigationStart(1, `/C/mock_id${REDIRECT_TO_CREATION_PARAM}`));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(coursesCreationRoute, { skipLocationChange: true });
    });

    it('should redirect to events creation route when redirectToCreation param is present for events', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/dashboard' });

      const eventsCreationRoute = `management/${CONTENT_MANAGEMENT_ROUTES.events.path}`;
      eventsSubject.next(new NavigationStart(1, `/E/mock_id${REDIRECT_TO_CREATION_PARAM}`));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(eventsCreationRoute, { skipLocationChange: true });
    });

    it('should redirect to trails creation route when redirectToCreation param is present for trails', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/dashboard' });

      const trailsCreationRoute = `management/${CONTENT_MANAGEMENT_ROUTES.trails.path}`;
      eventsSubject.next(new NavigationStart(1, `/T/mock_id${REDIRECT_TO_CREATION_PARAM}`));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(trailsCreationRoute, { skipLocationChange: true });
    });

    it('should prioritize redirectToInitial over redirectToCreation when both are theoretically present', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/dashboard' });

      eventsSubject.next(new NavigationStart(1, `/C/mock_id?rti=true&rtc=true`));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('missions', { skipLocationChange: true });
    });

    it('should use the current trail id as rollback param if opening a mission dialog from a trail, even if the current path is not clean', () => {
      eventsSubject.next(new NavigationStart(1, '/T/trail_mock_id'));

      expect(locationMock.go).toHaveBeenCalledWith('/T/trail_mock_id');
      locationMock.path.mockReturnValueOnce('workspace_identifier/T/trail_mock_id');
      locationMock.go.mockClear();

      eventsSubject.next(new NavigationStart(1, '/C/mission_mock_id'));

      expect(storeMock.dispatch).toHaveBeenCalledWith(
        MissionDetailActions.openMissionDetails({ missionId: 'mission_mock_id', rollbackTrailId: 'trail_mock_id' }),
      );
    });

    it('should emit the openPulseDetails action when navigating to a pulse url', () => {
      eventsSubject.next(new NavigationStart(1, '/P/pulse_mock_id'));

      expect(storeMock.dispatch).toHaveBeenCalledWith(
        PulseDetailsActions.openPulseDetails({ pulseId: 'pulse_mock_id' }),
      );
    });

    it('should update the address bar with the pulse event url', () => {
      eventsSubject.next(new NavigationStart(1, '/P/pulse_mock_id'));

      expect(locationMock.go).toHaveBeenCalledWith('/P/pulse_mock_id');
    });

    it('should navigate back to pulses-feed when no prior navigation exists for a pulse url', () => {
      eventsSubject.next(new NavigationStart(1, '/P/pulse_mock_id'));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('pulses-feed', { skipLocationChange: true });
    });

    it('should not open the details dialog if the workspace from the url hash is not available for the user', () => {
      workspaceServiceMock.isWorkspaceAvailable.mockReturnValueOnce(false);
      eventsSubject.next(new NavigationStart(1, '/T/trail_mock_id'));

      expect(locationMock.go).not.toHaveBeenCalled();
      expect(messageServiceMock.error).toHaveBeenCalledWith('GENERAL.UNAVAILABLE_WORKSPACE');
    });
  });

  describe('setCancelNavigationUrl', () => {
    it('should set cancelNavigationUrl to creationRoute when redirectToCreation is true', () => {
      const mockEvent = new NavigationStart(1, `/C/mock_id${REDIRECT_TO_CREATION_PARAM}`);

      const redirectToCreation = mockEvent.url.includes(REDIRECT_TO_CREATION_PARAM);

      expect(redirectToCreation).toBe(true);
    });

    it('should not treat popstate events as redirectToCreation', () => {
      const mockEvent = new NavigationStart(1, `/C/mock_id`, 'popstate');

      const hasRtcParam = mockEvent.url.includes(REDIRECT_TO_CREATION_PARAM);
      const isPopstate = mockEvent.navigationTrigger === 'popstate';

      expect(hasRtcParam && isPopstate).toBe(false);
    });
  });

  describe('onDialogClosed', () => {
    it('should update the address bar with the last successful navigation url', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/dashboard' });

      eventsSubject.next(new NavigationStart(1, '/C/mock_id'));
      service.onDialogClosed();

      expect(locationMock.go).toHaveBeenCalledWith('/dashboard');
    });

    it('should not update the address bar when a navigation event occurs to a new url and a dialog is already open', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/dashboard' });
      eventsSubject.next(new NavigationStart(1, '/C/mock_id'));

      expect(locationMock.go).toHaveBeenCalledWith('/C/mock_id');
      locationMock.path.mockReturnValueOnce('/C/mock_id');
      locationMock.go.mockClear();

      eventsSubject.next(new NavigationStart(1, '/edit/mock_id'));

      service.onDialogClosed();
      expect(locationMock.go).not.toHaveBeenCalled();
    });

    it('should update the address bar with and navigate to the last successful navigation url when opened via popstate event', () => {
      lastSuccessfulNavigationSignal.set({ finalUrl: '/dashboard' });

      eventsSubject.next(new NavigationStart(1, '/C/mock_id'));
      locationMock.path.mockReturnValueOnce('/C/mock_id');

      service.onDialogClosed();
      eventsSubject.next(new NavigationStart(2, '/edit/mock_id'));
      eventsSubject.next(new NavigationStart(1, '/C/mock_id', 'popstate'));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard', { skipLocationChange: true });
      locationMock.go.mockClear();

      service.onDialogClosed();
      expect(locationMock.go).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('redirect functions', () => {
    let routerMock: jest.Mocked<Router>;

    beforeEach(() => {
      routerMock = { navigateByUrl: jest.fn() } as unknown as jest.Mocked<Router>;
    });

    describe('navigateToMission', () => {
      it('should navigate to a mission dialog', () => {
        navigateToMission(routerMock, 'mock_id');

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/C/mock_id');
      });

      it('should navigate to a mission dialog with redirectToInitial param', () => {
        navigateToMission(routerMock, 'mock_id', true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/C/mock_id?rti=true');
      });

      it('should navigate to a mission dialog with redirectToCreation param', () => {
        navigateToMission(routerMock, 'mock_id', false, true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`/C/mock_id${REDIRECT_TO_CREATION_PARAM}`);
      });

      it('should prioritize redirectToInitial when both redirect params are true', () => {
        navigateToMission(routerMock, 'mock_id', true, true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/C/mock_id?rti=true');
      });
    });

    describe('navigateToEvent', () => {
      it('should navigate to an event dialog with redirectToCreation param', () => {
        navigateToEvent(routerMock, 'mock_id', false, true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`/E/mock_id${REDIRECT_TO_CREATION_PARAM}`);
      });
    });

    describe('navigateToTrail', () => {
      it('should navigate to a trail dialog', () => {
        navigateToTrail(routerMock, 'mock_id');

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/T/mock_id');
      });

      it('should navigate to a trail dialog with redirectToInitial param', () => {
        navigateToTrail(routerMock, 'mock_id', true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/T/mock_id?rti=true');
      });

      it('should navigate to a trail dialog with redirectToCreation param', () => {
        navigateToTrail(routerMock, 'mock_id', false, true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`/T/mock_id${REDIRECT_TO_CREATION_PARAM}`);
      });
    });

    describe('navigateToPulse', () => {
      it('should navigate to a pulse dialog', () => {
        navigateToPulse(routerMock, 'mock_id');

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`${PULSES_DETAIL_PREFIX}/mock_id`);
      });

      it('should navigate to a pulse dialog with redirectToInitial param', () => {
        navigateToPulse(routerMock, 'mock_id', true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`${PULSES_DETAIL_PREFIX}/mock_id?rti=true`);
      });

      it('should navigate to a pulse dialog with redirectToCreation param', () => {
        navigateToPulse(routerMock, 'mock_id', false, true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
          `${PULSES_DETAIL_PREFIX}/mock_id${REDIRECT_TO_CREATION_PARAM}`,
        );
      });

      it('should prioritize redirectToInitial when both redirect params are true', () => {
        navigateToPulse(routerMock, 'mock_id', true, true);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`${PULSES_DETAIL_PREFIX}/mock_id?rti=true`);
      });
    });
  });

  describe('dialogConfigurations', () => {
    it('should have correct creation routes for each content type', () => {
      const router = { navigateByUrl: jest.fn() } as any;

      navigateToMission(router, 'test', false, true);
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/C/test${REDIRECT_TO_CREATION_PARAM}`);

      navigateToEvent(router, 'test', false, true);
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/E/test${REDIRECT_TO_CREATION_PARAM}`);

      navigateToTrail(router, 'test', false, true);
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/T/test${REDIRECT_TO_CREATION_PARAM}`);

      navigateToPulse(router, 'test', false, true);
      expect(router.navigateByUrl).toHaveBeenCalledWith(`${PULSES_DETAIL_PREFIX}/test${REDIRECT_TO_CREATION_PARAM}`);
    });

    it('should fall back to pulses-feed as the initial route for pulse dialogs', () => {
      eventsSubject.next(new NavigationStart(1, '/P/pulse_mock_id'));

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('pulses-feed', { skipLocationChange: true });
    });
  });
});
