import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TIME_ZONES } from 'app/shared/model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { EnrollmentUploadComponent } from '../upload/enrollment-upload.component';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-course-import-enrollment-dialog',
  templateUrl: './course-import-enrollment-dialog.component.html',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    EnrollmentUploadComponent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class CourseImportEnrollmentDialogComponent implements OnInit {
  timezone = new UntypedFormControl();
  zones = TIME_ZONES;
  filteredOptions!: Observable<string[]>;
  filename!: string;
  formData: any;

  constructor(
    public dialogRef: MatDialogRef<CourseImportEnrollmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.timezone.valueChanges.pipe(
      startWith(''),
      map((value) => KeepsUtils.filterArrayByString(this.zones, value)),
    );
  }

  onSubmit(): void {
    this.dialogRef.close({
      data: { formData: this.formData, timezone: this.timezone.value },
    });
  }

  onUploadEnrollments({ result, file }: { result: string | ArrayBuffer | null; file: File }): void {
    this.filename = file.name;
    this.formData = { result, file };
  }
}
