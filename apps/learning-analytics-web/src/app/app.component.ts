import { Component, effect, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import {
  AuthService,
  CustomMenuItem,
  UiService,
  UserProfile,
  UserProfileService,
  WorkspaceService,
  WorkspaceWithServices,
} from '@keeps-platform-frontend-workspace/kp-keeps';

import { KpMenuApp, KpMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-menu';
import { environment } from 'environments/environment';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import Keycloak from 'keycloak-js';
import { Store } from '@ngrx/store';
import { GlobalSettingsActions } from './shared/store';
import { globalSettingsFeature } from './shared/store/features';
import { toSignal } from '@angular/core/rxjs-interop';
import { FuseLayoutModule } from '@keeps-platform-frontend-workspace/layout';
import { UserMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-user-menu';
import { KpChatbotComponent } from '@keeps-platform-frontend-workspace/ui/kp-chatbot';
import { AsyncPipe } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FuseLayoutModule, KpMenuComponent, UserMenuComponent, KpChatbotComponent, AsyncPipe],
})
export class AppComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<Subscription>;

  user$: Observable<UserProfile>;
  apps$: Observable<KpMenuApp[]>;
  isAdmin$: Observable<boolean>;
  currentWorkspace$!: Observable<WorkspaceWithServices | undefined>;
  baseHref$: Observable<string>;
  customMenuItems: Signal<CustomMenuItem[]>;
  hasMultipleWorkspaces: Signal<boolean>;

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor(
    private readonly _authService: AuthService,
    private readonly _userProfile: UserProfileService,
    private readonly _uiService: UiService,
    private readonly _workspaceService: WorkspaceService,
    private readonly store: Store,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      if (keycloakEvent.type === KeycloakEventType.TokenExpired) {
        this.keycloak.updateToken(20).then();
      }
    });

    // Get user
    this.user$ = this._userProfile.profile$;

    // Get apps
    this.apps$ = this._uiService.userApplications$;

    this.isAdmin$ = this._userProfile.isAdmin$();
    this.customMenuItems = toSignal(store.select(globalSettingsFeature.selectCustomMenuItems));
    this.hasMultipleWorkspaces = toSignal(store.select(globalSettingsFeature.selectHasMultipleWorkspaces));
  }

  ngOnInit(): void {
    this.currentWorkspace$ = this._workspaceService.currentWorkspace$.pipe(
      filter((workspace) => !!workspace),
      tap((workspace) => this.store.dispatch(GlobalSettingsActions.init({ workspaceId: workspace?.id }))),
    );

    this.baseHref$ = this.currentWorkspace$.pipe(
      filter((workspace) => !!workspace),
      map((workspace) => workspace.hash_id),
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.complete();
  }

  logout(): void {
    this._authService.logout();
  }

  profile(): void {
    window.open(`${environment.apps.myAccount.url}profile`, '_blank');
  }
}
