import { ChangeDetectionStrategy, Component, computed, OnDestroy, Signal, viewChild } from '@angular/core';

import { UserWorkspaceDialogViewMode, UserWorkspacesDialogViewModel } from 'app/main/users/users.types';
import { Store } from '@ngrx/store';
import { selectFilteredAdminWorkspaces, userWorkspacesFeature } from '../../store/features';
import { UserWorkspacesActions } from '../../store/actions';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { RolesFormComponent } from 'app/main/users/components';
import { toSignal } from '@angular/core/rxjs-interop';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { WorkspaceFormComponent } from '../../components/workspace-form/workspace-form.component';
import { WorkspaceListDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpLoadingShadeComponent } from '@keeps-platform-frontend-workspace/ui/kp-loading-shade';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

const TITLES_MAP = new Map<UserWorkspaceDialogViewMode, string>([
  ['selectWorkspace', marker('WORKSPACE_ROLES_DIALOG.ADD_WORKSPACE')],
  ['selectRoles', marker('WORKSPACE_ROLES_DIALOG.CONFIGURE_ROLES')],
]);

@Component({
  selector: 'app-user-workspace-roles-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    RolesFormComponent,
    TranslocoPipe,
    MatSelectModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    WorkspaceFormComponent,
    KpLoadingShadeComponent,
    MatProgressSpinner,
  ],
  template: `
    @let vm = dialogViewModel();
    <h1 class="text-2xl" matDialogTitle>{{ dialogTitle() | transloco }}</h1>
    @if (vm.viewMode === 'selectWorkspace') {
      <app-workspace-form
        [workspaces]="adminWorkspaces()"
        (workspaceSelected)="onWorkspaceSelected($event)"
      ></app-workspace-form>
    } @else {
      <div mat-dialog-content>
        <p class="mb-4">{{ 'WORKSPACE_ROLES_DIALOG.CONFIGURE_ROLES_LABEL' | transloco }}</p>
        @if (vm.showRolesForm) {
          <app-roles-form
            #rolesForm
            [apps]="vm.workspaceApplications"
            [userRoles]="vm.userApplicationRolesInWorkspace"
            [disabled]="vm.isSaving"
          ></app-roles-form>
        } @else {
          <kp-loading-shade class="h-80 block"></kp-loading-shade>
        }
      </div>
      <div mat-dialog-actions align="end">
        <button matButton mat-dialog-close>
          {{ 'GENERAL.CANCEL' | transloco }}
        </button>

        <button matButton="tonal" (click)="saveRoles()" [disabled]="vm.isSaving">
          @if (vm.isSaving) {
            <mat-progress-spinner diameter="25" mode="indeterminate"></mat-progress-spinner>
          } @else {
            {{ 'GENERAL.SAVE' | transloco }}
          }
        </button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserWorkspaceRolesDialogComponent implements OnDestroy {
  protected readonly dialogViewModel: Signal<UserWorkspacesDialogViewModel>;
  protected readonly adminWorkspaces: Signal<WorkspaceListDto[]>;
  protected readonly rolesForm = viewChild(RolesFormComponent);
  protected readonly dialogTitle: Signal<string>;
  protected readonly nextDisabled: Signal<boolean>;

  constructor(private store: Store) {
    this.dialogViewModel = toSignal(this.store.select(userWorkspacesFeature.selectViewModel));
    this.adminWorkspaces = toSignal(this.store.select(selectFilteredAdminWorkspaces));
    this.dialogTitle = this.getDialogDialogTitle();
  }

  ngOnDestroy() {
    this.store.dispatch(UserWorkspacesActions.onDialogClosed());
  }

  private getDialogDialogTitle() {
    return computed(() => {
      const viewModel = this.dialogViewModel();
      return TITLES_MAP.get(viewModel.viewMode) || '';
    });
  }

  onWorkspaceSelected(workspace: WorkspaceListDto) {
    this.store.dispatch(UserWorkspacesActions.selectWorkspace({ workspaceId: workspace.id }));
  }

  saveRoles() {
    const roles = this.rolesForm()?.getSelectedRolesByApplication();
    this.store.dispatch(UserWorkspacesActions.saveRoles({ roles }));
  }
}
