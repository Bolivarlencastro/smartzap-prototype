import { Injectable, Signal } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { MissionDetailActions } from 'app/main/mission/pages/mission-detail-v2/store';
import { Store } from '@ngrx/store';
import * as LearningTrailDetailActions from 'app/main/learning-trail/pages/detail/store/learning-trail-detail.actions';
import * as PulseDetailsActions from 'app/main/pulses-feed/store/pulse-details/pulse-details.actions';
import { KeepsPathLocationStrategy, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from 'environments/environment';
import { CONTENT_MANAGEMENT_ROUTES } from '@app/main/content-management/management-routes-definition';

export const MISSIONS_DETAIL_PREFIX = '/C';
export const EVENTS_DETAIL_PREFIX = '/E';
export const TRAILS_DETAIL_PREFIX = '/T';
export const PULSES_DETAIL_PREFIX = '/P';
export const REDIRECT_TO_INITIAL_PARAM = '?rti=true';
export const REDIRECT_TO_CREATION_PARAM = '?rtc=true';

export type DetailDialogConfig = {
  /**
   * The route prefix to match when a navigation event occurs and a dialog should be opened
   */
  prefix: string;
  /**
   * The default route to navigate to when a dialog is opened on the first application load
   */
  initialRoute: string;
  /**
   * The default route for creating learn content
   */
  creationRoute: string;
  /**
   * Function that dispatches the action to open the detail dialog
   */
  dispatchAction: (store: Store, contentId: string, rollbackPath?: string) => void;
};

function redirectToDialog(
  router: Router,
  contentId: string,
  contentPrefix: string,
  redirectToInitial = false,
  redirectToCreation = false,
) {
  let url = `${contentPrefix}/${contentId}`;

  if (redirectToInitial) {
    url = url.concat(REDIRECT_TO_INITIAL_PARAM);
  } else if (redirectToCreation) {
    url = url.concat(REDIRECT_TO_CREATION_PARAM);
  }

  return router.navigateByUrl(url);
}

export function navigateToMission(
  router: Router,
  missionId: string,
  redirectToInitial = false,
  redirectToCreation = false,
) {
  return redirectToDialog(router, missionId, MISSIONS_DETAIL_PREFIX, redirectToInitial, redirectToCreation);
}

export function navigateToEvent(
  router: Router,
  eventId: string,
  redirectToInitial = false,
  redirectToCreation = false,
) {
  return redirectToDialog(router, eventId, EVENTS_DETAIL_PREFIX, redirectToInitial, redirectToCreation);
}

export function navigateToTrail(
  router: Router,
  trailId: string,
  redirectToInitial = false,
  redirectToCreation = false,
) {
  return redirectToDialog(router, trailId, TRAILS_DETAIL_PREFIX, redirectToInitial, redirectToCreation);
}

export function navigateToPulse(
  router: Router,
  pulseId: string,
  redirectToInitial = false,
  redirectToCreation = false,
) {
  return redirectToDialog(router, pulseId, PULSES_DETAIL_PREFIX, redirectToInitial, redirectToCreation);
}

const dialogConfigurations = (customSectionsVisible: boolean): DetailDialogConfig[] => [
  {
    prefix: MISSIONS_DETAIL_PREFIX,
    initialRoute: customSectionsVisible ? 'home?filter=courses' : 'missions',
    creationRoute: `management/${CONTENT_MANAGEMENT_ROUTES.courses.path}`,
    dispatchAction: (store: Store, contentId: string, rollbackId) => {
      store.dispatch(MissionDetailActions.openMissionDetails({ missionId: contentId, rollbackTrailId: rollbackId }));
    },
  },
  {
    prefix: EVENTS_DETAIL_PREFIX,
    initialRoute: customSectionsVisible ? 'home?filter=events' : 'events',
    creationRoute: `management/${CONTENT_MANAGEMENT_ROUTES.events.path}`,
    dispatchAction: (store: Store, contentId: string, rollbackId) => {
      store.dispatch(MissionDetailActions.openMissionDetails({ missionId: contentId, rollbackTrailId: rollbackId }));
    },
  },
  {
    prefix: TRAILS_DETAIL_PREFIX,
    initialRoute: customSectionsVisible ? 'home?filter=learning-trails' : 'learning-trails',
    creationRoute: `management/${CONTENT_MANAGEMENT_ROUTES.trails.path}`,
    dispatchAction: (store: Store, contentId: string) => {
      store.dispatch(LearningTrailDetailActions.loadLearningTrail({ trailId: contentId }));
    },
  },
  {
    prefix: PULSES_DETAIL_PREFIX,
    initialRoute: 'pulses-feed',
    creationRoute: 'pulses-feed',
    dispatchAction: (store: Store, contentId: string, rollbackId?: string) => {
      store.dispatch(PulseDetailsActions.openPulseDetails({ pulseId: contentId, rollbackTrailId: rollbackId }));
    },
  },
];

@Injectable({ providedIn: 'root' })
export class RouteDialogService {
  private cancelNavigationUrl: string | undefined;
  private skipCloseCounter = 0;
  private dialogOpen = false;
  private customSectionsVisible: Signal<boolean>;

  constructor(
    private router: Router,
    private store: Store,
    private location: Location,
    private locationStrategy: KeepsPathLocationStrategy,
    private workspaceService: WorkspaceService,
    private messageService: KpMessageService,
  ) {
    this.customSectionsVisible = toSignal(
      this.workspaceService.workspaceServices$.pipe(
        map(() => this.workspaceService.isServiceActive(environment.apps.konquest.services.customSections.id)),
      ),
    );
  }

  init(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        filter((event: NavigationStart) => this.shouldHandleEvent(event)),
        filter(() => this.availableWorkspace()),
        tap((event: NavigationStart) => this.setSkipNextRouteRestore(event)),
        map((event) => ({
          event,
          configuration: this.getDialogConfig(event.url),
        })),
        filter(({ configuration }) => !!configuration),
        tap(({ event, configuration }) => this.openDialogFromConfiguration(configuration, event)),
      )
      .subscribe();
  }

  private setSkipNextRouteRestore(event: NavigationStart) {
    const hasDialogOpen = this.dialogOpen;
    const eventWillOpenDialog = this.willOpenDialog(event);
    const popStateEvent = event.navigationTrigger === 'popstate';
    const isInitialNavigation = !this.router.lastSuccessfulNavigation();

    if (isInitialNavigation || popStateEvent) {
      return;
    }

    const shouldSkip = (hasDialogOpen && !eventWillOpenDialog) || (hasDialogOpen && eventWillOpenDialog);

    if (shouldSkip) {
      this.skipCloseCounter++;
    }
  }

  private openDialogFromConfiguration(dialogConfiguration: DetailDialogConfig, event: NavigationStart) {
    const eventUrl = event.url;
    let rollbackId: string;

    if (this.dialogOpen) {
      rollbackId = this.getContentId(this.location.path());
    }

    this.setCancelNavigationUrl(dialogConfiguration, event, this.dialogOpen);
    this.updateAddressBarUrl(eventUrl);
    this.executeOpenAction(dialogConfiguration, event, rollbackId);
    this.cancelDialogOpenNavigationEvent();
    this.dialogOpen = true;
  }

  private executeOpenAction(configuration: DetailDialogConfig, event: NavigationStart, rollbackPath?: string) {
    const contentId = this.getContentId(event.url);
    configuration.dispatchAction(this.store, contentId, rollbackPath);
  }

  private setCancelNavigationUrl(dialogConfig: DetailDialogConfig, event: NavigationStart, dialogOpen: boolean) {
    const redirectToInitial = event.url.includes(REDIRECT_TO_INITIAL_PARAM) || event.navigationTrigger === 'popstate';
    const redirectToCreation = event.url.includes(REDIRECT_TO_CREATION_PARAM) || event.navigationTrigger === 'popstate';
    const lastSuccessfulNavigation = this.router.lastSuccessfulNavigation()?.finalUrl.toString();

    if (!dialogOpen && (!lastSuccessfulNavigation || redirectToInitial)) {
      this.cancelNavigationUrl = dialogConfig.initialRoute;
      return;
    }

    if (redirectToCreation) {
      this.cancelNavigationUrl = dialogConfig.creationRoute;
      return;
    }

    this.cancelNavigationUrl = lastSuccessfulNavigation;
  }

  private cancelDialogOpenNavigationEvent() {
    this.router.navigateByUrl(this.cancelNavigationUrl, { skipLocationChange: true });
  }

  private updateAddressBarUrl(url: string): void {
    this.location.go(url);
  }

  private getDialogConfig(url: string): DetailDialogConfig | undefined {
    return dialogConfigurations(this.customSectionsVisible()).find((configuration) =>
      url.startsWith(`${configuration.prefix}/`),
    );
  }

  private getContentId(url: string): string {
    return url.replace(/^(\S*)\/[TCEP]\//m, '');
  }

  private willOpenDialog(event: NavigationStart) {
    return dialogConfigurations(this.customSectionsVisible()).some((configuration) =>
      event.url.startsWith(`${configuration.prefix}/`),
    );
  }

  private shouldHandleEvent(event: NavigationStart) {
    const dialogOpened = this.dialogOpen;
    const willOpenDialog = this.willOpenDialog(event);
    return dialogOpened || willOpenDialog;
  }

  /**
   * Call this function to restore the url on the address bar to what it was before a dialog was opened, the restoration
   * will not occur when navigating to a new route.
   */
  public onDialogClosed() {
    this.dialogOpen = false;

    if (this.skipCloseCounter === 0) {
      this.location.go(this.router.lastSuccessfulNavigation()?.finalUrl.toString());
      this.cancelNavigationUrl = undefined;
    }

    this.skipCloseCounter = Math.max(this.skipCloseCounter - 1, 0);
  }

  private availableWorkspace(): boolean {
    const urlHash = this.locationStrategy.getHashFromUrl();
    if (!urlHash) {
      return false;
    }
    const workspaceIsAvailable = this.workspaceService.isWorkspaceAvailable(urlHash);
    if (!workspaceIsAvailable) {
      this.messageService.error(marker('GENERAL.UNAVAILABLE_WORKSPACE'));
    }
    return workspaceIsAvailable;
  }
}
