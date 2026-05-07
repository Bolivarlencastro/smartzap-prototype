import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { KpEditDialog, KpEditDialogForm } from './kp-edit-dialog.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'kp-edit-comment-dialog-konquest',
  templateUrl: './kp-edit-dialog.component.html',
  styleUrls: ['./kp-edit-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatIcon,
    MatHint,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class KpEditDialogKonquestComponent {
  title: string;
  model: KpEditDialogForm;
  showDescription: boolean;
  label: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: KpEditDialog,
    private dialogRef: MatDialogRef<KpEditDialogKonquestComponent>,
  ) {
    this.model = data.model;
    this.title = data.title;
    this.label = data.label;
    this.showDescription = data.showDescription;
  }

  onSubmit(): void {
    this.dialogRef.close(this.model);
  }
}
