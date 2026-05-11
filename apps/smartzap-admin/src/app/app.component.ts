import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { BillingDialogComponent } from '@core/components/billing-dialog/billing-dialog.component';
import {
  AuthService,
  CustomMenuItem,
  LanguageTypes,
  UserProfile,
  UserProfileService,
  WorkspaceService,
  WorkspaceWithServices,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { selectGetAvailableBalance, selectGetBilling } from 'app/shared/store/selectors/billing.selectors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

import { GlobalSettingsActions, UIActions } from './shared/store';
import { UISelectors } from './shared/store/selectors';
import { KpMenuApp, KpMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-menu';
import { KpNotification, KpNotificationComponent } from '@keeps-platform-frontend-workspace/ui/kp-notification';
import { toSignal } from '@angular/core/rxjs-interop';
import { globalSettingsFeature } from './shared/store/features';
import { FuseLayoutModule } from '@keeps-platform-frontend-workspace/layout';
import { KpToolbarBalanceComponent } from '@keeps-platform-frontend-workspace/ui/kp-toolbar-balance';
import { AsyncPipe } from '@angular/common';
import { UserMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-user-menu';
import { KpChatbotComponent } from '@keeps-platform-frontend-workspace/ui/kp-chatbot';
import { TranslocoPipe } from '@jsverse/transloco';
import { DevToolsOverlayComponent } from './shared/dev-tools/dev-tools-overlay.component';

@Component({
  // eslint-disable-next-line
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    FuseLayoutModule,
    KpToolbarBalanceComponent,
    KpNotificationComponent,
    KpMenuComponent,
    UserMenuComponent,
    KpChatbotComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  protected readonly isProduction = environment.production;

  // Private
  private _baseHref = new BehaviorSubject<string>('');
  private _devToolsCdkOverlay = inject(Overlay);
  private _overlayRef?: OverlayRef;
  private _unsubscribeAll: Subject<Subscription>;

  user$: Observable<UserProfile>;
  apps$: Observable<KpMenuApp[]>;
  notifications$: Observable<KpNotification[]>;
  availableBalance$: Observable<number>;
  isAdmin$: Observable<boolean>;
  baseHref$: Observable<string> = this._baseHref.asObservable();
  locale: LanguageTypes;
  currentWorkspace$: Observable<WorkspaceWithServices>;
  customMenuItems: Signal<CustomMenuItem[]>;
  hasMultipleWorkspaces: Signal<boolean>;

  /**
   * Constructor
   *
   * @param _userProfileService
   * @param _dialog
   * @param _authService
   * @param store
   * @param _workspaceService
   */
  constructor(
    private _userProfileService: UserProfileService,
    private _dialog: MatDialog,
    private _authService: AuthService,
    private store: Store,
    private _workspaceService: WorkspaceService,
  ) {
    this.store.dispatch(UIActions.appInit());

    this.availableBalance$ = this.store.select(selectGetAvailableBalance);

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    // Get user
    this.user$ = this._userProfileService.profile$;

    // Get apps
    this.apps$ = this.store.select(UISelectors.selectApplicationRoles);
    this.isAdmin$ = this._userProfileService.isAdmin$();

    this.notifications$ = this.store.select(UISelectors.selectNotifications);

    this.locale = this._userProfileService.getUserLocale();
    this.customMenuItems = toSignal(store.select(globalSettingsFeature.selectCustomMenuItems));
    this.hasMultipleWorkspaces = toSignal(store.select(globalSettingsFeature.selectHasMultipleWorkspaces));
  }

  ngOnInit(): void {
    // fetch notifications every 1 min
    timer(1000, 60000)
      .pipe(
        tap(() => this.store.dispatch(UIActions.fetchNotifications())),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe();

    this.currentWorkspace$ = this._workspaceService.currentWorkspace$.pipe(
      filter((workspace) => !!workspace),
      tap((workspace) => {
        this._baseHref.next(workspace?.hash_id);
        this.store.dispatch(GlobalSettingsActions.init({ workspaceId: workspace?.id }));
      }),
    );

    this.mountDevToolsOverlay();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this._overlayRef?.dispose();
    this._overlayRef = undefined;

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.complete();
  }

  private mountDevToolsOverlay(): void {
    if (this.isProduction || this._overlayRef) {
      return;
    }

    const overlayRef = this._devToolsCdkOverlay.create({
      hasBackdrop: false,
      panelClass: 'dev-tools-overlay-pane',
      positionStrategy: this._devToolsCdkOverlay.position().global().right('24px').bottom('24px'),
      scrollStrategy: this._devToolsCdkOverlay.scrollStrategies.noop(),
    });

    overlayRef.overlayElement.setAttribute('aria-label', 'Dev tools overlay');
    overlayRef.overlayElement.classList.add('dev-tools-overlay-root');
    overlayRef.overlayElement.parentElement?.appendChild(overlayRef.overlayElement);
    overlayRef.attach(new ComponentPortal(DevToolsOverlayComponent));
    this._overlayRef = overlayRef;
  }

  onOpenDetails(): void {
    const billing$ = this.store.select(selectGetBilling);
    this._dialog.open(BillingDialogComponent, {
      width: '900px',
      maxWidth: '90vw',
      data: billing$,
    });
  }

  logout() {
    this._authService.logout();
  }

  profile(): void {
    window.open(`${environment.apps.myAccount.url}profile`, '_blank');
  }

  onDiscardNotification(notificationId: string): void {
    this.store.dispatch(UIActions.discardNotification({ notificationId }));
  }

  onSelectNotification({ notification }): void {
    this.store.dispatch(UIActions.selectNotification({ notification }));
  }

  clearAllNotifications() {
    this.store.dispatch(UIActions.clearAllNotifications());
  }
}
