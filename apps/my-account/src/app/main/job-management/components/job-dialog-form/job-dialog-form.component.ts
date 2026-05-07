import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobModel } from '../../models';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';

export interface JobModelForm {
  id: FormControl<string>;
  name: FormControl<string>;
  created_date: FormControl<string>;
  updated_date: FormControl<string>;
  workspace: FormControl<string>;
}

@Component({
  selector: 'app-job-dialog-form',
  templateUrl: './job-dialog-form.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class JobDialogFormComponent implements OnChanges {
  @Input() placeholder: string;
  @Input() buttonSubmit: string;
  @Input() item: JobModel;
  @Output() formSubmit = new EventEmitter<Partial<JobModel>>();

  protected readonly maxCharactersHint = `Max 250 `;
  protected readonly form: FormGroup<JobModelForm>;

  constructor(private _formBuilder: FormBuilder) {
    this.form = this.buildForm(_formBuilder);
  }

  get disabledSubmitButton(): boolean {
    return this.form.pristine || this.form.invalid;
  }

  get formValue(): FormGroup<JobModelForm> {
    return this.form;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['item']) {
      this.patchForm(this.item, this.form);
    }
  }

  onSubmit(): void {
    this.formSubmit.emit(this.form.value);
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<JobModelForm> {
    return formBuilder.group<JobModelForm>({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      created_date: new FormControl(null),
      updated_date: new FormControl(null),
      workspace: new FormControl(null),
    });
  }

  private patchForm(item: JobModel, form: FormGroup<JobModelForm>): void {
    if (item) {
      form.patchValue(item, { emitEvent: false });
    }
    form.updateValueAndValidity({ emitEvent: false });
  }
}
