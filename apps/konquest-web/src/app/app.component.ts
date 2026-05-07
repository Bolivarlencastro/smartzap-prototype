import { Platform } from '@angular/cdk/platform';
import { AsyncPipe } from '@angular/common';
import { Component, DOCUMENT, HostListener, Inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/api';
import {
  AuthService,
  CustomMenuItem,
  GamificationListDto,
  LanguageTypes,
  Service,
  UiService,
  UserProfile,
  UserProfileService,
  WorkspaceService,
  WorkspaceWithServices,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMenuApp, KpMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-menu';
import {
  KpNotification,
  KpNotificationComponent,
  KpNotificationSelectEvent,
} from '@keeps-platform-frontend-workspace/ui/kp-notification';
import { BuildedStatistic } from '@keeps-platform-frontend-workspace/ui/kp-personal-score-menu';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { setHomeRoute, updateInitialRouteConfig } from 'app/navigation/navigation';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import {
  CyclesActions,
  GamificationActions,
  gamificationFeature,
  GlobalSettingsActions,
  globalSettingsFeature,
  UserProfileActions,
} from 'app/shared/store';
import { environment } from 'environments/environment';
import { GlobalSearchService } from './main/global-search/services/global-search.service';
import { KpViewerService } from './shared/components/kp-components/kp-viewers';
import * as fromNotificationActions from './shared/store/actions/notification.actions';
import * as fromNotificationSelectors from './shared/store/selectors/notification.selectors';
import { StatisticsService } from './shared/services/analytics.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { FuseLayoutModule } from '@keeps-platform-frontend-workspace/layout';
import { KpGlobalSearchTriggerComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-trigger';
import { CreateLearnContentButtonComponent } from './shared/components/create-learn-content-button/create-learn-content-button.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KpPersonalScoreComponent } from '@keeps-platform-frontend-workspace/ui/kp-personal-score';
import { UserMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-user-menu';
import { KpChatbotComponent } from '@keeps-platform-frontend-workspace/ui/kp-chatbot';
import { TranslocoPipe } from '@jsverse/transloco';

const NOTIFICATION_DEFAULT_INTERVAL = 300000;
const NOTIFICATION_START_DELAY = 120000;

@Component({
  // eslint-disable-next-line
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    FuseLayoutModule,
    KpGlobalSearchTriggerComponent,
    CreateLearnContentButtonComponent,
    KpNotificationComponent,
    MatIconButton,
    MatIcon,
    KpMenuComponent,
    KpPersonalScoreComponent,
    UserMenuComponent,
    KpChatbotComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<Subscription>;

  currentWorkspace$: Observable<WorkspaceWithServices | undefined>;
  user$: Observable<UserProfile>;
  apps$: Observable<KpMenuApp[]>;
  notifications$: Observable<KpNotification[]>;
  notificationsCount$: Observable<number>;
  baseHref$: Observable<string>;
  isGamificationActive$: Observable<boolean>;
  personalScore$: Observable<number>;
  partialRanking$: Observable<Partial<GamificationListDto>[]>;
  statistics$: Observable<BuildedStatistic[]>;
  isLoadingMenu$: Observable<boolean>;
  isMobile$: Observable<boolean>;
  customMenuItems: Signal<CustomMenuItem[]>;
  hasMultipleWorkspaces: Signal<boolean>;
  locale: LanguageTypes;
  baseHref: string;

  protected readonly featureFlags = environment.featureFlags;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _platform: Platform,
    private _analyticsService: AnalyticsService,
    private _viewerService: KpViewerService,
    private _uiService: UiService,
    private _userProfileService: UserProfileService,
    private _authService: AuthService,
    private _workspaceService: WorkspaceService,
    private _router: Router,
    private _globalSearchService: GlobalSearchService,
    private _statisticsService: StatisticsService,
    private _breakpointObserver: BreakpointObserver,
    private store: Store,
  ) {
    // Add is-mobile class to the body if the platform is mobile
    if (this._platform.ANDROID || this._platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    // Get user
    this.user$ = this._userProfileService.profile$;

    // Get apps
    this.apps$ = this._uiService.userApplications$;

    if (this.featureFlags['gamification']) {
      this.isGamificationActive$ = store.select(gamificationFeature.selectIsGamificationActive);
      this.personalScore$ = store.select(gamificationFeature.selectPersonalScore);
      this.partialRanking$ = store.select(gamificationFeature.selectPartialRanking);
      this.statistics$ = store.select(gamificationFeature.selectBuildedStatistics);
      this.isLoadingMenu$ = store.select(gamificationFeature.selectIsLoadingMenu);
    }

    this.notifications$ = this.store.select(fromNotificationSelectors.selectNotifications);
    this.notificationsCount$ = this.store.select(fromNotificationSelectors.selectCount);

    this._userProfileService.isAdmin$().subscribe((isAdmin) =>
      this.store.dispatch(
        UserProfileActions.setUserProfileData({
          isAdmin,
          isSuperAdmin: this._userProfileService.isSuperAdmin(),
        }),
      ),
    );

    this.locale = this._userProfileService.getUserLocale();
    this.customMenuItems = toSignal(store.select(globalSettingsFeature.selectCustomMenuItems));
    this.hasMultipleWorkspaces = toSignal(store.select(globalSettingsFeature.selectHasMultipleWorkspaces));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this._viewerService.activities$
      .pipe(
        switchMap((action) => this._analyticsService.registerNewActivity(action)),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe();

    this.currentWorkspace$ = this._workspaceService.currentWorkspace$.pipe(
      tap((workspace) => {
        this.store.dispatch(GlobalSettingsActions.init({ workspaceId: workspace?.id }));

        if (this.featureFlags['gamification']) {
          this.store.dispatch(GamificationActions.init());
        }

        if (this.featureFlags['normatives']) {
          this.store.dispatch(CyclesActions.fetchNormativeModule());
        }

        this.store.dispatch(fromNotificationActions.fetchNotifications());
      }),
    );

    this._workspaceService.workspaceServices$
      .pipe(
        filter((workspaceServices) => !!workspaceServices?.length),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe((workspaceServices) => this.setHomeRouteAndUpdateConfig(workspaceServices));

    this.baseHref$ = this.currentWorkspace$.pipe(
      filter((workspace) => !!workspace),
      map((workspace) => {
        this.baseHref = workspace.hash_id;
        return this.baseHref;
      }),
    );

    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));

    // Load notifications
    this.notificationStart();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this._analyticsService.onBeforeUnload();
  }

  onDiscardNotification(id: string): void {
    this.store.dispatch(fromNotificationActions.readNotification({ id }));
  }

  onSelectNotification({ notification }: KpNotificationSelectEvent): void {
    this.store.dispatch(fromNotificationActions.selectNotification({ id: notification.id }));
  }

  logout(): void {
    this._authService.logout();
  }

  profile(): void {
    this._router.navigate(['/profile']);
  }

  openGlobalSearchDialog(): void {
    this._globalSearchService.openDialog();
  }

  clearAllNotifications(): void {
    this.store.dispatch(fromNotificationActions.readAllNotifications());
  }

  loadGamificationMenu(): void {
    this.store.dispatch(GamificationActions.loadGamificationMenu());
  }

  navigateToGeneralRanking(): void {
    this._router.navigate(['gamification/rankings/general']);
  }

  openMyStatistics(): void {
    this._statisticsService.openMyStatisticsDialog();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Starts the notification capture process with a specified interval.
   *
   * This method sets up a pooling mechanism to periodically check for and capture notifications.
   * It is designed to be called once during the initialization phase of the application or
   * when the notification capture needs to be started.
   *
   * @param {number} [interval=NOTIFICATION_DEFAULT_INTERVAL] - The interval in milliseconds for the notification capture timer.
   */
  private notificationStart(interval = NOTIFICATION_DEFAULT_INTERVAL) {
    timer(NOTIFICATION_START_DELAY, interval).subscribe(() => {
      this.store.dispatch(fromNotificationActions.fetchNotifications());
    });
  }

  private setHomeRouteAndUpdateConfig(workspaceServices: Service[]) {
    setHomeRoute(structuredClone(workspaceServices));
    updateInitialRouteConfig(environment.routeHome, this._router);
  }
}
