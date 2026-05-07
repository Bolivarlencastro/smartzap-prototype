import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpWhatsAppMarkdownHelperComponent } from '@keeps-platform-frontend-workspace/ui/kp-whatsapp-markdown-helper';

export interface EditDialogData {
  title: string;
  form: EditDialogFormData;
  useMarkdown?: boolean;
}
export interface EditDialogFormData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
    KpWhatsAppMarkdownHelperComponent,
  ],
})
export class EditDialogComponent implements OnInit {
  title!: string;
  form!: FormGroup;
  useMarkdown!: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData,
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.useMarkdown = this.data.useMarkdown ?? false;
    this.form = new FormGroup({
      name: new FormControl(this.data.form.name),
      description: new FormControl(this.data.form.description),
    });
  }

  onSubmit(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
