import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { WorkspaceListDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-workspace-form',
  imports: [
    MatFormField,
    MatSelectModule,
    TranslocoPipe,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  template: `
    <div mat-dialog-content>
      <p class="mb-4">{{ 'WORKSPACE_ROLES_DIALOG.ADD_WORKSPACE_LABEL' | transloco }}</p>

      <mat-form-field class="w-full" appearance="outline">
        <mat-label>{{ 'WORKSPACE_ROLES_DIALOG.WORKSPACE_SELECT_LABEL' | transloco }}</mat-label>
        <mat-select [formControl]="workspaceFormControl">
          @for (workspace of workspaces(); track workspace.id) {
            <mat-option [value]="workspace">
              {{ workspace.name }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close class="text-primary">
        {{ 'GENERAL.CANCEL' | transloco }}
      </button>

      <button mat-button [disabled]="workspaceFormControl.invalid" class="text-primary" (click)="onWorkspaceSelected()">
        {{ 'GENERAL.ADD' | transloco }}
      </button>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceFormComponent {
  workspaces = input<WorkspaceListDto[]>();
  workspaceSelected = output<WorkspaceListDto>();
  protected readonly workspaceFormControl = new FormControl(null, { validators: Validators.required });

  onWorkspaceSelected() {
    this.workspaceSelected.emit(this.workspaceFormControl.value);
  }
}
