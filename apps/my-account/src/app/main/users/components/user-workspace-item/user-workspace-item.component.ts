import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { WorkspaceListDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'app-user-workspace-item',
  imports: [MatIconButton, MatIcon, MatTooltip, TranslocoPipe],
  template: `
    <p>{{ workspace().name }}</p>
    <button
      mat-icon-button
      type="button"
      [matTooltip]="'USERS.DETAIL.WORKSPACES.EDIT_PERMISSIONS' | transloco"
      (click)="onEditPermissions()"
    >
      <mat-icon>edit</mat-icon>
    </button>
    <button
      mat-icon-button
      type="button"
      [matTooltip]="'USERS.DETAIL.WORKSPACES.REMOVE_FROM_WORKSPACE' | transloco"
      (click)="onRemoveFromWorkspace()"
    >
      <mat-icon>delete</mat-icon>
    </button>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 1fr min-content min-content;
      gap: 1rem;
      align-items: center;
      padding: 0.5rem 0;
    }

    .tag-shadow {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserWorkspaceItemComponent {
  workspace = input<WorkspaceListDto>();
  editPermissions = output<void>();
  removeFromWorkspace = output<void>();

  onEditPermissions() {
    this.editPermissions.emit();
  }

  onRemoveFromWorkspace() {
    this.removeFromWorkspace.emit();
  }
}
