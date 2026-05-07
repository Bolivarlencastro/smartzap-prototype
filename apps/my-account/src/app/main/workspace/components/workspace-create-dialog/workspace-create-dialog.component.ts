import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-workspace-create-dialog',
  templateUrl: './workspace-create-dialog.component.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class WorkspaceCreateDialogComponent {
  nameControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  constructor(public dialogRef: MatDialogRef<WorkspaceCreateDialogComponent>) {}

  submit(value: string): void {
    this.dialogRef.close(value);
  }
}
