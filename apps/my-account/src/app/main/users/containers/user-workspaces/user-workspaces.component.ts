import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserWorkspaceItemComponent } from 'app/main/users/components/user-workspace-item/user-workspace-item.component';
import { Store } from '@ngrx/store';
import { UserWorkspacesActions } from '../../store/actions';
import { WorkspaceListDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { toSignal } from '@angular/core/rxjs-interop';
import { userWorkspacesFeature } from 'app/main/users/store/features';

@Component({
  selector: 'app-user-workspaces',
  imports: [CommonModule, TranslocoPipe, MatButton, MatIcon, UserWorkspaceItemComponent],
  template: `
    <div class="flex gap-2 items-center">
      <p class="text-sm">
        {{ 'USERS.DETAIL.WORKSPACES.OTHER_WORKSPACES_PERMISSIONS' | transloco | uppercase }}
      </p>
      <button mat-button type="button" (click)="addWorkspace()">
        <div class="flex gap-2 items-center text-primary dark:text-white">
          <mat-icon>add</mat-icon>
          {{ 'USERS.DETAIL.WORKSPACES.ADD_WORKSPACE' | transloco }}
        </div>
      </button>
    </div>

    @for (workspace of userWorkspaces(); track workspace.id) {
      <app-user-workspace-item
        [workspace]="workspace"
        (editPermissions)="editPermissions(workspace)"
        (removeFromWorkspace)="removeFromWorkspace(workspace)"
      ></app-user-workspace-item>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserWorkspacesComponent {
  protected userWorkspaces: Signal<WorkspaceListDto[]>;

  constructor(private readonly store: Store) {
    this.userWorkspaces = toSignal(this.store.select(userWorkspacesFeature.selectUserWorkspaces));
  }

  editPermissions(workspace: WorkspaceListDto) {
    this.store.dispatch(UserWorkspacesActions.openEditWorkspaceDialog({ workspaceId: workspace.id }));
  }

  removeFromWorkspace(workspace: WorkspaceListDto) {
    this.store.dispatch(UserWorkspacesActions.openRemoveUserFromWorkspaceDialog({ workspaceId: workspace.id }));
  }

  addWorkspace() {
    this.store.dispatch(UserWorkspacesActions.openAddWorkspaceDialog());
  }
}
