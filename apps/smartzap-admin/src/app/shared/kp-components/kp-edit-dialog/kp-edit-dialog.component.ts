import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

export interface KPEditDialogData {
  title: string;
  form: KPEditDialogFormData;
}

export interface KPEditDialogFormData {
  name: string;
  description: string;
}

@Component({
  selector: 'kp-edit-comment-dialog',
  templateUrl: './kp-edit-dialog.component.html',
  styleUrls: ['./kp-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
  ],
})
export class KpEditDialogComponent implements OnInit {
  title!: string;
  model!: KPEditDialogFormData;

  @ViewChild('form') dialogForm!: NgForm;

  constructor(
    public dialogRef: MatDialogRef<KpEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KPEditDialogData,
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.model = this.data.form;
  }

  onSubmit(): void {
    this.dialogRef.close({ ...this.model });
  }
}
