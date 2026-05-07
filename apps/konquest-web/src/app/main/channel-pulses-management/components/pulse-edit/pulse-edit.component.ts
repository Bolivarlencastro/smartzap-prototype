import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Pulse } from '@core/model/pulse.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FileUploadComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';

@Component({
  selector: 'kp-pulse-edit',
  templateUrl: 'pulse-edit.component.html',
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatIcon,
    MatDialogContent,
    FileUploadComponent,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
    KpContentIconName,
  ],
})
export class PulseEditComponent {
  dialogForm: UntypedFormGroup;
  coverImage: string | undefined;
  pulse: Pulse;
  contentUrl: string;

  constructor(
    public dialogRef: MatDialogRef<PulseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pulse: Pulse; url: string },
  ) {
    this.pulse = data.pulse;
    this.contentUrl = data.url;
    this.coverImage = this.pulse.holder_image;
    this.dialogForm = new UntypedFormGroup({
      name: new UntypedFormControl(data.pulse.name),
      description: new UntypedFormControl(data.pulse.description),
    });
  }

  onSubmit(): void {
    const formData = this.dialogForm.getRawValue();
    formData.coverImage = this.coverImage;
    this.dialogRef.close(formData);
    this.dialogForm.reset();
  }

  coverImageChange(coverImage: string): void {
    this.coverImage = coverImage;
    this.dialogForm.markAsDirty();
  }

  close(): void {
    this.dialogForm.reset();
    this.dialogRef.close();
  }
}
