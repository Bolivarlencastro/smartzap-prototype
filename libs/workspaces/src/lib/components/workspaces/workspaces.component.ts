import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import {
  AuthService,
  UiService,
  UserProfileService,
  WorkspaceBasicDto,
  WorkspaceService,
  WorkspaceWithServices,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { KpMenuApp, KpMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-menu';
import { WorkspacesActions } from '../../store/actions';
import { WorkspacesSelectors } from '../../store/selectors';
import { WORKSPACES_CONFIG, WorkspacesConfig } from '../../workspaces.module';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WorkspacesListComponent } from '../workspaces-list/workspaces-list.component';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { WorkspaceViewMode } from '../../store/models/workspaces.model';

@Component({
  selector: 'kp-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconButton,
    MatIcon,
    WorkspacesListComponent,
    MatButton,
    MatMiniFabButton,
    MatTooltip,
    KpMenuComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class WorkspacesComponent implements OnInit {
  workspaces$: Observable<WorkspaceBasicDto[]>;
  isLoading$: Observable<boolean>;
  isEmpty$: Observable<boolean>;
  apps$: Observable<KpMenuApp[]>;
  viewMode$: Observable<WorkspaceViewMode>;
  canUseListView$: Observable<boolean>;

  currentWorkspace$: Observable<WorkspaceWithServices>;
  displayAddButton: boolean;

  constructor(
    private readonly store: Store,
    @Inject(WORKSPACES_CONFIG) public workspacesConfig: WorkspacesConfig,
    private readonly _workspacesService: WorkspaceService,
    private readonly _uiService: UiService,
    private readonly _authService: AuthService,
    private readonly _userProfileService: UserProfileService,
    private readonly _location: Location,
  ) {
    this.workspaces$ = this.store.select(WorkspacesSelectors.getWorkspaces);
    this.isLoading$ = this.store.select(WorkspacesSelectors.isLoading);
    this.isEmpty$ = this.store.select(WorkspacesSelectors.isEmpty);
    this.viewMode$ = this.store.select(WorkspacesSelectors.getViewMode);
    this.canUseListView$ = this.store.select(WorkspacesSelectors.canUseListView);
    this.apps$ = this._uiService.userApplications$;
    this.currentWorkspace$ = this._workspacesService.currentWorkspace$;
    this.displayAddButton = this.workspacesConfig?.isMyAccount && this._userProfileService.isKeepsAdmin();
  }

  ngOnInit(): void {
    this.store.dispatch(WorkspacesActions.loadWorkspaces());
    this.store.dispatch(WorkspacesActions.initViewPreferences());
  }

  back(): void {
    this._location.back();
  }

  logout(): void {
    this._authService.logout();
  }

  selectWorkspace(workspace: WorkspaceBasicDto) {
    this.store.dispatch(WorkspacesActions.selectWorkspace({ workspace }));
  }

  onAddWorkspace(): void {
    this._workspacesService.createWorkspace();
  }

  toggleViewMode(): void {
    this.store.dispatch(WorkspacesActions.toggleViewMode());
  }

  getToggleViewTooltipKey(viewMode: WorkspaceViewMode): string {
    return viewMode === 'grid' ? 'WORKSPACES_FEATURE.SWITCH_TO_LIST_VIEW' : 'WORKSPACES_FEATURE.SWITCH_TO_GRID_VIEW';
  }

  getToggleViewIcon(viewMode: WorkspaceViewMode): string {
    return viewMode === 'grid' ? 'view_list' : 'grid_view';
  }
}
