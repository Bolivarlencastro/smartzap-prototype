import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPhoneInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-phone-input';
import { User } from '../../model';

@Component({
  selector: 'app-edit-user-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatError,
    MatHint,
    MatInput,
    MatButton,
    KpPhoneInputComponent,
    TranslocoPipe,
  ],
  template: `
    <span mat-dialog-title class="text-lg">{{ 'GENERAL.EDIT' | transloco }} {{ 'USERS.TABLE.NAME' | transloco }}</span>

    <mat-dialog-content cdkScrollable>
      <form [formGroup]="form" class="flex flex-col mt-2 gap-3.5">
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'GENERAL.PHONE' | transloco }}</mat-label>
          <kp-phone-input
            [enableSearch]="true"
            [preferredCountries]="['br', 'us']"
            formControlName="phone"
          ></kp-phone-input>
          <mat-error>{{ 'GENERAL.REQUIRED_INPUT' | transloco }}</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'GENERAL.NAME' | transloco }}</mat-label>
          <input matInput formControlName="name" />
          <mat-error>{{ 'GENERAL.REQUIRED_INPUT' | transloco }}</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'GENERAL.EMAIL' | transloco }}</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>

        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'GENERAL.TAGS' | transloco }}</mat-label>
          <input #tagInput matInput formControlName="tags" maxlength="30" />
          <mat-hint align="end">{{ tagInput.value?.length || 0 }}/30</mat-hint>
        </mat-form-field>

        <div class="border-t pt-3 mt-1">
          <p class="text-xs text-gray-400 mb-3">{{ 'USERS.DIALOG.HIERARCHY_SECTION' | transloco }}</p>

          <div class="flex flex-col gap-3.5">
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>{{ 'USERS.TABLE.LEADER' | transloco }}</mat-label>
              <input matInput formControlName="leader" />
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>{{ 'USERS.TABLE.DEPARTMENT' | transloco }}</mat-label>
              <input matInput formControlName="department" />
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>{{ 'USERS.TABLE.SUB_DEPARTMENT' | transloco }}</mat-label>
              <input matInput formControlName="sub_department" />
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>{{ 'USERS.TABLE.AREA' | transloco }}</mat-label>
              <input matInput formControlName="area" />
            </mat-form-field>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="pt-4">
      <button mat-button mat-dialog-close>{{ 'GENERAL.CANCEL' | transloco }}</button>
      <button mat-flat-button color="primary" class="mr-3" (click)="onSubmit()" [disabled]="form.invalid">
        {{ 'GENERAL.OK' | transloco }}
      </button>
    </mat-dialog-actions>
  `,
})
export class EditUserDialogComponent {
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
    const phone = data?.phone ?? '';
    this.form = this._fb.group({
      name: [data?.name, Validators.required],
      email: [data?.email, Validators.email],
      phone: [phone.charAt(0) === '#' ? phone.replace('#', '+') : phone.replace(/^(?!\+)/, '+'), Validators.required],
      tags: [data?.tags, Validators.maxLength(30)],
      leader: [data?.leader ?? ''],
      department: [data?.department ?? ''],
      sub_department: [data?.sub_department ?? ''],
      area: [data?.area ?? ''],
    });
  }

  onSubmit(): void {
    this.dialogRef.close({ data: this.form.getRawValue() });
  }
}
