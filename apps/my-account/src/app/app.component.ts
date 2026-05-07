import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  AuthService,
  CustomMenuItem,
  UiService,
  UserProfile,
  UserProfileService,
  Workspace,
  WorkspaceService,
  WorkspaceWithServices,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLayoutModule } from '@keeps-platform-frontend-workspace/layout';
import { KpChatbotComponent } from '@keeps-platform-frontend-workspace/ui/kp-chatbot';
import { KpMenuApp, KpMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-menu';
import { UserMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-user-menu';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { WorkspaceCreateDialogComponent } from './main/workspace/components';
import * as GlobalSettingsActions from './shared/store/actions';
import { globalSettingsFeature } from './shared/store/features';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app',
  templateUrl: './app.component.html',
  imports: [FuseLayoutModule, KpMenuComponent, UserMenuComponent, KpChatbotComponent, AsyncPipe],
})
export class AppComponent implements OnDestroy {
  private _unsubscribeAll: Subject<Subscription>;

  user$: Observable<UserProfile>;
  apps$: Observable<KpMenuApp[]>;
  isAdmin$: Observable<boolean>;
  currentWorkspace$: Observable<WorkspaceWithServices | undefined>;
  baseHref$: Observable<string>;
  baseHref: string;
  customMenuItems: Signal<CustomMenuItem[]>;
  hasMultipleWorkspaces: Signal<boolean>;

  constructor(
    private readonly _authService: AuthService,
    private readonly _userProfileService: UserProfileService,
    private readonly _uiService: UiService,
    private readonly _router: Router,
    private readonly _workspaceService: WorkspaceService,
    private readonly _dialog: MatDialog,
    private readonly store: Store,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    // Get user
    this.user$ = this._userProfileService.profile$;

    // Get apps
    this.apps$ = this._uiService.userApplications$;

    this.isAdmin$ = this._userProfileService.isAdmin$();
    this.currentWorkspace$ = this._workspaceService.currentWorkspace$.pipe(
      filter((workspace) => !!workspace),
      tap((workspace) => this.store.dispatch(GlobalSettingsActions.init({ workspaceId: workspace?.id }))),
    );

    this.baseHref$ = this.currentWorkspace$.pipe(
      filter((workspace) => !!workspace),
      map((workspace) => {
        this.baseHref = workspace.hash_id;
        return this.baseHref;
      }),
    );

    this.customMenuItems = toSignal(store.select(globalSettingsFeature.selectCustomMenuItems));
    this.hasMultipleWorkspaces = toSignal(store.select(globalSettingsFeature.selectHasMultipleWorkspaces));
    this._workspaceService.createWorkspace$.subscribe(() => this.createWorkspace());
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  logout() {
    this._authService.logout();
  }

  profile(): void {
    const isMyAccount = environment.name === 'MyAccount';
    if (isMyAccount) {
      this._router.navigate(['/user', 'profile']);
      return;
    }

    window.open(`${environment.apps.myAccount.url}profile`, '_blank');
  }

  private createWorkspace() {
    const dialogRef = this._dialog.open(WorkspaceCreateDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(
        filter((name) => !!name),
        map((name) => ({ name }) as Partial<Workspace>),
      )
      .subscribe((workspace) => this.store.dispatch(GlobalSettingsActions.createWorkspace({ workspace })));
  }
}
