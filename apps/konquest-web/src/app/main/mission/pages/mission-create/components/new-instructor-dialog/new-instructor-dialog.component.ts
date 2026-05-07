import { Component, OnDestroy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NewInstructorData } from 'app/main/mission/mission.model';
import { Observable, Subscription } from 'rxjs';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatRipple } from '@angular/material/core';

import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'new-instructor-dialog',
  templateUrl: './new-instructor-dialog.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatIconButton,
    MatIcon,
    CdkScrollable,
    MatDialogContent,
    MatRipple,
    MatFormField,
    MatInput,
    MatPrefix,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
  ],
})
export class NewInstructorDialogComponent implements OnDestroy {
  previewSrc!: string;
  newInstructorForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
  });
  private selectedImage!: File;
  private readImageSubscription!: Subscription;

  constructor(public dialogRef: MatDialogRef<NewInstructorDialogComponent>) {}

  ngOnDestroy() {
    this.readImageSubscription?.unsubscribe();
  }

  onSelectAvatarImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.readImageSubscription = this.readImage(file).subscribe((result) => {
      this.previewSrc = result;
      this.selectedImage = file;
    });
  }

  private readImage(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        observer.next(result?.toString());
      };

      reader.onerror = () => {
        observer.error(new Error('Failure to load image'));
      };

      reader.readAsDataURL(file);
    });
  }

  addInstructor() {
    if (this.newInstructorForm.invalid) {
      return;
    }

    const formData = this.newInstructorForm.getRawValue() as NewInstructorData;
    formData.avatar = this.selectedImage;
    formData.avatarData = this.previewSrc;
    this.dialogRef.close(formData);
  }
}
