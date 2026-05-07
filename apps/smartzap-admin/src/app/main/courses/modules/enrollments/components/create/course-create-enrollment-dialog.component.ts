import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KeepsValidators } from '@keeps-platform-frontend-workspace/ui/validators';
import { EnrollmentsService } from 'app/main/courses/modules/enrollments/services';
import { TIME_ZONES } from 'app/shared/model';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { KpPhoneInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-phone-input';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-course-create-enrollment-dialog',
  templateUrl: './course-create-enrollment-dialog.component.html',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    KpPhoneInputComponent,
    MatError,
    MatInput,
    MatHint,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class CourseCreateEnrollmentDialogComponent implements OnInit {
  form: UntypedFormGroup;
  zones = TIME_ZONES;
  filteredOptions!: Observable<string[]> | undefined;
  title!: string;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CourseCreateEnrollmentDialogComponent>,
    private _enrollmentsService: EnrollmentsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this._formBuilder.group({
      name: [data?.name, Validators.required],
      email: [data?.email, Validators.email],
      phone: [
        data?.phone?.charAt(0) === '#' ? data?.phone?.replace('#', '+') : data?.phone?.replace(/^/, '+'),
        Validators.required,
      ],
      tags: [data?.tags, Validators.maxLength(30)],
      timezone: ['', data?.type ? '' : [Validators.required, KeepsValidators.requireTimezone]],
    });

    this.form.get('phone')?.valueChanges.subscribe((value) => {
      if (value.length === 14) {
        this.getUserByNumber(value.replace('+', ''));
      }
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.form.get('timezone')?.valueChanges.pipe(
      startWith(''),
      map((value) => KeepsUtils.filterArrayByString(this.zones, value)),
    );
  }

  onSubmit(): void {
    this.dialogRef.close({ data: this.form.getRawValue() });
  }

  getUserByNumber(userNumber: string): void {
    this._enrollmentsService
      .getUserByNumber(userNumber)
      .pipe(filter(({ result }) => result?.length))
      .subscribe((profile: any) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { name, email, tags } = profile.result[0];
        this.form.patchValue({ name, email, tags });
      });
  }
}
