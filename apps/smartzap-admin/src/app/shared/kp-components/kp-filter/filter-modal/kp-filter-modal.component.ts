import { LowerCasePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Category } from '@app/main/courses/model';
import { CoursesFilter } from '@app/main/courses/store/reducers/courses.reducer';
import { TranslocoPipe } from '@jsverse/transloco';

interface ModalFilterData {
  filters: CoursesFilter;
  categories: Category[];
  languages: string[];
  statuses?: string[];
}

interface FilterForm {
  languages: FormControl<string[]>;
  categories: FormControl<string[]>;
  statuses: FormControl<string[]>;
}

@Component({
  selector: 'kp-filter-modal',
  templateUrl: './kp-filter-modal.component.html',
  styleUrls: ['./kp-filter-modal.component.scss'],
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatIcon,
    MatDialogContent,
    MatCheckbox,
    MatDivider,
    MatRadioGroup,
    MatRadioButton,
    MatDialogActions,
    MatButton,
    LowerCasePipe,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class KpFilterModalComponent {
  form: FormGroup<FilterForm>;

  constructor(
    private readonly dialogRef: MatDialogRef<KpFilterModalComponent>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ModalFilterData,
  ) {
    this.buildForm();
  }

  onApply() {
    this.dialogRef.close({
      languages: this.form.get('languages').value,
      categories: this.form.get('categories').value,
      statuses: this.form.get('statuses').value,
    });
  }

  onClear() {
    this.dialogRef.close({ languages: [], categories: [], statuses: [] });
  }

  updateLanguageSelection(lang: string, isChecked: boolean) {
    const languagesControl = this.form.get('languages');
    const currentLangs = languagesControl.value || [];

    if (isChecked) {
      languagesControl.setValue([...currentLangs, lang]);
      return;
    }

    languagesControl.setValue(currentLangs.filter((l) => l !== lang));
  }

  private buildForm() {
    const { languages, categories, statuses } = this.data.filters;
    this.form = this.formBuilder.group<FilterForm>({
      languages: new FormControl(languages ?? []),
      categories: new FormControl(categories ?? []),
      statuses: new FormControl(statuses ?? []),
    });
  }
}
