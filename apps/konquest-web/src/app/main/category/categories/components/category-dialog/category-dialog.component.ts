import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Category } from '@core/model/category.model';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger, MatOption } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';

import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatSelectTrigger,
    MatIcon,
    MatOption,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class CategoryDialogComponent {
  form: UntypedFormGroup;
  categories: any[];

  constructor(
    private _dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private _formBuilder: UntypedFormBuilder,
  ) {
    this.categories = [
      'cattle',
      'admin',
      'comb',
      'communications',
      'design',
      'development',
      'digital-marketing',
      'direito',
      'educacao',
      'email',
      'engenharias',
      'entrepreneurship',
      'entretenimento',
      'estudos-academicos',
      'farm',
      'finance',
      'financial-education',
      'frame',
      'garden',
      'grain',
      'group',
      'health-and-fitness',
      'imoveis',
      'iphone',
      'language',
      'laptop',
      'leadership',
      'lifestyle',
      'lotion',
      'management',
      'marketing',
      'office-productivity',
      'personal-card',
      'personal-development',
      'project-management',
      'recursos-humanos',
      'sales',
      'social-media',
      'strategy',
      'tag',
      'technology',
      'time',
      'verified',
      'web-design',
      'wrong',
    ];

    const name = data?.name ? data.name : '';
    const image = data?.image ? data.image : '';

    this.form = this._formBuilder.group({
      name: [name, Validators.required],
      image: [image, Validators.required],
    });
  }

  get image(): any {
    return (this.form.get('image') as UntypedFormControl).value;
  }

  onClick(): void {
    const data = this.form.getRawValue();
    this._dialogRef.close(data);
  }
}
